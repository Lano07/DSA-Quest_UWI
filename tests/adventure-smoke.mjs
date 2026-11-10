// DSA Quest adventure integration smoke test. Run: node tests/adventure-smoke.mjs
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(import.meta.dirname||new URL('.',import.meta.url).pathname,'..');
const read=name=>readFileSync(resolve(root,name),'utf8');
const elements=new Map(),events={};
function element(selector){
  if(!elements.has(selector))elements.set(selector,{
    textContent:'',innerHTML:'',value:'',disabled:false,style:{},
    classList:{add(){},remove(){},toggle(){}},
    addEventListener(){}
  });
  return elements.get(selector);
}
const location={hash:'#home',origin:'https://lano07.github.io',hostname:'lano07.github.io',port:'',protocol:'https:'};
const window={scrollTo(){},addEventListener(){},history:{replaceState(_a,_b,url){location.hash=url;}}};
const document={
  querySelector:element,querySelectorAll:()=>[],
  addEventListener(type,fn){(events[type]??=[]).push(fn);},
  body:{classList:{remove(){},toggle(){}}}
};
const saved={};
const localStorage={
  getItem:k=>saved[k]||null,
  setItem:(k,value)=>{saved[k]=value;}
};
const ctx={
  window,document,location,localStorage,
  setTimeout:()=>1,clearTimeout(){},
  setInterval:()=>1,clearInterval(){},
  confirm:()=>true,prompt:()=>null,
  Event:class Event{}
};
for(const file of ['app.js','adventure-data.js','adventure-solutions.js','adventure.js']){
  vm.runInNewContext(read(file),ctx,{filename:file,timeout:5000});
}
const api=window.DSAQuestBridge,adventure=window.DSAAdventure,data=window.DSAAdventureData;
assert.ok(api&&adventure&&data,'Course scripts did not load');
const ids=adventure.chapters.flatMap(c=>c.items);
assert.equal(adventure.chapters.length,10);
assert.equal(ids.length,35);
assert.equal(new Set(ids).size,35);
const available=new Set([...api.challenges,...data.extras].map(x=>x.id));
for(const id of ids){
  assert.ok(available.has(id),'Missing mission '+id);
  assert.ok(data.meta[id]?.teach,'Missing explanation '+id);
  assert.ok(data.solutions[id]?.includes('main()'),'Missing C++ solution '+id);
}
const home=adventure.renderHome();
assert.match(home,/Start adventure/);
assert.match(home,/aq-scene/);
const map=adventure.renderMap();
assert.match(map,/The First Spark/);
assert.match(map,/Graph Gate/);
adventure.open('hello');
assert.equal(api.state.questActive,'hello');
assert.equal(location.hash,'#quest');
const lesson=adventure.renderPage('quest');
assert.match(lesson,/aq-lesson-split/);
assert.match(lesson,/aqCode/);
assert.match(lesson,/aqTerminalText/);
assert.match(lesson,/Check mission/);
assert.match(lesson,/Your mission/);
const clickCallbacks=events.click||[];
function click(name){
  const t={
    getAttribute:key=>key===name?'':null,
    closest:selector=>selector==='['+name+']'?t:null
  };
  for(const fn of clickCallbacks)fn({target:t,preventDefault(){}});
}
element('#aqCode').value=data.solutions.hello;
element('#aqInput').value='custom input';
api.executeCPP=async()=>({output:'DSA Quest',exitCode:0,stderr:''});
click('data-quest-run');
await new Promise(resolve=>setImmediate(resolve));
assert.equal(Boolean(api.state.questDone.hello),false,'Run should not grade submissions');
click('data-quest-check');
await new Promise(resolve=>setImmediate(resolve));
assert.equal(api.state.questDone.hello,true,'Check should award completion');
assert.ok(api.state.xp>=40);
assert.match(adventure.renderPage('quest'),/Next mission/);
assert.ok(JSON.parse(saved['dsa-quest-uwi-v1']).questDone.hello,'Progress did not persist');
const index=read('index.html'),workflow=read('.github/workflows/pages.yml');
for(const filename of ['adventure.js','adventure-data.js','adventure-solutions.js','adventure.css']){
  assert.ok(index.includes(filename),'HTML missing '+filename);
  assert.ok(workflow.includes(filename),'Pages workflow missing '+filename);
}
console.log('PASS: 10 illustrated chapters, 35 missions, split IDE, Run/Check, XP save, route and deployment assets');
