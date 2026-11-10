import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

export const root=resolve(import.meta.dirname,'..');
export const read=name=>readFileSync(resolve(root,name),'utf8').replace(/\r\n/g,'\n');
export function createApp(initial={}){
  const elements=new Map(),listeners=new Map(),saved={'dsa-quest-uwi-v1':JSON.stringify(initial)};
  function listen(scope,type,callback){const key=scope+':'+type;if(!listeners.has(key))listeners.set(key,[]);listeners.get(key).push(callback);}
  function element(selector){
    if(!elements.has(selector))elements.set(selector,{innerHTML:'',textContent:'',value:'',disabled:false,style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},addEventListener:(type,callback)=>listen(selector,type,callback),setAttribute(){},focus(){}});
    return elements.get(selector);
  }
  const location={hash:'#home',origin:'https://lano07.github.io',hostname:'lano07.github.io',port:'',protocol:'https:'};
  const window={scrollTo(){},confirm:()=>true,addEventListener:(type,callback)=>listen('window',type,callback),history:{replaceState(_state,_title,hash){location.hash=hash;}}};
  const document={querySelector:element,querySelectorAll:()=>[],addEventListener:(type,callback)=>listen('document',type,callback),body:{classList:{remove(){},toggle(){}}}};
  const context=vm.createContext({window,document,location,localStorage:{getItem:key=>saved[key]||null,setItem:(key,value)=>{saved[key]=value;}},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},confirm:()=>true,prompt:()=>null,Event:class Event{},Worker:InterpreterWorker});
  for(const file of ['app.js','adventure-data.js','adventure-solutions.js','quest-checkpoints.js','world-art.js','studio.js','adventure.js'])vm.runInContext(read(file),context,{filename:file,timeout:5000});
  async function click(attribute,value=''){
    const target={dataset:{[attribute.replace(/^data-/,'').replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]:value},getAttribute:key=>key===attribute?String(value):null,closest:selector=>selector==='['+attribute+']'?target:null};
    for(const scope of ['#app','document'])for(const callback of listeners.get(scope+':click')||[])await callback({target,preventDefault(){}});
    await new Promise(resolve=>setImmediate(resolve));
  }
  async function input(selector,value){const target=element(selector);target.id=selector.slice(1);target.value=value;for(const scope of ['#app','document'])for(const callback of listeners.get(scope+':input')||[])await callback({target});}
  return {window,element,click,input,saved,context,api:window.DSAQuestBridge,adventure:window.DSAAdventure,studio:window.QuestStudio,data:window.DSAAdventureData};
}
const interpreterSource=read('vendor/jscpp.js');
export class InterpreterWorker{
  constructor(){this.stopped=false;this.context=vm.createContext({onmessage:null,postMessage:message=>queueMicrotask(()=>{if(!this.stopped)this.onmessage?.({data:message});})});vm.runInContext(interpreterSource,this.context,{timeout:3000});}
  postMessage(data){this.context.request=data;try{vm.runInContext('onmessage({data:request})',this.context,{timeout:3000});}catch(error){queueMicrotask(()=>this.onerror?.(error));}}
  terminate(){this.stopped=true;}
}
