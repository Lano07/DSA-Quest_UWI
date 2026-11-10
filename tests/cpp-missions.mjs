import assert from 'node:assert/strict';
import {createApp} from './harness.mjs';
const {api,adventure,data}=createApp();
const normalize=value=>String(value).trim().replace(/\s+/g,' ');
let cases=0;
const failures=[];
for(const mission of adventure.missions){
  const code=data.solutions[mission.id];
  if(!code)continue;
  for(const test of [{input:mission.input,expected:mission.expected},...(mission.tests||[])]){
    try{const result=await api.executeCPP(code,test.input||'',{'main.cpp':code});assert.equal(result.exitCode,0);assert.equal(normalize(result.output),normalize(test.expected));cases++;}
    catch(error){failures.push(mission.id+': '+error.message.slice(0,180));break;}
  }
}
for(const failure of failures)console.error(failure);
assert.equal(failures.length,0,`${failures.length} missions do not pass the actual bundled interpreter`);
await assert.rejects(api.executeCPP('this is invalid C++','',{}));
const inputResult=await api.executeCPP('#include <iostream>\nusing namespace std; int main(){int input;cin>>input;cout<<input*3;return 0;}','7',{});
assert.equal(inputResult.output,'21');
console.log(`PASS: ${cases} actual C++ sample/extra cases, custom stdin, invalid-code rejection.`);
