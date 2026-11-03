(()=>{
const ic=(d,f)=>`<svg viewBox="0 0 24 24" ${f?'fill="currentColor"':'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'}>${d}</svg>`;
const I={play:ic('<path d="M8 5v14l11-7z"/>',1),pause:ic('<path d="M7 5h4v14H7zM13 5h4v14h-4z"/>',1),prev:ic('<path d="M6 5h2v14H6zM20 5v14L9 12z"/>',1),next:ic('<path d="M16 5h2v14h-2zM4 5l11 7L4 19z"/>',1),
sh:ic('<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>'),rp:ic('<path d="M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3"/>'),
vol:ic('<path d="M3 9v6h4l5 4V5L7 9zM16 8a5 5 0 010 8"/>'),sun:ic('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
spk:ic('<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"/>'),close:ic('<path d="M6 6l12 12M18 6L6 18"/>'),note:ic('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>')};
const st=Object.assign({i:0,t:0,play:false,shuf:false,rep:'all',vol:.6},JSON.parse(localStorage.kodaPlayerV2||'{}'));
const save=()=>{st.t=a.currentTime||0;st.play=!a.paused;localStorage.kodaPlayerV2=JSON.stringify(st)};
const nav=document.querySelector('.top');if(!nav)return;let tools=nav.querySelector('.tools');if(!tools){tools=document.createElement('div');tools.className='tools';nav.append(tools)}
const hue=i=>(i*70+265)%360,fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
const th=(t,i)=>t.capa?`style="background:url(${t.capa}) center/cover"`:`style="--h:${hue(i)}"`;
tools.innerHTML=`<button data-k="light" aria-pressed="true">${I.sun}<span>Luz do mouse</span></button><button data-k="trail" aria-pressed="true">${I.spk}<span>Rastro do mouse</span></button>`;
const dock=document.createElement('div');dock.id='music';
dock.innerHTML=`<div id="mp" hidden role="dialog" aria-label="Leitor de música"><button id="mx" class="x" aria-label="Fechar leitor">${I.close}</button><div class="disc"></div><h4></h4><small></small>
<div class="bar"><span id="tc">0:00</span><input id="sk" type="range" min="0" max="1000" value="0" aria-label="Progresso"><span id="td">0:00</span></div>
<div class="ctl"><button id="sh" aria-label="Aleatório">${I.sh}</button><button id="pv" aria-label="Anterior">${I.prev}</button><button id="pp" class="big" aria-label="Tocar/pausar">${I.play}</button><button id="nx" aria-label="Seguinte">${I.next}</button><button id="rp" aria-label="Repetir">${I.rp}</button></div>
<div class="vol"><button id="mu" aria-label="Silenciar">${I.vol}</button><input id="vl" type="range" min="0" max="100" aria-label="Volume"></div>
<div class="list">${TRACKS.map((t,i)=>`<button data-i="${i}"><span class="th" ${th(t,i)}></span><span><b>${t.title}</b><small>${t.artist}</small></span><em class="eq" aria-hidden="true"><s></s><s></s><s></s></em></button>`).join('')}</div></div>
<button id="mbtn" aria-expanded="false" aria-controls="mp" aria-label="Abrir leitor de música" title="Música"><span class="ring"></span>${I.note}<em class="eq" aria-hidden="true"><s></s><s></s><s></s></em></button>`;
document.body.append(dock);
const mp=dock.querySelector('#mp'),q=s=>mp.querySelector(s),mb=dock.querySelector('#mbtn'),a=new Audio();a.preload='metadata';
const rng=(el,v)=>{el.value=v;el.style.setProperty('--p',el.value/el.max*100+'%')};
function show(i){const t=TRACKS[i];q('h4').textContent=t.title;q('small').textContent=t.artist;const d=q('.disc');d.style.cssText=t.capa?`background:url(${t.capa}) center/cover`:`--h:${hue(i)}`;
 mp.querySelectorAll('.list button').forEach((b,k)=>b.classList.toggle('cur',k===i));if('mediaSession'in navigator)navigator.mediaSession.metadata=new MediaMetadata({title:t.title,artist:t.artist})}
function load(i,seek=0){st.i=i;a.src=TRACKS[i].src;a.addEventListener('loadedmetadata',()=>{if(seek)a.currentTime=seek},{once:true});show(i)}
const play=()=>a.play().catch(()=>{}),pick=()=>st.shuf&&TRACKS.length>1?[...TRACKS.keys()].filter(k=>k!==st.i)[Math.random()*(TRACKS.length-1)|0]:(st.i+1)%TRACKS.length;
const go=i=>{load(i);play()},next=()=>go(pick()),prev=()=>a.currentTime>3?a.currentTime=0:go((st.i-1+TRACKS.length)%TRACKS.length);
const ui=()=>{mp.classList.toggle('pl',!a.paused);q('#pp').innerHTML=a.paused?I.play:I.pause;dock.classList.toggle('playing',!a.paused);mb.setAttribute('aria-label',a.paused?'Abrir leitor de música':'A tocar: abrir leitor')};
q('#pp').onclick=()=>a.paused?play():a.pause();q('#nx').onclick=next;q('#pv').onclick=prev;
q('#sh').onclick=e=>{st.shuf=!st.shuf;e.currentTarget.classList.toggle('act',st.shuf);save()};
q('#rp').onclick=e=>{st.rep={off:'all',all:'one',one:'off'}[st.rep];e.currentTarget.dataset.m=st.rep;e.currentTarget.classList.toggle('act',st.rep!=='off');save()};
q('#sk').oninput=e=>{if(a.duration)a.currentTime=e.target.value/1000*a.duration;rng(e.target,e.target.value)};
q('#vl').oninput=e=>{a.volume=st.vol=e.target.value/100;a.muted=false;rng(e.target,e.target.value);save()};q('#mu').onclick=()=>{a.muted=!a.muted;q('#mu').style.opacity=a.muted?.4:1};
mp.querySelectorAll('.list button').forEach(b=>b.onclick=()=>+b.dataset.i===st.i&&!a.paused?a.pause():+b.dataset.i===st.i?play():go(+b.dataset.i));
a.onplay=a.onpause=ui;a.onended=()=>st.rep==='one'?(a.currentTime=0,play()):st.rep==='off'&&!st.shuf&&st.i===TRACKS.length-1?ui():next();
a.onerror=()=>{if(TRACKS.length>1&&!a.dataset.err){a.dataset.err=1;setTimeout(()=>{a.dataset.err='';},500)}};
let last=0;a.ontimeupdate=()=>{const p=a.duration?a.currentTime/a.duration*1000:0;rng(q('#sk'),p);q('#tc').textContent=fmt(a.currentTime);q('#td').textContent=fmt(a.duration);if(Date.now()-last>1000){last=Date.now();save()}};
mb.onclick=e=>{e.stopPropagation();const o=mp.hidden;mp.hidden=!o;mb.setAttribute('aria-expanded',o)};
q('#mx').onclick=()=>{mp.hidden=true;mb.setAttribute('aria-expanded',false);mb.focus()};
document.addEventListener('click',e=>{if(!mp.hidden&&!dock.contains(e.target)){mp.hidden=true;mb.setAttribute('aria-expanded',false)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mp.hidden){mp.hidden=true;mb.focus()}});
addEventListener('pagehide',save);
if('mediaSession'in navigator)[['play',play],['pause',()=>a.pause()],['nexttrack',next],['previoustrack',prev]].forEach(([k,f])=>navigator.mediaSession.setActionHandler(k,f));
a.volume=st.vol;rng(q('#vl'),st.vol*100);q('#sh').classList.toggle('act',st.shuf);q('#rp').dataset.m=st.rep;q('#rp').classList.toggle('act',st.rep!=='off');
load(Number.isInteger(st.i)?Math.max(0,Math.min(st.i,TRACKS.length-1)):0,st.t);
if(st.play)a.play().catch(()=>{const f=e=>{if(dock.contains(e.target))return;removeEventListener('pointerdown',f);play()};addEventListener('pointerdown',f)});
// Ecrã de entrada (só na página inicial, uma vez por sessão)
const g=document.getElementById('gate');
if(g){if(sessionStorage.kg)g.remove();else{document.body.style.overflow='hidden';g.querySelectorAll('[data-enter]').forEach(b=>b.onclick=()=>{sessionStorage.kg=1;if(b.dataset.enter==='music')play();document.body.style.overflow='';g.classList.add('out');setTimeout(()=>g.remove(),650)})}}
})();
