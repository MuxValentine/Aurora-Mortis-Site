// Separadores: <button data-tab="id"> mostra <section id="id" class="tabpane">
document.querySelectorAll('[data-tabs]').forEach(g=>{
 const bs=g.querySelectorAll('[data-tab]');
 bs.forEach(b=>b.onclick=()=>{bs.forEach(o=>o.classList.toggle('on',o===b));
  document.querySelectorAll('.tabpane').forEach(p=>p.hidden=p.id!==b.dataset.tab)})});
// Grafo de vínculos
const g=document.getElementById('graph');
if(g){const d=JSON.parse(g.dataset.nodes),W=520,H=420,cx=W/2,cy=H/2,R=150,NS='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);g.append(svg);
 const mk=(n,px,py,core)=>{const b=document.createElement('button');b.className='node'+(core?' core':'');
  b.style.cssText=`left:${px/W*100}%;top:${py/H*100}%;--c:${n.c||'#fff'}`;
  b.innerHTML=`<i>${core?'':n.n[0]}</i>${n.n}`;g.append(b);return b};
 const nodes=d.map((n,k)=>{const a=k/d.length*Math.PI*2-Math.PI/2,px=cx+R*Math.cos(a),py=cy+R*Math.sin(a);
  const l=document.createElementNS(NS,'line');
  [['x1',cx],['y1',cy],['x2',px],['y2',py],['stroke',n.c],['stroke-dasharray','4 4']].forEach(([k,v])=>l.setAttribute(k,v));svg.append(l);
  const b=mk(n,px,py);b.title=n.t;b.dataset.g=n.g;return{b,l}});
 mk({n:g.dataset.core},cx,cy,true);
 const fs=document.querySelectorAll('[data-filter]');
 fs.forEach(f=>f.onclick=()=>{fs.forEach(o=>o.classList.toggle('on',o===f));
  nodes.forEach(({b,l})=>{const off=f.dataset.filter!=='all'&&b.dataset.g!==f.dataset.filter;b.classList.toggle('off',off);l.style.opacity=off?.1:1})})}

// Humor do Koda: murcho e cinzento quando triste, verde a meio, e a rebentar em flores roxas de jacarandá quando ri
const mood=document.getElementById('mood');
if(mood){const host=mood.closest('.ck')||mood,L=document.getElementById('leaves'),P=document.getElementById('petals'),s=document.getElementById('humor'),t=document.getElementById('moodt'),n=document.getElementById('moodn'),
 reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
 const mk=(c,N,r)=>{for(let i=0;i<N;i++){const e=document.createElement('i');e.className=c;e.style.setProperty('--a',(i/N*360+(r||0))+'deg');L.append(e)}};
 mk('lf',10);mk('fl',8,22.5);
 const T=[['Murcho','As folhas murcham e o musgo seca. Pipoca fica calado.'],['Cinzento','Tudo à volta fica cinzento e baixo.'],['Indeciso','Meio a meio: o Caos ainda não decidiu.'],['Em rebento','O verde sobe e as primeiras flores de jacarandá espreitam.'],['Em flor','Koda ri e o cabelo rebenta em flores roxas de jacarandá.']];
 let stage=-1;
 const u=()=>{const m=s.value/100,k=Math.min(4,Math.floor(m*5));
  host.style.setProperty('--m',m);host.style.setProperty('--g',cl(m/.42));host.style.setProperty('--v',cl((m-.4)/.55));
  if(k!==stage){stage=k;n.textContent=T[k][0];t.textContent=T[k][1];t.classList.remove('sw');void t.offsetWidth;t.classList.add('sw')}
  s.setAttribute('aria-valuetext',T[k][0])};
 s.oninput=u;u();
 // pétalas de jacarandá a cair quando o Koda está bem-disposto
 if(!reduce)setInterval(()=>{const v=cl((s.value/100-.4)/.55);if(v<.2||document.hidden||!mood.offsetParent||P.childElementCount>16)return;
  const p=document.createElement('i');p.className='pt';
  p.style.cssText=`--x:${(Math.random()-.5)*190}px;--s:${(Math.random()-.5)*70}px;--r:${(Math.random()-.5)*540}deg;--d:${3.4+Math.random()*2.2}s;transform:scale(${.7+Math.random()*.7})`;
  p.onanimationend=()=>p.remove();P.append(p)},520)}
