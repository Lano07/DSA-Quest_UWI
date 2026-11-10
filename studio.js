(function () {
  'use strict';
  const api=window.DSAQuestBridge,esc=api.escapeHTML;
  const names={array:'Array',linked:'Linked list',stack:'Stack',queue:'Queue',tree:'Search tree',heap:'Max heap',hash:'Hash table',graph:'Graph',sort:'Bubble sort'};
  let mode='stack',values=[8,3,5],selected=-1,message='Add a value, then remove one. Which value leaves first?',history=[],guided=false,frames=[],frame=0;
  let vertices=['A','B','C','D','E'],edges=[['A','B'],['A','C'],['B','D'],['C','E']],visited=[];
  const snapshot=()=>({values:[...values],vertices:[...vertices],edges:edges.map(edge=>[...edge]),visited:[...visited],selected,message});
  function remember(){history.push(snapshot());if(history.length>30)history.shift();frames=[];frame=0;visited=[];}
  function select(next){
    const aliases={spark:'array',memory:'linked',recursion:'stack',search:'sort',matrix:'array'};
    mode=names[next]?next:aliases[next]||'array';guided=false;values=mode==='tree'?[8,3,10,1,6]:mode==='heap'?[9,7,6,3,4]:[8,3,5];selected=-1;history=[];frames=[];visited=[];frame=0;
    message={stack:'The top is shown first visually. Push adds to the top; pop removes it.',queue:'The front is on the left. Enqueue joins the rear; dequeue removes the front.',linked:'Select a node, then remove it. The next links reconnect.',tree:'Insert values and watch a binary search tree grow. Duplicate values are ignored.',heap:'A max heap keeps the largest value at its root. Insert, or extract the maximum.',hash:'Keys go to bucket ((key % 7) + 7) % 7. Collisions form a chain.',graph:'Connect or disconnect vertices, then step through BFS or DFS.',sort:'Load your own values, then step through adjacent comparisons.',array:'Select a cell to inspect its zero-based index. Add or remove values.'}[mode];
  }
  function treeMarkup(heap=false){
    const nodes=[],links=[];
    if(heap){values.forEach((value,index)=>{const depth=Math.floor(Math.log2(index+1)),first=2**depth-1,count=2**depth;nodes.push({value,index,left:(index-first+.5)*600/count+25,top:35+depth*65});if(index)links.push([Math.floor((index-1)/2),index]);});}
    else{
      const root={};
      values.forEach((value,index)=>{let node=root;while(node.value!==undefined)node=value<node.value?(node.less??={}):(node.more??={});Object.assign(node,{value,index});});
      let order=0;
      function walk(node,depth,parent){if(node.value===undefined)return;walk(node.less||{},depth+1,node.index);nodes.push({value:node.value,index:node.index,left:35+(order++)*570/Math.max(1,values.length-1),top:30+depth*45});if(parent!==null)links.push([parent,node.index]);walk(node.more||{},depth+1,node.index);}
      walk(root,0,null);
    }
    const byIndex=new Map(nodes.map(node=>[node.index,node]));
    const height=Math.max(290,...nodes.map(node=>node.top+35));
    return `<svg viewBox="0 0 650 ${height}" role="img" aria-label="${heap?'Max heap':'Binary search tree'}: ${values.join(', ')}">${links.map(([parent,child])=>`<line x1="${byIndex.get(parent).left}" y1="${byIndex.get(parent).top}" x2="${byIndex.get(child).left}" y2="${byIndex.get(child).top}"/>`).join('')}${nodes.map(node=>`<g class="${selected===node.index?'active':''}"><circle cx="${node.left}" cy="${node.top}" r="21"/><text x="${node.left}" y="${node.top+5}" text-anchor="middle">${node.value}</text></g>`).join('')}</svg>`;
  }
  function graphMarkup(){
    const locations=vertices.map((vertex,index)=>({vertex,left:325+Math.cos(index/vertices.length*Math.PI*2-Math.PI/2)*210,top:145+Math.sin(index/vertices.length*Math.PI*2-Math.PI/2)*105}));
    const positions=new Map(locations.map(node=>[node.vertex,node]));
    return `<svg viewBox="0 0 650 290" role="img" aria-label="Undirected graph. Edges: ${edges.map(edge=>edge.join(' to ')).join(', ')}. Visited: ${visited.join(', ')||'none'}">${edges.map(([from,to])=>`<line x1="${positions.get(from).left}" y1="${positions.get(from).top}" x2="${positions.get(to).left}" y2="${positions.get(to).top}"/>`).join('')}${locations.map(node=>`<g class="${visited.includes(node.vertex)?'active':''}"><circle cx="${node.left}" cy="${node.top}" r="23"/><text x="${node.left}" y="${node.top+5}" text-anchor="middle">${node.vertex}</text></g>`).join('')}</svg>`;
  }
  function scene(){
    if(mode==='graph')return graphMarkup();
    if(!values.length)return '<p class="empty-structure">An empty structure. Add the first value to bring it to life.</p>';
    if(mode==='tree'||mode==='heap')return treeMarkup(mode==='heap');
    if(mode==='hash')return Array.from({length:7},(_,bucket)=>`<div class="hash-bucket"><small>BUCKET ${bucket}</small>${values.map((value,index)=>({value,index})).filter(node=>(node.value%7+7)%7===bucket).map(node=>`<button class="structure-node ${node.index===selected?'active':''}" data-studio-node="${node.index}" aria-label="Key ${node.value}, bucket ${bucket}">${node.value}</button>`).join('')||'<span class="quiet">empty</span>'}</div>`).join('');
    return values.map((value,index)=>`<button class="structure-node ${index===selected?'active':''}" data-studio-node="${index}" aria-pressed="${index===selected}" aria-label="Value ${value}, index ${index}">${value}<small>${mode==='stack'?(index===values.length-1?'TOP':''):mode==='queue'?(index===0?'FRONT':index===values.length-1?'REAR':''):mode==='linked'?(index===0?'HEAD':'NODE'):'['+index+']'}</small></button>${mode==='linked'?'<span class="structure-arrow" aria-hidden="true">→</span>':''}`).join('')+(mode==='linked'?'<code class="quiet">nullptr</code>':'');
  }
  function render(){
    if(guided)return `<div class="page"><button class="text-button" data-studio-return>← Back to the Tinker Grove</button></div>`+api.renderGuidedLab();
    return `<div class="world-page"><header class="world-heading"><div><span class="micro">THE TINKER GROVE · INTERACTIVE STRUCTURES</span><h1>Pull a thread.<br><em>See what changes.</em></h1><p>Your values. Your operations. Make the invisible parts of C++ visible.</p></div>${window.QuestArt.guide()}</header><div class="studio-tabs" role="group" aria-label="Choose a data structure">${Object.entries(names).map(([key,name])=>`<button data-studio-mode="${key}" aria-pressed="${mode===key}">${name}</button>`).join('')}</div><div class="studio-controls">${mode==='graph'?`<label>FROM<select id="graphFrom">${vertices.map(vertex=>`<option>${vertex}</option>`).join('')}</select></label><label>TO<select id="graphTo">${vertices.map((vertex,index)=>`<option ${index===1?'selected':''}>${vertex}</option>`).join('')}</select></label><button class="quest-button" data-studio-action="edge">Toggle edge</button><button class="quest-button subtle" data-studio-action="vertex" ${vertices.length===8?'disabled':''}>+ Vertex</button><button class="quest-button subtle" data-studio-action="bfs">BFS</button><button class="quest-button subtle" data-studio-action="dfs">DFS</button>`:`<label>VALUE<input id="structureValue" type="number" min="-999" max="999" step="1" value="7"></label><button class="quest-button" data-studio-action="add">${mode==='stack'?'Push':mode==='queue'?'Enqueue':'Insert'} +</button><button class="quest-button subtle" data-studio-action="remove" ${!values.length?'disabled':''}>${mode==='stack'?'Pop':mode==='queue'?'Dequeue':mode==='heap'?'Extract max':'Remove'}</button><label>YOUR DATA<input id="structureData" value="${values.join(', ')}" aria-label="Comma separated values"></label><button class="quest-button subtle" data-studio-action="load">Load</button>${mode==='sort'?'<button class="quest-button" data-studio-action="sort">Start sorting</button>':''}`}<button class="quest-button subtle" data-studio-action="undo" ${history.length?'':'disabled'}>↶ Undo</button><button class="quest-button subtle" data-studio-action="reset">Reset</button>${frames.length?`<button class="quest-button" data-studio-action="step" ${frame>=frames.length?'disabled':''}>Next step →</button>`:''}</div><div class="studio-stage ${mode==='stack'?'stack-stage':''}">${scene()}</div><div class="studio-status" role="status">${esc(message)}</div><div class="studio-note"><p>${mode==='tree'?'Ordinary BST: O(h) search/insert; skewed trees can reach O(n).':mode==='heap'?'Binary max heap: O(log n) insert/extract; O(1) peek.':mode==='hash'?'Separate chaining: expected O(1) lookup with a good distribution; worst-case O(n).':mode==='graph'?'BFS/DFS: O(V + E). The traversal starts at FROM; disconnected vertices stay unvisited.':mode==='sort'?'Bubble sort: O(n²) worst case. Each step shows one comparison.':'This small model holds up to 12 values. Empty removals leave the structure unchanged.'}</p><button class="text-button" data-studio-tours>14 guided algorithm tours ↗</button></div></div>`;
  }
  function heapify(){
    for(let parent=Math.floor(values.length/2)-1;parent>=0;parent--){let current=parent;while(true){let largest=current;const left=current*2+1,right=left+1;if(left<values.length&&values[left]>values[largest])largest=left;if(right<values.length&&values[right]>values[largest])largest=right;if(largest===current)break;[values[current],values[largest]]=[values[largest],values[current]];current=largest;}}
  }
  function traverse(method,start){
    const neighbors=new Map(vertices.map(vertex=>[vertex,[]]));
    for(const [from,to] of edges){neighbors.get(from).push(to);neighbors.get(to).push(from);}
    for(const adjacent of neighbors.values())adjacent.sort();
    const frontier=[start],seen=new Set(),order=[];
    if(method==='dfs'){
      function visit(vertex){if(seen.has(vertex))return;seen.add(vertex);order.push(vertex);for(const neighbor of neighbors.get(vertex))visit(neighbor);}
      visit(start);
    }else{
      seen.add(start);
      for(let index=0;index<frontier.length;index++){const vertex=frontier[index];order.push(vertex);for(const neighbor of neighbors.get(vertex)){if(!seen.has(neighbor)){seen.add(neighbor);frontier.push(neighbor);}}}
    }
    return order;
  }
  function perform(action,rawValue,rawData,from,to){
    if(action==='undo'){const previous=history.pop();if(previous){({values,vertices,edges,visited,selected,message}=previous);frames=[];frame=0;}return;}
    if(action==='reset'){select(mode);vertices=['A','B','C','D','E'];edges=[['A','B'],['A','C'],['B','D'],['C','E']];return;}
    if(action==='step'){if(frame<frames.length){const current=frames[frame++];if(current.values){values=[...current.values];selected=current.selected;}else visited=[...current.visited];message=current.message+(frame===frames.length?' Finished.':'');}return;}
    if(action==='add'){
      const value=Number(rawValue);
      if(String(rawValue).trim()===''||!Number.isInteger(value)||Math.abs(value)>999){message='Enter a whole number from −999 to 999.';return;}
      if(values.length>=12){message='Twelve values is the limit for this little grove. Remove one first.';return;}
      if(mode==='tree'&&values.includes(value)){message='This tree keeps unique keys. That value is already here.';return;}
      remember();values.push(value);if(mode==='heap'){let child=values.length-1;while(child>0){const parent=Math.floor((child-1)/2);if(values[parent]>=values[child])break;[values[parent],values[child]]=[values[child],values[parent]];child=parent;}}selected=values.lastIndexOf(value);message=`Inserted ${value}. ${mode==='stack'?'It is now on top.':mode==='queue'?'It joins the rear.':mode==='hash'?`Bucket: ${(value%7+7)%7}.`:'Watch how the structure changes.'}`;return;
    }
    if(action==='remove'){
      if(!values.length){message='Empty! Nothing to remove. No crash, no lost hearts.';return;}
      const index=mode==='stack'?values.length-1:mode==='queue'||mode==='heap'?0:selected>=0?selected:0;
      remember();const removed=values[index];
      if(mode==='heap'){const last=values.pop();if(values.length){values[0]=last;let parent=0;while(true){let largest=parent;const left=parent*2+1,right=left+1;if(left<values.length&&values[left]>values[largest])largest=left;if(right<values.length&&values[right]>values[largest])largest=right;if(largest===parent)break;[values[parent],values[largest]]=[values[largest],values[parent]];parent=largest;}}}
      else values.splice(index,1);
      selected=-1;message=`Removed ${removed}. ${mode==='queue'?'The next item is now at the front.':mode==='linked'?'The remaining links reconnect.':mode==='tree'?'Rebuilt from the remaining insertion order.':mode==='heap'?'Moved the last leaf to the root and sifted down.':''}`;return;
    }
    if(action==='load'){
      const parts=String(rawData).split(',').map(value=>value.trim());
      if(parts.length>12||parts.some(value=>!value||!Number.isInteger(Number(value))||Math.abs(Number(value))>999)){message='Use 1–12 comma-separated whole numbers between −999 and 999.';return;}
      remember();values=parts.map(Number);if(mode==='tree')values=[...new Set(values)];if(mode==='heap')heapify();selected=-1;message='Your data is ready. Try an operation.';return;
    }
    if(action==='edge'){
      if(from===to){message='Choose two different vertices. This is a simple undirected graph.';return;}
      remember();const index=edges.findIndex(edge=>edge.includes(from)&&edge.includes(to));if(index<0)edges.push([from,to]);else edges.splice(index,1);message=`${index<0?'Connected':'Disconnected'} ${from} and ${to}.`;return;
    }
    if(action==='vertex'&&vertices.length<8){remember();vertices.push(String.fromCharCode(65+vertices.length));message='New vertex added. Connect it with an edge.';return;}
    if(action==='bfs'||action==='dfs'){
      remember();const order=traverse(action,from);frames=order.map((vertex,index)=>({visited:order.slice(0,index+1),message:`${action.toUpperCase()}: visit ${vertex}. Order: ${order.slice(0,index+1).join(' → ')}.`}));message=`${action.toUpperCase()} is ready from ${from}. Press Next step.`;return;
    }
    if(action==='sort'){
      remember();const working=[...values];
      for(let end=working.length-1;end>0;end--){let changed=false;for(let index=0;index<end;index++){const swap=working[index]>working[index+1],pair=working.slice(index,index+2);if(swap){[working[index],working[index+1]]=[working[index+1],working[index]];changed=true;}frames.push({values:[...working],selected:index+1,message:`Compare ${pair[0]} and ${pair[1]}: ${swap?'swap them':'already ordered'}.`});}if(!changed)break;}
      message=frames.length?'Sorting is ready. Press Next step to compare adjacent values.':'Already sorted. A single value needs no comparisons.';
    }
  }
  document.addEventListener('click',event=>{
    const choice=event.target.closest('[data-studio-mode]');if(choice){select(choice.getAttribute('data-studio-mode'));api.render();return;}
    if(event.target.closest('[data-studio-tours]')){guided=true;api.render();return;}
    if(event.target.closest('[data-studio-return]')){guided=false;api.render();return;}
    const node=event.target.closest('[data-studio-node]');if(node){selected=Number(node.getAttribute('data-studio-node'));message=`Selected value ${values[selected]} at index ${selected}. ${mode==='linked'?'Remove it to reconnect the links.':''}`;api.render();return;}
    const action=event.target.closest('[data-studio-action]');if(!action)return;
    perform(action.getAttribute('data-studio-action'),document.querySelector('#structureValue')?.value,document.querySelector('#structureData')?.value,document.querySelector('#graphFrom')?.value,document.querySelector('#graphTo')?.value);api.render();
  });
  window.QuestStudio={render,select,perform,inspect:()=>({mode,...snapshot(),frames:frames.length,frame}),openGuided:()=>{guided=true;}};
})();
