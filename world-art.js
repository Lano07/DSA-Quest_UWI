(function () {
  'use strict';
  // Original 5 × 2 pixel-art atlas; chapter order matches adventure-data.js.
  function island(index, complete = false) {
    const tile = Math.max(0, Math.min(9, Number(index) || 0));
    return `<span class="island-art" aria-hidden="true"><span class="island-sprite" style="background-position:${tile%5*25}% ${tile<5?0:100}%"></span>${complete?'<span class="island-flag">✓</span>':''}</span>`;
  }
  function sprite(rows, colors, className, label) {
    let pixels='';
    rows.forEach((row,y)=>{
      for(let x=0;x<row.length;x++){
        if(colors[row[x]])pixels+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${colors[row[x]]}"/>`;
      }
    });
    return `<svg class="${className}" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" ${label?'role="img" aria-label="'+label+'"':'aria-hidden="true"'}>${pixels}</svg>`;
  }
  function guide() {
    return sprite([
      '........................',
      '.............yy.........',
      '............yYy.........',
      '...oo.......yYy.........',
      '...oao.....oobbo........',
      '....oaa...obBBbbo.......',
      '....oaao.obBBBBBbo......',
      '.....oaaoBBwKBBBbo......',
      '.....oAAobBwKBBBboyyy...',
      '......oAABBbbBBBboyYYyy.',
      '......oAABBbbBBbo.yyy...',
      '.......oAABBbbBbo.......',
      '.......oAAABbbbo........',
      '........oAbbBbo.........',
      '........oAbbbo..........',
      '.......ocAbbo...........',
      '......occcbo............',
      '.....ocCCco.............',
      '.....oCCco..............',
      '....occco...............',
      '....oo..................',
      '........................'
    ],{o:'#16394d',a:'#236d79',A:'#3ba692',b:'#4ab49d',B:'#91e3bd',y:'#d6a557',Y:'#ffe3a0',c:'#367f9e',C:'#63c1d1',w:'#edffef',K:'#162c45'},'guide-art','Pip, your hummingbird guide');
  }
  function guardian(index=0) {
    const palettes=[
      {d:'#49456b',m:'#8179ac',l:'#b9afd9',h:'#d7ccec'},
      {d:'#674451',m:'#ae717b',l:'#e4a28f',h:'#ffd3a8'},
      {d:'#31566b',m:'#559394',l:'#8ac8b0',h:'#d3e7bb'}
    ];
    const p=palettes[index%3];
    return sprite([
      '................................',
      '................................',
      '.......dd..............dd.......',
      '......dmmd............dmmd......',
      '......dmlmd..........dmlmd......',
      '......dmllmd..yyyy..dmllmd.......',
      '.......dmllmdyYYyydmllmd........',
      '.......dmlhhlyYYyyllhmd.........',
      '......dmllhhllYYyllhhllmd.......',
      '.....dmllhhhhllllllhhhllmd......',
      '.....dmlhhhhhhhhhhhhhhllmd......',
      '.....dmllllhhhhhhhhlllllmd......',
      '.....dmdddlllHHHHllldddlmd......',
      '.....dmdKKddllHHllddKKdlmd......',
      '.....dmdKyKddlHHlddKyKdlmd......',
      '.....dmddYYKdlHHldKYYddlmd......',
      '.....dmlddYYdlHHldYYddllmd......',
      '...dddmmlddddlllllddddllmddd....',
      '..dmllmmlhhhhllllhhhhllmmllmd...',
      '.dmlhllmmllhhhllhhhlllmmllhlmd..',
      '.dmlhhllmmllllllHHlllmmllhhlmd..',
      '.dmllhlllmdKKKKKKKKdmlllhllmd...',
      '..dmllllmmdllllllllldmllllmd....',
      '...dmmmmdmlllllllllldmdddmd.....',
      '....dddddmmlhhhllhllmmd.dd......',
      '.........dmmlllllllmd...........',
      '.........ddmmmddmmmdd...........',
      '........dmlllmdmlllmd...........',
      '.......dmllllmdmllllmd..........',
      '.......ddddddddddddddd..........',
      '................................',
      '................................'
    ],{d:p.d,m:p.m,l:p.l,h:p.h,H:p.l,K:'#20283f',y:'#d79960',Y:'#ffe4a3'},'guardian-art');
  }
  window.QuestArt={island,guide,guardian};
})();
