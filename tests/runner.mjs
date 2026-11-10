import assert from 'node:assert/strict';
import {createApp} from './harness.mjs';
const {api,context}=createApp();
let terminated=false,deadline;
context.Worker=class{
  postMessage(){queueMicrotask(()=>this.onmessage({data:{type:'stdio.write',data:'x'.repeat(100001)}}));}
  terminate(){terminated=true;}
};
await assert.rejects(api.executeCPP('int main(){return 0;}','',{}),/Output limit/);
assert.equal(terminated,true);
terminated=false;
context.Worker=class{postMessage(){}terminate(){terminated=true;}};
context.setTimeout=(callback,delay)=>{if(delay===10000)deadline=callback;return 1;};
const timeout=api.executeCPP('int main(){while(true){}}','',{});
deadline();
await assert.rejects(timeout,/Stopped after 10 seconds/);
assert.equal(terminated,true);
context.Worker=class{constructor(){throw Error('Worker blocked');}};
await assert.rejects(api.executeCPP('int main(){}','',{}),/Worker blocked/);
console.log('PASS: output cap, execution timeout, worker termination, startup error.');
