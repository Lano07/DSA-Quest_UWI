(function () {
  'use strict';
  const api=window.DSAQuestBridge, data=window.DSAAdventureData, art=window.QuestArt;
  if(!api||!data||!art)return;
  const {chapters,extras,meta}=data, state=api.state, esc=api.escapeHTML;
  const missions=[...api.challenges,...extras];
  const missionById=new Map(missions.map(mission=>[mission.id,mission]));
  const flat=chapters.flatMap(chapter=>chapter.items);
  for(const key of ['questDone','questCode','questHints','questRevealed','questChecks','questStage','questInput','questBosses']){
    if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key]))state[key]={};
  }
  state.questActive=flat.includes(state.questActive)?state.questActive:null;
  let selectedChapter=Math.max(0,chapters.findIndex(chapter=>chapter.items.some(id=>!state.questDone[id])));
  let generation=0, battle=null, feedback='', mapView='map', legacyBoss=false;
  let runtime={busy:false,output:'Your output appears here. Make something happen.',status:'READY'};
  const chapterOf=id=>chapters.find(chapter=>chapter.items.includes(id));
  const completed=()=>flat.filter(id=>state.questDone[id]).length;
  const nextId=()=>flat.find(id=>!state.questDone[id])||flat[0];
  const chapterDone=chapter=>chapter.items.every(id=>state.questDone[id]);
  const bossNames=['The Null Golem','The Index Imp','The Dangling Sentinel','The Echo Keeper','The Order Ogre','The Root Warden','The Collision Crab','The Complexity Knight','The Disconnect','The Grid Guardian'];
  const moduleMap=[['foundations'],['foundations','complexity'],['memory','lists'],['recursion'],['stacks'],['trees','bst','heaps'],['hash'],['sorting','complexity'],['graphs','paths'],['extras']];
  const checkpoints={
    spark:['What sends a message to the C++ terminal?',['cout << "Hello";','cin >> "Hello";','return "Hello";'],0,'cout writes output; cin reads input. End the statement with a semicolon.'],
    array:['An array has 5 elements. What is its last valid index?',['5','4','6'],1,'C++ arrays start at index 0, so five elements use indices 0 through 4.'],
    memory:['If int* p = &x, which expression accesses the value of x?',['&p','p + 1','*p'],2,'Dereferencing with * follows the stored address to the value.'],
    recursion:['What keeps a recursive function from calling itself forever?',['A base case that the calls eventually reach','A larger array','Calling it twice'],0,'A base case stops recursion. Every recursive step must make progress toward it.'],
    stack:['Enqueue 4, 7, 9, then dequeue. What comes out?',['9','4','7'],1,'A queue is first in, first out. The earliest item, 4, leaves first.'],
    tree:['Insert 8, 3, 10 into a BST. What is its inorder traversal?',['8 3 10','10 8 3','3 8 10'],2,'Inorder visits left, node, right. In a BST, this gives sorted order.'],
    hash:['With h(key) = key % 7, where does key 17 go?',['Bucket 3','Bucket 2','Bucket 7'],0,'17 = 2 × 7 + 3, so the remainder and bucket index are 3.'],
    search:['Which condition is required for binary search?',['All values are positive','The collection is sorted','There are no duplicates'],1,'Sorted order lets us safely discard half of the search interval.'],
    graph:['Which structure manages the frontier in breadth-first search?',['A stack','A sorted array','A queue'],2,'A FIFO queue explores the oldest discovered vertices first, one distance layer at a time.'],
    matrix:['Which condition identifies the main diagonal?',['row == column','row == 0','row + column == 0'],0,'The main diagonal runs from top-left to bottom-right, where row and column indices match.']
  };
  const button=(text,attrs='',variant='gold')=>`<button class="quest-button ${variant}" ${attrs}>${text}</button>`;
  const dialogue=text=>`<div class="pip-dialogue">${art.guide()}<div><span class="micro">PIP · YOUR QUEST COMPANION</span><p>${esc(text)}</p></div></div>`;
  function chapterPanel(){
    const chapter=chapters[selectedChapter],progress=chapter.items.filter(id=>state.questDone[id]).length;
    const first=chapter.items.find(id=>!state.questDone[id])||chapter.items[0];
    return `<aside class="quest-log" aria-label="Selected chapter"><div class="chapter-preview" style="--tint:${chapter.tint}">${art.island(selectedChapter,chapterDone(chapter))}<span class="micro">ISLAND ${String(selectedChapter+1).padStart(2,'0')} / 10</span></div><div class="quest-log-body"><button class="text-button map-return" data-map-return>← Choose another island</button><h2>${esc(chapter.name)}</h2><p class="muted">${esc(chapter.subtitle)}</p><div class="chapter-progress"><span>${progress} of ${chapter.items.length} beacons lit</span><span>${Math.round(progress/chapter.items.length*100)}%</span></div><progress value="${progress}" max="${chapter.items.length}" aria-label="Chapter completion"></progress><ol class="mission-list">${chapter.items.map((id,index)=>`<li><button data-quest-open="${id}"><span class="mission-dot ${state.questDone[id]?'done':''}">${state.questDone[id]?'✓':index+1}</span><span>${esc(missionById.get(id).title)}</span><small>${state.questDone[id]?'DONE':'40 XP'}</small></button></li>`).join('')}</ol>${button(`${progress?'Continue':'Enter'} island →`,`data-quest-open="${first}"`)}<button class="guardian-link" data-guardian="${selectedChapter}">${state.questBosses[chapter.id]?'✓':'♜'} ${esc(bossNames[selectedChapter])}<span>${state.questBosses[chapter.id]?'WON':'+100 XP'}</span></button><small class="quiet">Guardian battles are open for practice any time.</small></div></aside>`;
  }
  function renderMap(){
    const count=completed();
    return `<div class="world-page"><header class="pixel-hero"><img class="hero-landscape" src="./assets/structure-isles-panorama.png" width="2172" height="724" alt="" fetchpriority="high"><div class="hero-shade" aria-hidden="true"></div><div class="hero-copy"><span class="hero-kicker"><i></i> COMP 2611 · A C++ ADVENTURE</span><h1>The Structure<br><em>Isles.</em></h1><p>A little curiosity. A little code.<br>A whole world to bring back to life.</p><div class="hero-actions">${button(count?'Resume adventure →':'Start adventure →',`data-quest-open="${nextId()}"`)}<span class="hero-save">${count?'YOUR JOURNEY IS SAVED':'NO EXPERIENCE NEEDED'}<small>${count} / ${flat.length} beacons restored</small></span></div></div><div class="hero-coordinate" aria-hidden="true">✦ 10 ISLANDS · ONE ADVENTURE</div><span class="pixel-mote mote-one" aria-hidden="true"></span><span class="pixel-mote mote-two" aria-hidden="true"></span><span class="pixel-mote mote-three" aria-hidden="true"></span></header><div class="world-layout"><section class="world-map-section" aria-label="Adventure map"><div class="map-topline"><span><i class="live-dot"></i> CHOOSE YOUR NEXT ISLAND</span><div class="view-switch" role="group" aria-label="Map view"><button data-map-view="map" aria-pressed="${mapView==='map'}">Map</button><button data-map-view="list" aria-pressed="${mapView==='list'}">List</button></div></div><div class="island-map ${mapView==='list'?'list-view':''}"><div class="map-stars" aria-hidden="true">✧<span>✦</span><b>✧</b></div><svg class="map-route" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true"><path d="M100 130Q200 200 300 130T500 130T700 130T900 130Q1010 260 900 370Q800 440 700 370T500 370T300 370T100 370"/></svg><span class="sea-label" aria-hidden="true">THE SEA OF POSSIBILITIES</span>${chapters.map((chapter,index)=>`<button class="island-node island-${index} ${selectedChapter===index?'selected':''} ${chapterDone(chapter)?'complete':''}" data-island="${index}" style="--tint:${chapter.tint}" aria-pressed="${selectedChapter===index}" aria-label="${esc(chapter.name)}, ${chapter.items.filter(id=>state.questDone[id]).length} of ${chapter.items.length} missions complete"><span class="island-index">${chapterDone(chapter)?'✓':String(index+1).padStart(2,'0')}</span>${art.island(index,chapterDone(chapter))}<strong>${esc(chapter.name)}</strong><span class="beacons" aria-hidden="true">${chapter.items.map(id=>`<i class="${state.questDone[id]?'lit':''}"></i>`).join('')}</span></button>`).join('')}<span class="map-compass" aria-hidden="true">N<br>✥</span></div><div class="map-legend"><span><i class="beacon-key"></i> ${count} / ${flat.length} beacons lit</span><span>All islands open · Explore at your pace</span></div>${dialogue(count?'Welcome back, explorer. Your beacons are safe. Choose an island, or pick up your next mission.':'Hey, I’m Pip! The Null has scrambled our islands. Help me restore their beacons with C++. Your first spell? A single line of output.')}</section>${chapterPanel()}</div><section class="expedition-extras" aria-label="More ways to play"><button data-page="lab"><span class="extra-icon">⌬</span><span><strong>The Tinker Grove</strong><small>Push, connect, rearrange. See structures move.</small></span><b>↗</b></button><button data-page="practice"><span class="extra-icon coral">⚔</span><span><strong>Practice arena</strong><small>24 coding challenges. Put your skills to work.</small></span><b>↗</b></button><button data-page="playground"><span class="extra-icon violet">⌘</span><span><strong>Creative mode</strong><small>Your own C++ editor. No quests attached.</small></span><b>↗</b></button></section>${relicShelf()}<div class="expedition-foot"><span>LEVEL ${Math.floor(state.xp/250)+1} EXPLORER · ${chapters.filter(chapterDone).length}/10 ISLANDS RESTORED</span><button class="text-button" data-page="learn">Open the field guide ↗</button></div></div>`;
  }
  function relicShelf(){
    const earned=chapters.filter(chapterDone).length+chapters.filter(chapter=>state.questBosses[chapter.id]).length;
    return `<details class="collection"><summary>Your collection <span>${earned} / 20 discoveries</span></summary><div class="collection-grid">${chapters.map((chapter,index)=>`<div class="collection-item ${chapterDone(chapter)?'earned':''}">${art.island(index,chapterDone(chapter))}<strong>${esc(chapter.name)}</strong><small>${chapterDone(chapter)?'✓ Chapter badge earned':'◇ Complete every mission'}</small><small>${state.questBosses[chapter.id]?'✓ Guardian relic earned':'◇ Defeat the guardian'}</small></div>`).join('')}</div></details>`;
  }
  function stageOf(id){return Number.isInteger(state.questStage[id])?Math.min(2,Math.max(0,state.questStage[id])):state.questDone[id]?2:0;}
  function editor(mission){
    const code=state.questCode[mission.id]??mission.starter;
    return `<section class="mission-ide" aria-label="C++ editor and terminal"><div class="ide-bar"><span><i class="live-dot"></i> main.cpp</span><button class="text-button" data-quest-reset ${runtime.busy?'disabled':''}>↺ Reset</button></div><label class="sr-only" for="aqCode">Edit your C++ solution</label><div class="code-area"><pre class="line-gutter" id="aqGutter" aria-hidden="true">${code.split('\n').map((line,index)=>index+1).join('\n')}</pre><textarea id="aqCode" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">${esc(code)}</textarea></div><div class="ide-actions"><small>Ctrl/⌘ + Enter · run<br>Tab moves to the next control</small>${button('▶ Run code','id="aqRunBtn" data-quest-run '+(runtime.busy?'disabled':''),'subtle')}${button('Check mission ✓','id="aqCheckBtn" data-quest-check '+(runtime.busy?'disabled':''))}</div><div class="terminal-bar"><span>TERMINAL</span><span id="aqTerminalStatus">${runtime.status}</span></div><pre id="aqTerminalText" role="status" aria-live="polite">${esc(runtime.output)}</pre><div class="mission-input"><label class="micro" for="aqInput">PROGRAM INPUT · stdin</label><textarea id="aqInput" rows="2" spellcheck="false">${esc(state.questInput[mission.id]??mission.input??'')}</textarea></div><div class="runner-disclosure">${api.fullRunnerUrl()?'Full C++ endpoint selected. Code is sent to your configured server.':'Browser C++ subset · No STL, fstream or multi-file compilation.'} <button class="text-button" data-page="playground">Runner options ↗</button></div></section>`;
  }
  function missionPanel(mission){
    const id=mission.id,chapter=chapterOf(id),info=meta[id]||{},stage=stageOf(id),solved=Boolean(state.questDone[id]);
    const checkpoint=data.checkpoints[id]||checkpoints[chapter.id];
    let content='';
    if(stage===0)content=`<span class="micro">01 · DISCOVER</span><h2>A small idea. A new power.</h2><p>${esc(info.teach||mission.desc)}</p>${info.snippet?`<pre class="lesson-code">${esc(info.snippet)}</pre>`:''}<div class="mission-objective"><span>✦ YOUR OBJECTIVE</span><p>${esc(info.task||mission.desc)}</p></div>${button('Got it. Let’s try →','data-stage="1"')}`;
    if(stage===1)content=`<span class="micro">02 · PREDICT</span><h2>A quick checkpoint.</h2><p>${esc(checkpoint[0])}</p><div class="checkpoint-options">${checkpoint[1].map((option,index)=>`<button data-checkpoint="${index}" ${state.questChecks[id]?'disabled':''} class="${state.questChecks[id]&&index===checkpoint[2]?'correct':''}"><span>${String.fromCharCode(65+index)}</span>${esc(option)}</button>`).join('')}</div><div class="checkpoint-feedback" role="status">${state.questChecks[id]?'✓ '+esc(checkpoint[3]):esc(feedback)}</div>${button('Open the editor →','data-stage="2" '+(state.questChecks[id]?'':'disabled'))}`;
    if(stage===2)content=`<span class="micro">03 · BUILD</span><h2>${solved?'Beacon restored. Nice work!':'Your mission'}</h2><p>${esc(info.task||mission.desc)}</p><div class="sample-pair"><div><span class="micro">SAMPLE INPUT</span><pre>${esc(mission.input||'(none)')}</pre></div><div><span class="micro">EXPECTED OUTPUT</span><pre>${esc(mission.expected)}</pre></div></div><details class="mission-help"><summary>Need a clue?</summary><p>${esc(mission.hint||info.tip||'Trace the sample input one step at a time.')}</p><p>${esc(info.tip||'Check your boundaries and try a small example first.')}</p></details><details class="mission-help"><summary>Revisit the idea</summary><p>${esc(info.teach||mission.desc)}</p></details><details class="mission-help"><summary>Worked solution</summary><p>Use this to understand the steps, then try it yourself.</p><pre>${esc(data.solutions[id]||'')}</pre>${button('Load reference solution','data-quest-load-solution','subtle')}</details>${solved?`<div class="victory-banner"><span>✦</span><div><strong>BEACON LIT</strong><p>40 XP secured. Your progress is saved.</p></div></div>${button(flat.indexOf(id)===flat.length-1?'Return to the islands →':'Next mission →','data-quest-next')}`:'<p class="quiet">Run experiments freely. Check mission tests the sample and any extra cases before awarding XP.</p>'}`;
    return `<div class="mission-page"><div class="mission-heading"><button class="text-button" data-quest-map>← The islands</button><span>${esc(chapter.name)} / ${chapter.items.indexOf(id)+1} of ${chapter.items.length}</span><span class="xp-label">${solved?'✓ COMPLETE':'✦ 40 XP'}</span></div><div class="mission-title"><span class="micro">MISSION ${String(flat.indexOf(id)+1).padStart(2,'0')}</span><h1>${esc(mission.title)}</h1></div><nav class="mission-steps" aria-label="Mission steps">${['Discover','Predict','Build'].map((label,index)=>`<button data-stage="${index}" aria-current="${stage===index?'step':'false'}" ${index===2&&!state.questChecks[id]&&!solved?'disabled':''}><span>${index+1}</span>${label}${index===1&&state.questChecks[id]?' ✓':''}</button>`).join('')}</nav><div class="mission-workspace ${stage===2?'coding-stage':''}"><section class="mission-lesson">${dialogue(info.story||'Every beacon begins with one small idea. Give this one a try.')}<div class="lesson-step">${content}</div></section>${stage===2?editor(mission):`<aside class="mission-scenery">${art.island(chapters.indexOf(chapter),solved)}<span class="micro">${esc(chapter.name)}</span><p>${stage===0?'Every great program starts with a little curiosity.':'Think it through. Mistakes cost no hearts here.'}</p><button class="text-button" data-quest-visual="${chapter.id}">Explore this structure ↗</button></aside>`}</div><div class="mission-bottom"><button class="text-button" data-quest-prev ${flat.indexOf(id)===0?'disabled':''}>← Previous mission</button><span>Auto-saved on this device</span><button class="text-button" data-quest-map>Back to map ↗</button></div></div>`;
  }
  function open(id){
    if(!missionById.has(id))return;
    generation++;state.questActive=id;feedback='';
    runtime={busy:false,output:'Your output appears here. Make something happen.',status:'READY'};
    api.save();api.navigate('quest');
  }
  function chooseMap(){generation++;state.questActive=null;api.save();api.navigate('quest');}
  function setResult(output,status){
    runtime.output=output;runtime.status=status;
    const terminal=document.querySelector('#aqTerminalText'),indicator=document.querySelector('#aqTerminalStatus');
    if(terminal)terminal.textContent=output;if(indicator)indicator.textContent=status;
  }
  const normalize=value=>String(value??'').trim().replace(/\s+/g,' ');
  async function run(check=false){
    const id=state.questActive,mission=missionById.get(id),field=document.querySelector('#aqCode');
    if(!mission||runtime.busy||!field)return;
    const token=++generation,code=field.value;
    state.questCode[id]=code;api.save();runtime.busy=true;
    for(const selector of ['#aqRunBtn','#aqCheckBtn']){const control=document.querySelector(selector);if(control)control.disabled=true;}
    setResult(check?'Testing your spell…':'Running your experiment…','RUNNING');
    try{
      const input=check?mission.input:state.questInput[id]??mission.input;
      const cases=check?[{input:mission.input||'',expected:mission.expected},...(mission.tests||[])]:[{input:input||''}];
      let sample='';
      for(let index=0;index<cases.length;index++){
        const test=cases[index],result=await api.executeCPP(code,test.input,{'main.cpp':code});
        if(token!==generation)return;
        if(Number(result.exitCode)!==0){setResult(`The spell needs a little repair.\n\n${result.stderr||result.output||'Program exited unsuccessfully.'}\n\nExit code: ${result.exitCode}`,'ERROR');return;}
        if(index===0)sample=result.output;
        if(check&&normalize(result.output)!==normalize(test.expected)){setResult(`Almost! Case ${index+1} needs another look.\n\nInput: ${test.input||'(none)'}\nExpected: ${test.expected}\nYour output: ${result.output||'(none)'}\n\nNo XP lost. Change one thing and try again.`,'TRY AGAIN');return;}
      }
      if(!check){setResult(`${sample||'(no output)'}\n\nExperiment finished. Use Check mission when you’re ready.`,'FINISHED');return;}
      const first=!state.questDone[id];state.questDone[id]=true;state.questStage[id]=2;
      if(first)api.award(40);else api.save();
      setResult(`✓ BEACON RESTORED!\n\n${sample}\n\n${cases.length} test case${cases.length===1?'':'s'} passed. ${first?'+40 XP!':'Replay complete — XP already collected.'}`,'PASSED');
      runtime.busy=false;api.render();
    }catch(error){if(token===generation)setResult(`We couldn’t run that spell.\n\n${error.message}\n\nBrowser mode supports a C++ subset. The Playground explains full compiler options.`,'ERROR');}
    finally{if(token===generation){runtime.busy=false;for(const selector of ['#aqRunBtn','#aqCheckBtn']){const control=document.querySelector(selector);if(control)control.disabled=false;}}}
  }
  function startGuardian(index){
    legacyBoss=false;
    const related=api.lessons.filter(lesson=>moduleMap[index].includes(lesson.module));
    const pool=related.length>=3?related:api.lessons;
    const offset=(state.questBosses[chapters[index].id]||0)%pool.length;
    battle={chapter:index,questions:[0,1,2].map(step=>pool[(offset+step)%pool.length]),position:0,hearts:3,correct:0,selected:null,ended:false};
    api.navigate('boss');
  }
  function renderBoss(){
    if(!battle)return `<div class="world-page"><header class="world-heading"><div><span class="micro">THE GUARDIAN GAUNTLET</span><h1>A little courage.<br><em>A lot of C++.</em></h1><p>Three questions. Three hearts. Beat every guardian to collect all ten relics.</p></div>${art.guardian()}</header><div class="guardian-grid">${chapters.map((chapter,index)=>`<button class="guardian-card" data-guardian="${index}">${art.guardian(index)}<span class="micro">${esc(chapter.name)}</span><h2>${esc(bossNames[index])}</h2><span>${state.questBosses[chapter.id]?'✓ RELIC COLLECTED':'BATTLE · +100 XP'}</span></button>`).join('')}</div>${button('Challenge the original Code Hydra','data-legacy-boss','subtle')}</div>`;
    const chapter=chapters[battle.chapter],question=battle.questions[battle.position],won=battle.correct===3;
    return `<div class="battle-page"><button class="text-button" data-guardian-back>← All guardians</button><span class="micro">${esc(chapter.name)} · GUARDIAN BATTLE</span><h1>${esc(bossNames[battle.chapter])}</h1><div class="battle-stage">${art.guardian(battle.chapter)}<div><span class="micro">GUARDIAN SHIELD</span><progress max="3" value="${3-battle.correct}" aria-label="Guardian shield"></progress><p>${3-battle.correct} / 3 shield points</p><span class="battle-hearts" aria-label="${battle.hearts} hearts remaining">${'♥'.repeat(battle.hearts)}${'♡'.repeat(3-battle.hearts)}</span></div></div><section class="battle-question">${battle.ended?`<span class="micro">${won?'RELIC RECOVERED':'TRY ANOTHER STRATEGY'}</span><h2>${won?'The island is safe.':'Every attempt teaches you something.'}</h2><p>${won?'You answered every question correctly. First victory earns 100 XP.':'You need three correct answers in one run to break the shield. Review the explanations and give it another go.'}</p>${button(won?'Back to the islands →':'Try again →',won?'data-quest-map':`data-guardian="${battle.chapter}"`)}`:`<span class="micro">ROUND ${battle.position+1} / 3</span><h2>${esc(question.question)}</h2><div class="checkpoint-options">${question.options.map((option,index)=>`<button data-guardian-answer="${index}" ${battle.selected!==null?'disabled':''} class="${battle.selected!==null&&index===question.answer?'correct':''}">${esc(option)}</button>`).join('')}</div>${battle.selected!==null?`<div role="status" class="checkpoint-feedback">${battle.selected===question.answer?'Direct hit!':'A glancing miss.'} ${esc(question.why)}</div>${button(battle.position===2?'See the result →':'Next round →','data-guardian-next')}`:''}`}</section></div>`;
  }
  function renderPage(page){
    if(page==='home')return renderMap();
    if(page==='quest')return state.questActive&&missionById.has(state.questActive)?missionPanel(missionById.get(state.questActive)):renderMap();
    if(page==='boss'&&!legacyBoss)return renderBoss();
    if(page==='lab'&&window.QuestStudio)return window.QuestStudio.render();
    return null;
  }
  document.addEventListener('click',event=>{
    const find=selector=>event.target.closest(selector);
    const navigation=find('[data-page]');if(navigation?.getAttribute('data-page')==='boss'){legacyBoss=false;battle=null;api.render();return;}
    const opener=find('[data-quest-open]');if(opener){open(opener.getAttribute('data-quest-open'));return;}
    if(find('[data-quest-map]')){chooseMap();return;}
    if(find('[data-map-return]')){const selected=document.querySelector('.island-node.selected');selected?.focus({preventScroll:true});selected?.scrollIntoView?.({block:'center',behavior:'auto'});return;}
    const island=find('[data-island]');if(island){selectedChapter=Number(island.getAttribute('data-island'));api.render();const heading=document.querySelector('.quest-log h2');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});if(window.matchMedia?.('(max-width: 1000px)').matches)document.querySelector('.quest-log')?.scrollIntoView?.({block:'start',behavior:'auto'});return;}
    const view=find('[data-map-view]');if(view){mapView=view.getAttribute('data-map-view');api.render();return;}
    const guardian=find('[data-guardian]');if(guardian){legacyBoss=false;startGuardian(Number(guardian.getAttribute('data-guardian')));return;}
    if(find('[data-guardian-back]')){battle=null;api.render();return;}
    if(find('[data-legacy-boss]')){legacyBoss=true;api.render();return;}
    const answer=find('[data-guardian-answer]');
    if(answer&&battle&&!battle.ended&&battle.selected===null){battle.selected=Number(answer.getAttribute('data-guardian-answer'));if(battle.selected===battle.questions[battle.position].answer)battle.correct++;else battle.hearts--;api.render();return;}
    if(find('[data-guardian-next]')&&battle&&battle.selected!==null&&!battle.ended){if(battle.position===2){battle.ended=true;if(battle.correct===3){const id=chapters[battle.chapter].id;if(!state.questBosses[id])api.award(100);state.questBosses[id]=(state.questBosses[id]||0)+1;api.save();}}else{battle.position++;battle.selected=null;}api.render();return;}
    const visual=find('[data-quest-visual]');if(visual){window.QuestStudio?.select(visual.getAttribute('data-quest-visual'));api.navigate('lab');return;}
    if(find('[data-quest-run]')){run(false);return;}
    if(find('[data-quest-check]')){run(true);return;}
    const id=state.questActive;if(!id||!missionById.has(id))return;
    const stage=find('[data-stage]');if(stage){const next=Number(stage.getAttribute('data-stage'));if(next===2&&!state.questChecks[id]&&!state.questDone[id])return;state.questStage[id]=next;feedback='';api.save();api.render();return;}
    const choice=find('[data-checkpoint]');if(choice&&!state.questChecks[id]){const check=data.checkpoints[id]||checkpoints[chapterOf(id).id];if(Number(choice.getAttribute('data-checkpoint'))===check[2]){state.questChecks[id]=true;api.save();}else feedback='Not quite — '+check[3]+' Try again. No hearts lost.';api.render();return;}
    if(find('[data-quest-load-solution]')&&!runtime.busy){state.questCode[id]=data.solutions[id];api.save();api.render();return;}
    if(find('[data-quest-reset]')&&!runtime.busy&&window.confirm('Restore this mission’s starter code?')){state.questCode[id]=missionById.get(id).starter;api.save();api.render();return;}
    if(find('[data-quest-prev]')){const index=flat.indexOf(id);if(index>0)open(flat[index-1]);return;}
    if(find('[data-quest-next]')&&state.questDone[id]){const next=flat[flat.indexOf(id)+1];if(next)open(next);else chooseMap();}
  });
  document.addEventListener('input',event=>{
    if(!state.questActive)return;
    if(event.target.id==='aqCode'){state.questCode[state.questActive]=event.target.value;api.save();const gutter=document.querySelector('#aqGutter');if(gutter)gutter.textContent=event.target.value.split('\n').map((line,index)=>index+1).join('\n');}
    if(event.target.id==='aqInput'){state.questInput[state.questActive]=event.target.value;api.save();}
  });
  document.addEventListener('scroll',event=>{if(event.target.id==='aqCode'){const gutter=document.querySelector('#aqGutter');if(gutter)gutter.scrollTop=event.target.scrollTop;}},true);
  document.addEventListener('keydown',event=>{if(event.target.id==='aqCode'&&event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();run(false);}});
  function onNavigate(page){if(page!=='quest'){generation++;runtime.busy=false;}}
  window.DSAAdventure={renderPage,activeMission:()=>Boolean(state.questActive),renderMap,renderHome:renderMap,missions,chapters,open,run,startGuardian,onNavigate};
  api.render();
})();
