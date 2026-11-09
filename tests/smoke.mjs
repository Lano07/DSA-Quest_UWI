// Minimal no-dependency smoke tests for the browser app and its content.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import vm from 'node:vm';

const root=resolve(import.meta.dirname||new URL('.',import.meta.url).pathname,'..');
const index=readFileSync(resolve(root,'index.html'),'utf8');
for(const path of ['app.js','style.css','extras.css','backend/server.mjs']){
  assert.ok(existsSync(resolve(root,path)),path+' missing');
}
assert.match(index,/app\.js/);
assert.match(index,/extras\.css/);
const source=readFileSync(resolve(root,'app.js'),'utf8');
const instrumented=source.replace(
  'render();\n})();',
  'globalThis.TEST={lessons,challenges,modules,framesFor,labLabels,renderHome,renderPlayground,renderPractice,renderRoadmap,previewLab:(name)=>{labMode=name;labStep=0;return renderLab();}};render();\n})();'
);
assert.notEqual(instrumented,source,'Smoke test injection not found');
const els=new Map();
function element(id){
  if(!els.has(id))els.set(id,{
    innerHTML:'',textContent:'',value:'',style:{},
    classList:{add(){},remove(){},toggle(){}},addEventListener(){}
  });
  return els.get(id);
}
const context={
  document:{querySelector:element,querySelectorAll:()=>[],addEventListener(){}},
  window:{addEventListener(){},scrollTo(){}},
  location:{hash:'',protocol:'https:',hostname:'lano07.github.io',origin:'https://lano07.github.io',port:''},
  localStorage:{getItem:()=>null,setItem(){}},
  setTimeout,clearTimeout,setInterval,clearInterval,
};
vm.runInNewContext(instrumented,context,{filename:'app.js',timeout:3000});
const {TEST}=context;
assert.ok(TEST,'App did not load');
assert.equal(TEST.modules.length,14);
assert.ok(TEST.lessons.length>=60);
assert.ok(TEST.challenges.length>=20);
assert.equal(new Set(TEST.lessons.map(x=>x.id)).size,TEST.lessons.length,'Duplicate lesson ids');
assert.equal(new Set(TEST.challenges.map(x=>x.id)).size,TEST.challenges.length,'Duplicate challenge ids');
for(const l of TEST.lessons){
  assert.ok(TEST.modules.some(m=>m.id===l.module),'Unknown module '+l.module);
  assert.ok(l.question&&l.options.length>=2);
  assert.ok(l.answer>=0&&l.answer<l.options.length,'Invalid answer '+l.id);
}
for(const challenge of TEST.challenges){
  assert.ok(challenge.starter.includes('main()'),'Invalid C++ starter '+challenge.id);
  assert.equal(typeof challenge.expected,'string');
  assert.ok(!challenge.tests||challenge.tests.every(t=>typeof t.input==='string'&&typeof t.expected==='string'));
}
for(const mode of Object.keys(TEST.labLabels)){
  const frames=TEST.framesFor(mode);
  assert.ok(frames.length>=2,'Lab has too few frames '+mode);
  assert.ok(frames.every(frame=>typeof frame.explain==='string'),'Lab missing explanations '+mode);
  assert.match(TEST.previewLab(mode),/STEP 1/,mode+' does not render');
}
assert.match(TEST.renderPlayground(),/runnerEndpoint/);
assert.match(TEST.renderPractice(),/Code Gym|CODE GYM|SKILL BUILDER/);
assert.match(TEST.renderRoadmap(),/COMP 2611/);
assert.match(TEST.renderHome(),/Continue learning/);
console.log('PASS: '+TEST.lessons.length+' lessons, '+TEST.challenges.length+' missions, '+Object.keys(TEST.labLabels).length+' labs and app navigation render.');
