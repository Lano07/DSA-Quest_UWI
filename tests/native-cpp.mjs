import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {createApp,root} from './harness.mjs';
const {adventure,data}=createApp();
const directory=join(root,'.test-work');
mkdirSync(directory,{recursive:true});
let count=0;
for(const mission of adventure.missions){
  const code=data.solutions[mission.id];if(!code)continue;
  const source=join(directory,mission.id+'.cpp'),executable=join(directory,mission.id+(process.platform==='win32'?'.exe':''));
  writeFileSync(source,code);
  execFileSync('g++',['-std=c++17','-Wall','-Wextra',source,'-o',executable],{timeout:20000,stdio:'pipe'});
  for(const test of [{input:mission.input,expected:mission.expected},...(mission.tests||[])]){
    const output=execFileSync(executable,[],{input:test.input||'',encoding:'utf8',timeout:3000});
    assert.equal(output.trim().replace(/\s+/g,' '),test.expected.trim().replace(/\s+/g,' '),mission.id);count++;
  }
}
console.log(`PASS: ${count} reference-solution cases compiled and executed with native C++17.`);
