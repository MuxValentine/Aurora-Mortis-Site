// Céu estrelado + vaga-lumes kodama + luz e rastro do mouse (botões [data-k] criados em player.js)
const c=document.getElementById('stars'),x=c.getContext('2d'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fxc=document.createElement('canvas');fxc.id='fx';document.body.append(fxc);const fx=fxc.getContext('2d');
const ml=document.createElement('div');ml.id='mlight';document.body.append(ml);
const opt={light:localStorage.k_light!=='off',trail:localStorage.k_trail!=='off'};
let s=[],F=[],P=[],mx=innerWidth/2,my=innerHeight/2,lx=mx,ly=my,moved=false;
function size(){c.width=fxc.width=innerWidth;c.height=fxc.height=innerHeight;
 s=Array.from({length:Math.round(c.width*c.height/6500)},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.3+.2,p:Math.random()*6,h:Math.random()<.2?270:225}));
 F=Array.from({length:16},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+1.5,p:Math.random()*6,v:Math.random()*.25+.1}))}
addEventListener('resize',size);size();
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;moved=true;if(opt.light)ml.style.opacity=1;
 if(opt.trail&&!reduce)for(let i=0;i<2;i++)P.push({x:mx,y:my,vx:(Math.random()-.5)*1.2,vy:Math.random()*1.2,t:1,r:Math.random()*5+2,c:['#fff','#c9a8ff','#e6c27a','#9af0c8'][Math.random()*4|0]})});
document.addEventListener('mouseleave',()=>ml.style.opacity=0);
function spark(p){fx.save();fx.translate(p.x,p.y);fx.rotate(p.t*3);fx.fillStyle=p.c;fx.shadowColor=p.c;fx.shadowBlur=10;fx.globalAlpha=p.t;const r=p.r*p.t;
 fx.beginPath();fx.moveTo(0,-r);fx.quadraticCurveTo(0,0,r,0);fx.quadraticCurveTo(0,0,0,r);fx.quadraticCurveTo(0,0,-r,0);fx.quadraticCurveTo(0,0,0,-r);fx.fill();fx.restore()}
function draw(t){x.clearRect(0,0,c.width,c.height);
 s.forEach(o=>{x.globalAlpha=.3+.7*Math.abs(Math.sin(o.p+(reduce?0:t/1500)));x.fillStyle=`hsl(${o.h} 100% 85%)`;x.beginPath();x.arc(o.x,o.y,o.r,0,7);x.fill()});
 x.shadowColor='#7dffc0';x.shadowBlur=14;
 F.forEach(o=>{if(!reduce){o.y-=o.v;o.x+=Math.sin(o.p+t/2200)*.35;if(o.y<-10){o.y=c.height+10;o.x=Math.random()*c.width}}
  x.globalAlpha=.15+.75*Math.abs(Math.sin(o.p+t/1300));x.fillStyle='#b8ffd8';x.beginPath();x.arc(o.x,o.y,o.r,0,7);x.fill()});x.shadowBlur=0;
 fx.clearRect(0,0,c.width,c.height);P=P.filter(p=>(p.t-=.025)>0);P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;spark(p)});
 lx+=(mx-lx)*.12;ly+=(my-ly)*.12;ml.style.transform=`translate(${lx}px,${ly}px)`;requestAnimationFrame(draw)}
draw(0);
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k,sync=()=>{b.setAttribute('aria-pressed',opt[k]);if(k==='light')ml.style.opacity=opt.light&&moved?1:0};sync();
 b.onclick=()=>{opt[k]=!opt[k];localStorage['k_'+k]=opt[k]?'on':'off';sync()}});
