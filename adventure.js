/* DSA Quest — adventure-style lesson experience. Original visuals and curriculum. */
(function () {
  'use strict';
  const api = window.DSAQuestBridge;
  const data = window.DSAAdventureData;
  if (!api || !data) return;
  const {chapters, extras, meta} = data;
  const state=api.state;
  const esc=api.escapeHTML;
  const missions=[...api.challenges,...extras];
  const missionById=new Map(missions.map(m=>[m.id,m]));
  const chapterOf=id=>chapters.find(ch=>ch.items.includes(id));
  const flat=chapters.flatMap(ch=>ch.items);
  const complete=()=>flat.filter(id=>state.questDone[id]).length;
  const nextUnfinished=()=>flat.find(id=>!state.questDone[id])||flat[0];
  state.questDone=state.questDone&&typeof state.questDone==='object'?state.questDone:{};
  state.questCode=state.questCode&&typeof state.questCode==='object'?state.questCode:{};
  state.questHints=state.questHints&&typeof state.questHints==='object'?state.questHints:{};
  state.questRevealed=state.questRevealed&&typeof state.questRevealed==='object'?state.questRevealed:{};
  state.questActive=typeof state.questActive==='string'&&flat.includes(state.questActive)?state.questActive:null;
  state.questTab=state.questTab==='terminal'?'terminal':'terminal';
  const runtime={busy:false,terminal:'Ready to run. Your output will appear here.',status:'READY',tab:'output',justCompleted:false};
  const percent=(n,d)=>Math.round(100*n/Math.max(1,d));
  const label=(m)=>m.title;
  const chapterIndex=ch=>chapters.indexOf(ch)+1;
  const pix=(kind)=>'<span class="aq-pixel aq-pixel-'+kind+'" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>';
  const stars=(n=3)=>'<span class="aq-stars" aria-hidden="true">'+'✦ '.repeat(n)+'</span>';
  function chapterTile(ch){
    const done=ch.items.filter(id=>state.questDone[id]).length;
    const first=ch.items.find(id=>!state.questDone[id])||ch.items[0];
    return '<article class="aq-chapter" style="--chapter-accent:'+ch.tint+'"><div class="aq-chapter-art"><div class="aq-chapter-sun"></div><div class="aq-chapter-hill hill-back"></div><div class="aq-chapter-hill hill-front"></div><div class="aq-chapter-motif">'+ch.scene+'</div><div class="aq-chapter-caption">CHAPTER '+String(chapterIndex(ch)).padStart(2,'0')+'</div></div><div class="aq-chapter-body"><div class="aq-chapter-caption">'+done+' / '+ch.items.length+' MISSIONS COMPLETE</div><h3>'+esc(ch.name)+'</h3><p>'+esc(ch.subtitle)+'</p><div class="aq-progress" role="progressbar" aria-valuenow="'+percent(done,ch.items.length)+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+percent(done,ch.items.length)+'%"></span></div><button class="aq-chapter-button" data-quest-open="'+esc(first)+'">'+(done===ch.items.length?'Replay chapter':'Play chapter')+' <span>↗</span></button></div></article>';
  }
  function introScene(){
    return '<div class="aq-scene" aria-hidden="true"><div class="aq-scene-sun"></div><div class="aq-scene-cloud c1"></div><div class="aq-scene-cloud c2"></div><div class="aq-hill back"></div><div class="aq-hill front"></div><div class="aq-platform p1"></div><div class="aq-platform p2"></div><div class="aq-platform p3"></div><div class="aq-tower"><span class="aq-tower-light"></span></div><div class="aq-sprite"><span class="aq-sprite-eye"></span></div><div class="aq-particle one">✦</div><div class="aq-particle two">✧</div><div class="aq-particle three">✦</div></div>';
  }
  function renderHome(){
    const count=complete(), level=Math.floor(state.xp/250)+1, upcoming=missionById.get(nextUnfinished());
    return '<div class="aq-home">'+
    '<section class="aq-hero"><div class="aq-hero-copy"><span class="aq-kicker"><span class="aq-spark">✦</span> THE INTERACTIVE C++ ADVENTURE</span><h1>LEARN TO <em>CODE.</em><br>PLAY TO <em>LEARN.</em></h1><p>Data structures finally make sense when you can see them, change them, and write the code yourself. Start small. Run real exercises. Earn XP as you go.</p><div class="aq-hero-actions"><button class="aq-btn aq-btn-lime" data-quest-open="'+esc(nextUnfinished())+'">▶ '+(count?'Resume adventure':'Start adventure')+'</button><button class="aq-btn aq-btn-outline" data-page="lab">Explore visual labs ↗</button></div><div class="aq-hero-facts"><span>✦ '+flat.length+' FREE MISSIONS</span><span>⌨ C++ EDITOR + TERMINAL</span><span>🏆 XP AND BADGES</span></div></div>'+introScene()+'</section>'+
    '<section class="aq-home-summary"><div class="aq-status"><span class="aq-status-icon">✦</span><div><small>YOUR XP</small><strong>'+state.xp.toLocaleString('en-US')+'</strong></div></div><div class="aq-status"><span class="aq-status-icon">⚡</span><div><small>LEVEL</small><strong>'+level+'</strong></div></div><div class="aq-status"><span class="aq-status-icon">✓</span><div><small>QUESTS WON</small><strong>'+count+' <small>/ '+flat.length+'</small></strong></div></div><div class="aq-status"><span class="aq-status-icon">🔥</span><div><small>DAY STREAK</small><strong>'+state.streak+'</strong></div></div></section>'+
    '<section class="aq-home-next"><div class="aq-home-next-icon">✧</div><div><span class="aq-mini-label">YOUR NEXT MISSION</span><h2>'+esc(upcoming.title)+'</h2><p>'+esc(chapterOf(nextUnfinished()).name)+' · About 5 minutes</p></div><button class="aq-btn aq-btn-lime" data-quest-open="'+esc(upcoming.id)+'">Continue →</button></section>'+
    '<div class="aq-section-heading"><div><span class="aq-mini-label">THE COURSE MAP</span><h2>Choose your chapter <span>✦</span></h2></div><button class="aq-text-link" data-quest-map>View all 10 chapters →</button></div>'+
    '<div class="aq-chapter-grid">'+chapters.slice(0,3).map(chapterTile).join('')+'</div>'+
    '<section class="aq-why"><div class="aq-why-icon">⌘</div><div><h2>Read less. Try more.</h2><p>Every mission puts a short explanation beside a code editor and terminal. Predict, edit, run, get feedback, and advance. You can always switch to the full theory library and practice gym.</p></div><button class="aq-btn aq-btn-outline" data-page="learn">Theory library →</button></section></div>';
  }
  function renderMap(){
    const count=complete();
    return '<div class="aq-map"><header class="aq-map-header"><div class="aq-map-kicker">✧ THE QUEST MAP · UWI COMP 2611</div><h1>Your coding <span>adventure.</span></h1><p>Pick a chapter or resume your next exercise. Nothing is paywalled, and every chapter is available from the start.</p><div class="aq-map-summary"><div><strong>'+count+' / '+flat.length+'</strong><span>missions completed</span></div><div class="aq-progress"><span style="width:'+percent(count,flat.length)+'%"></span></div><button class="aq-btn aq-btn-lime" data-quest-open="'+esc(nextUnfinished())+'">▶ Continue quest</button></div></header><div class="aq-chapter-grid">'+chapters.map(chapterTile).join('')+'</div></div>';
  }
  function missionPanel(m){
    const id=m.id,chapter=chapterOf(id),index=chapter.items.indexOf(id),t=meta[id]||{};
    const solved=Boolean(state.questDone[id]),hints=state.questHints[id]||0,info=t.teach||m.desc;
    const reveal=Boolean(state.questRevealed[id]);
    const code=state.questCode[id]===undefined?m.starter:state.questCode[id];
    const next=flat[flat.indexOf(id)+1];
    return '<div class="aq-exercise">'+
      '<div class="aq-exercise-head"><button class="aq-return" data-quest-map aria-label="Return to quest map">← Course map</button><div class="aq-exercise-breadcrumb">'+esc(chapter.name)+' <span>/</span> Exercise '+(index+1)+' of '+chapter.items.length+'</div><span class="aq-exercise-xp">'+(solved?'✓ COMPLETED':'✦ 40 XP')+'</span></div>'+
      '<div class="aq-exercise-progress"><span style="width:'+percent(index+1,chapter.items.length)+'%"></span></div>'+
      '<div class="aq-lesson-split"><section class="aq-instructions"><div class="aq-instruction-heading"><span class="aq-num">'+String(flat.indexOf(id)+1).padStart(2,'0')+'.</span><span class="aq-small-label">CODE MISSION</span></div><h1>'+esc(m.title)+'</h1><div class="aq-learning-tag"><span>✦</span> '+esc(m.category||'C++')+' · Beginner to intermediate</div><p class="aq-story">'+esc(t.story||'Your next puzzle is waiting. Read the clue, then write the code that makes it work.')+'</p><div class="aq-lesson-section"><h2><span class="aq-hash">#</span> Learn it</h2><p>'+esc(info)+'</p>'+(t.snippet?'<div class="aq-inline-code"><div class="aq-code-label">QUICK EXAMPLE</div><code>'+esc(t.snippet)+'</code></div>':'')+'</div><div class="aq-lesson-section"><h2><span class="aq-hash">#</span> Your mission</h2><p>'+esc(t.task||m.desc)+'</p><div class="aq-objective"><span>🎯</span><div><strong>GOAL</strong><div>'+esc(m.desc)+'</div></div></div></div><div class="aq-io"><div><strong>EXAMPLE INPUT</strong><pre>'+esc(m.input||'(no input needed)')+'</pre></div><div><strong>EXPECTED OUTPUT</strong><pre>'+esc(m.expected)+'</pre></div></div><div class="aq-hint-box"><button data-quest-hint class="aq-help-btn">✧ '+(hints?'Another clue':'Need a hint?')+' <span>⌄</span></button>'+(hints?'<p>'+esc(m.hint||'Compare your code with the goal and the example output.')+'</p>':'')+(hints>=2?'<p>'+esc(t.tip||'Trace one input at a time and check your loop boundaries.')+'</p>':'')+'</div>'+
      (reveal?'<div class="aq-solution-panel"><strong>Reference solution</strong><pre>'+esc((data.solutions||{})[id]||'Reference solution unavailable for this exercise.')+'</pre><p>Understand every line before copying. You can try a different solution too.</p><button class="aq-btn aq-btn-outline aq-btn-small" data-quest-load-solution '+(!(data.solutions||{})[id]?'disabled':'')+'>Load into editor</button></div>':'<button class="aq-show-solution" data-quest-reveal>Show a worked solution</button>')+
      '</section>'+
      '<section class="aq-coding"><div class="aq-editor-title"><div class="aq-editor-tabs"><span class="aq-editor-tab active">⌘ main.cpp</span><span class="aq-editor-muted">C++ · '+(api.fullRunnerUrl()?'full compiler':'browser runner')+'</span></div><div class="aq-editor-tools"><button data-quest-reset aria-label="Reset code">↺ Reset</button><button data-page="playground">↗ Playground</button></div></div><div class="aq-code-edit"><div class="aq-line-gutter" id="aqGutter">'+Array.from({length:Math.max(14,code.split('\n').length)},(_,i)=>i+1).join('<br>')+'</div><textarea spellcheck="false" id="aqCode" aria-label="Edit your C++ solution" autocapitalize="off" autocomplete="off" autocorrect="off">'+esc(code)+'</textarea></div><div class="aq-editor-bottom"><span class="aq-shortcut">⌘ / Ctrl + Enter to run</span><div class="aq-exec-actions"><button class="aq-btn aq-btn-outline aq-btn-small" id="aqRunBtn" data-quest-run '+(runtime.busy?'disabled':'')+'>▶ Run code</button><button class="aq-btn aq-btn-run" id="aqCheckBtn" data-quest-check '+(runtime.busy?'disabled':'')+'>✓ Check mission</button></div></div><div class="aq-terminal"><div class="aq-terminal-head"><div class="aq-terminal-tabs"><span class="active">▣ Terminal</span></div><span id="aqTerminalStatus" class="aq-terminal-status '+(runtime.status==='PASSED'?'pass':'')+'">'+runtime.status+'</span></div><pre id="aqTerminalText" aria-live="polite">'+esc(runtime.terminal)+'</pre><div class="aq-stdin"><label for="aqInput">STANDARD INPUT <span>stdin</span></label><textarea id="aqInput" spellcheck="false" rows="2" aria-label="Program input">'+esc(m.input||'')+'</textarea></div></div></section></div>'+
      '<footer class="aq-lesson-footer"><div class="aq-footer-left"><span>✦</span><strong>'+esc(m.title)+'</strong><small>'+ (index+1)+' / '+chapter.items.length+'</small></div><div class="aq-footer-actions"><button class="aq-btn aq-btn-outline" data-quest-prev '+(flat.indexOf(id)===0?'disabled':'')+'>← Prev</button><button class="aq-btn '+(solved?'aq-btn-lime':'aq-btn-muted')+'" data-quest-next '+(!solved?'disabled aria-label="Run and pass this mission to continue"':'')+'>'+(next?'Next mission →':'Quest completed ✓')+'</button></div></footer></div>';
  }
  function renderQuest(){
    return state.questActive ? missionPanel(missionById.get(state.questActive)) : renderMap();
  }
  function renderPage(page){
    if(page==='home')return renderHome();
    if(page==='quest')return renderQuest();
    return null;
  }
  const activeMission=()=>state.questActive!==null;
  function redraw(){api.render();}
  function open(id){
    if(!missionById.has(id))return;
    state.questActive=id;
    runtime.terminal='Edit the starter code and press Run. The terminal will show your output.';
    runtime.status='READY';runtime.justCompleted=false;
    api.save();api.navigate('quest');
  }
  function chooseMap(){state.questActive=null;api.save();api.navigate('quest');}
  function setResult(txt,status){
    runtime.terminal=txt;runtime.status=status;
    const pre=document.querySelector('#aqTerminalText'),indicator=document.querySelector('#aqTerminalStatus');
    if(pre)pre.textContent=txt;
    if(indicator){indicator.textContent=status;indicator.classList.toggle('pass',status==='PASSED');}
  }
  function norm(s){return String(s==null?'':s).trim().replace(/\s+/g,' ');}
  async function run(check=false){
    const id=state.questActive,m=missionById.get(id),field=document.querySelector('#aqCode');
    if(!m||runtime.busy||!field)return;
    state.questCode[id]=field.value;
    api.save();runtime.busy=true;
    const runButton=document.querySelector('#aqRunBtn'),checkButton=document.querySelector('#aqCheckBtn');if(runButton)runButton.disabled=true;if(checkButton)checkButton.disabled=true;
    const input=check?(m.input||''):(document.querySelector('#aqInput')?.value??m.input??'');
    setResult('Compiling and running your C++ code…','RUNNING');
    try{
      const code=field.value,res=await api.executeCPP(code,input,{'main.cpp':code});
      if(res.exitCode!==0){setResult((res.stderr||'')+'\n'+(res.output||'')+'\nProgram exited with code '+res.exitCode,'ERROR');return;}
      if(!check){setResult((res.output||'(no output)')+(res.stderr?'\n\nstderr:\n'+res.stderr:'')+'\n\n[process exited: '+res.exitCode+']','FINISHED');return;}
      if(norm(res.output)!==norm(m.expected)){
        setResult('Your output:\n'+(res.output||'(no output)')+'\n\nExpected output:\n'+m.expected+'\n\nCompare carefully. Try adjusting your code.','TRY AGAIN');return;
      }
      for(let i=0;i<(m.tests||[]).length;i++){
        const t=m.tests[i];setResult('Sample passed. Checking extra case '+(i+1)+'…','TESTING');
        const check=await api.executeCPP(code,t.input,{'main.cpp':code});
        if(check.exitCode!==0||norm(check.output)!==norm(t.expected)){
          setResult('The sample passed, but another case needs work.\n\nInput:\n'+t.input+'\n\nExpected:\n'+t.expected+'\n\nYour output:\n'+(check.output||'(none)')+(check.stderr?'\n'+check.stderr:''),'TRY AGAIN');return;
        }
      }
      const first=!state.questDone[id];
      if(first){state.questDone[id]=true;api.award(40);}
      runtime.justCompleted=true;
      setResult('✓ MISSION COMPLETE!\n\n'+(res.output||'(no output)')+'\n\n'+(first?'+40 XP earned!':'Replay complete!')+' You can continue to the next mission.','PASSED');
      redraw();
    }catch(e){setResult('Could not run this C++ program.\n\n'+(e.message||String(e))+'\n\nThe browser runner supports only a subset of C++. For more C++ support, use the optional local compiler described in the Playground.','ERROR');}
    finally{
      runtime.busy=false;const button=document.querySelector('#aqRunBtn'),check=document.querySelector('#aqCheckBtn');if(button)button.disabled=false;if(check)check.disabled=false;
    }
  }
  document.addEventListener('click',function(e){
    const openBtn=e.target.closest('[data-quest-open]');
    if(openBtn){e.preventDefault();open(openBtn.getAttribute('data-quest-open'));return;}
    if(e.target.closest('[data-quest-map]')){e.preventDefault();chooseMap();return;}
    if(e.target.closest('[data-quest-run]')){e.preventDefault();run(false);return;}
    if(e.target.closest('[data-quest-check]')){e.preventDefault();run(true);return;}
    const id=state.questActive;
    if(!id)return;
    if(e.target.closest('[data-quest-hint]')){
      state.questHints[id]=Math.min(2,(state.questHints[id]||0)+1);api.save();redraw();return;
    }
    if(e.target.closest('[data-quest-reveal]')){
      state.questRevealed[id]=true;api.save();redraw();return;
    }
    if(e.target.closest('[data-quest-load-solution]')){
      const solution=(data.solutions||{})[id];
      if(solution){state.questCode[id]=solution;api.save();redraw();api.toast('Reference solution loaded. Run it to examine the result.');}return;
    }
    if(e.target.closest('[data-quest-reset]')){
      if(window.confirm('Reset your code to the starter for this mission?')){
        state.questCode[id]=missionById.get(id).starter;api.save();redraw();
      }return;
    }
    if(e.target.closest('[data-quest-prev]')){
      const i=flat.indexOf(id);if(i>0)open(flat[i-1]);return;
    }
    if(e.target.closest('[data-quest-next]')&&state.questDone[id]){
      const i=flat.indexOf(id);if(i<flat.length-1)open(flat[i+1]);else chooseMap();return;
    }
  });
  document.addEventListener('input',function(e){
    if(e.target.id==='aqCode'&&state.questActive){
      state.questCode[state.questActive]=e.target.value;api.save();
      const gutter=document.querySelector('#aqGutter');
      if(gutter){const total=Math.max(14,e.target.value.split('\n').length);gutter.innerHTML=Array.from({length:total},(_,i)=>i+1).join('<br>');}
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.target.id!=='aqCode')return;
    if(e.key==='Tab'){
      e.preventDefault();const t=e.target,i=t.selectionStart;t.setRangeText('  ',i,t.selectionEnd,'end');t.dispatchEvent(new Event('input',{bubbles:true}));
    }
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run(false);}
  });
  window.DSAAdventure={renderPage,activeMission,renderMap,renderHome,missions,chapters,open};
  if(['home','quest'].includes(location.hash.replace('#',''))){api.render();}
  else if(!location.hash||location.hash==='#home')api.render();
})();