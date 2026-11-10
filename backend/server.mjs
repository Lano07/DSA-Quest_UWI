/**
 * DSA Quest local full C++ runner.
 * Requirements: Node 20+ and Docker with gcc:14 pulled ahead of time.
 * Intentionally binds to 127.0.0.1. DO NOT put this server on the public internet.
 * Docker adds isolation but is not a substitute for hardened public sandboxing.
 */
import http from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, readFile, readdir, chmod, rm, open } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, extname } from 'node:path';
import { randomUUID } from 'node:crypto';

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 8787);
const ROOT = resolve(import.meta.dirname || new URL('.', import.meta.url).pathname, '..');
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'};
const VALID_NAME = /^[a-zA-Z0-9_][a-zA-Z0-9_.-]{0,63}$/;
let active = 0;
const MAX_ACTIVE = 2;
const json = (res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
async function body(req){
  let parts=[],len=0;
  for await(const chunk of req){
    len += chunk.length;
    if(len>750000){const e=new Error('Request too large');e.status=413;throw e;}
    parts.push(chunk);
  }
  try{return JSON.parse(Buffer.concat(parts).toString('utf8'));}catch{const e=new Error('Expected JSON');e.status=400;throw e;}
}
async function readSafe(file,limit=128000){
  let handle;
  try{
    handle=await open(file,'r');
    const buffer=Buffer.alloc(limit+1);
    const {bytesRead}=await handle.read(buffer,0,limit+1,0);
    return buffer.subarray(0,Math.min(bytesRead,limit)).toString('utf8')+(bytesRead>limit?'\n[truncated]':'');
  }catch{return '';}finally{await handle?.close();}
}
function docker(args,limitMs=16000){
  return new Promise((resolve,reject)=>{
    const child=spawn('docker',args,{stdio:['ignore','pipe','pipe']});
    let log='',timer,finished=false;
    const finish=(err,code)=>{if(finished)return;finished=true;clearTimeout(timer);err?reject(err):resolve({code,log});};
    child.stdout.on('data',b=>{log+=b.toString().slice(0,2000);});
    child.stderr.on('data',b=>{log+=b.toString().slice(0,2000);});
    child.on('error',err=>finish(new Error('Docker is unavailable. Install Docker, start it, then run docker pull gcc:14. '+err.message)));
    child.on('close',code=>finish(null,code));
    timer=setTimeout(()=>{child.kill('SIGKILL');finish(new Error('Container exceeded the 16-second limit.'));},limitMs);
  });
}
async function compileAndRun(request){
  const code=request.code,stdin=request.stdin||'';
  if(typeof code!=='string'||code.length>160000||typeof stdin!=='string'||stdin.length>50000)throw Object.assign(new Error('Invalid code or stdin'),{status:400});
  const incoming=request.files&&typeof request.files==='object'&&!Array.isArray(request.files)?request.files:{};
  if(Object.keys(incoming).length>24)throw Object.assign(new Error('Too many files'),{status:400});
  const dir=await mkdtemp(join(tmpdir(),'dsa-quest-'));
  const name='dsa-'+randomUUID().slice(0,16);
  let launched=false;
  try{
    await chmod(dir,0o777);
    const files={...incoming,'main.cpp':code};
    for(const [name,content] of Object.entries(files)){
      if(!VALID_NAME.test(name)||name.startsWith('.')||typeof content!=='string'||content.length>160000)throw Object.assign(new Error('Invalid virtual file: '+name),{status:400});
      await writeFile(join(dir,name),content,{mode:0o666,flag:'w'});
      await chmod(join(dir,name),0o666); // isolated virtual workspace must be writable by the container user
    }
    await writeFile(join(dir,'.stdin'),stdin,{mode:0o644});
    const command = [
      'g++ -std=c++17 -O0 -Wall -Wextra *.cpp -o .dsa-main 2> .compile.err',
      'status=$?',
      'if [ "$status" -eq 0 ]; then',
      '  timeout 4s ./.dsa-main < .stdin > .stdout 2> .stderr',
      '  status=$?',
      'fi',
      'printf "%s" "$status" > .exitcode',
      'exit 0'
    ].join('\n');
    const args=[
      'run','--rm','--name',name,'--network','none',
      '--cpus','1','--memory','384m','--pids-limit','64','--read-only',
      '--ulimit','fsize=1048576:1048576',
      '--cap-drop','ALL','--security-opt','no-new-privileges',
      '--tmpfs','/tmp:rw,nosuid,size=64m',
      '--user','65534:65534','-w','/work',
      '-v',dir+':/work:rw','gcc:14','sh','-c',command
    ];
    launched=true;
    const result=await docker(args);
    if(result.code!==0)throw Object.assign(new Error('Compiler container failed. Run docker pull gcc:14. '+result.log.slice(0,1000)),{status:503});
    const output=await readSafe(join(dir,'.stdout'));
    const compileError=await readSafe(join(dir,'.compile.err'));
    const runtimeError=await readSafe(join(dir,'.stderr'));
    const exitCode=Number((await readSafe(join(dir,'.exitcode'),20)).trim());
    const generated={};
    const listed=await readdir(dir,{withFileTypes:true});
    for(const file of listed){
      if(!file.isFile()||!VALID_NAME.test(file.name)||file.name.startsWith('.')||file.name==='main.cpp')continue;
      if(Object.keys(generated).length>=24)break;
      generated[file.name]=await readSafe(join(dir,file.name),160000);
    }
    return {stdout:output,stderr:compileError+runtimeError,exitCode:Number.isFinite(exitCode)?exitCode:1,files:generated};
  }finally{
    if(launched)await docker(['rm','-f',name],5000).catch(()=>{});
    await rm(dir,{recursive:true,force:true,maxRetries:3,retryDelay:50});
  }
}
const server=http.createServer(async(req,res)=>{
  try{
    const path=(req.url||'/').split('?')[0];
    if(req.method==='GET'&&path==='/api/health')return json(res,200,{ok:true,compiler:'gcc:14 via Docker',isolation:'local-only'});
    if(req.method==='POST'&&path==='/api/run'){
      if(active>=MAX_ACTIVE)return json(res,429,{error:'Compiler is busy. Try again in a moment.'});
      active++;
      try{return json(res,200,await compileAndRun(await body(req)));}
      finally{active--;}
    }
    if(req.method!=='GET')return json(res,405,{error:'Method not supported'});
    const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/style.css':'style.css','/extras.css':'extras.css','/adventure.css':'adventure.css','/adventure-data.js':'adventure-data.js','/adventure-solutions.js':'adventure-solutions.js','/adventure.js':'adventure.js','/world-art.js':'world-art.js','/studio.js':'studio.js','/quest-checkpoints.js':'quest-checkpoints.js','/vendor/jscpp.js':'vendor/jscpp.js','/vendor/JSCPP-LICENSE':'vendor/JSCPP-LICENSE'};
    if(!Object.hasOwn(files,path))return json(res,404,{error:'Not found'});
    const filename=files[path],data=await readFile(join(ROOT,filename));
    res.writeHead(200,{'Content-Type':MIME[extname(filename)]||'application/octet-stream'});
    res.end(data);
  }catch(err){json(res,err.status||500,{error:err.message||'Internal error'});}
});
server.listen(PORT,HOST,()=>console.log('DSA Quest local compiler: http://'+HOST+':'+PORT));
