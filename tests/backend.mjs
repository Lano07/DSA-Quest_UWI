import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {root} from './harness.mjs';
const port=18787,base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['backend/server.mjs'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const startup=setTimeout(()=>child.kill(),8000);
try{
  await Promise.race([once(child.stdout,'data'),once(child,'error').then(([error])=>{throw error;})]);
  clearTimeout(startup);
  for(const path of ['/','/world-art.js','/studio.js','/quest-checkpoints.js','/vendor/jscpp.js']){
    const response=await fetch(base+path);assert.equal(response.status,200,path);assert.ok((await response.text()).length>100,path);
  }
  assert.equal((await fetch(base+'/.git/config')).status,404);
  assert.equal((await fetch(base+'/backend/server.mjs')).status,404);
  const invalid=await fetch(base+'/api/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:'int main(){}',files:{'-bad.cpp':'x'}})});
  assert.equal(invalid.status,400);
  assert.match((await invalid.json()).error,/Invalid virtual file/);
  console.log('PASS: local HTTP assets, bundled worker delivery, private-source exclusion, invalid virtual-file rejection.');
}finally{clearTimeout(startup);child.kill();}
