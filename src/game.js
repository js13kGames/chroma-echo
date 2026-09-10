
const W=900,H=600,C=document.querySelector("canvas"),X=C.getContext("2d");
let keys={},touch=null,state=0,level=0,score=0,t0=0,muted=0,history=[],echoes=[],particles=[];
const levels=[
 {name:"FIRST LIGHT",stars:[[180,130],[730,460]],exit:[830,90,45],walls:[[300,0,30,390],[300,470,30,130],[570,210,30,390]],pads:[],doors:[]},
 {name:"REMEMBER ME",stars:[[150,520],[760,100]],exit:[830,500,45],walls:[[250,0,30,430],[250,510,30,90],[520,170,30,430],[520,0,30,90]],pads:[[160,120,35]],doors:[[520,90,30,80]]},
 {name:"TWO SELVES",stars:[[120,110],[760,470],[420,300]],exit:[830,80,45],walls:[[260,0,30,220],[260,300,30,300],[570,0,30,300],[570,380,30,220]],pads:[[150,480,35],[750,130,35]],doors:[[260,220,30,80],[570,300,30,80]]},
];
let p;

function reset(){
  p={x:70,y:530,r:16,vx:0,vy:0,stars:new Set()};
  history=[];echoes=[];particles=[];t0=performance.now();state=1;
}
function current(){return levels[level]}
function hit(x,y,r=16){
  for(const a of current().walls){
    if(x+r>a[0]&&x-r<a[0]+a[2]&&y+r>a[1]&&y-r<a[1]+a[3])return 1;
  }
  return x-r<0||x+r>W||y-r<0||y+r>H;
}
function doorOpen(d){
  let pads=current().pads;
  if(!pads.length)return false;
  // Door index maps to pad index, or all pads for final level.
  let need=current().doors.indexOf(d), pad=pads[Math.min(need,pads.length-1)];
  let actors=[p,...echoes.map(e=>e.pos)];
  return actors.some(a=>Math.hypot(a.x-pad[0],a.y-pad[1])<pad[2]+8);
}
function blocked(x,y){
  if(hit(x,y))return true;
  for(const d of current().doors)if(!doorOpen(d)&&x+p.r>d[0]&&x-p.r<d[0]+d[2]&&y+p.r>d[1]&&y-p.r<d[1]+d[3])return true;
  return false;
}
function rewind(){
  if(history.length<20)return;
  echoes.push({path:history.slice(),i:0,pos:{x:history[0].x,y:history[0].y}});
  if(echoes.length>3)echoes.shift();
  p.x=70;p.y=530;history=[];beep(180,.08);
}
function update(dt){
  if(state!==1)return;
  let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0);
  let dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
  if(touch){dx=touch.x-p.x;dy=touch.y-p.y;let l=Math.hypot(dx,dy)||1;dx/=l;dy/=l}
  let l=Math.hypot(dx,dy);if(l){dx/=l;dy/=l}
  let speed=210;
  let nx=p.x+dx*speed*dt,ny=p.y+dy*speed*dt;
  if(!blocked(nx,p.y))p.x=nx;
  if(!blocked(p.x,ny))p.y=ny;
  history.push({x:p.x,y:p.y});
  if(history.length>720)history.shift();
  for(const e of echoes){
    e.i=(e.i+1)%e.path.length;e.pos=e.path[e.i];
  }
  current().stars.forEach((s,i)=>{
    if(!p.stars.has(i)&&Math.hypot(p.x-s[0],p.y-s[1])<28){
      p.stars.add(i);score++;burst(s[0],s[1]);beep(700,.08);
    }
  });
  let all=p.stars.size===current().stars.length;
  let z=current().exit;
  if(all&&Math.hypot(p.x-z[0],p.y-z[1])<z[2]){
    beep(900,.18);state=2;burst(z[0],z[1],60);
  }
  particles=particles.filter(q=>(q.t-=dt)>0);
  for(const q of particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=30*dt}
}
function burst(x,y,n=20){
  for(let i=0;i<n;i++){let a=Math.random()*6.28,v=40+Math.random()*160;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:.4+Math.random()*.7,c:i%7})}
}
function rr(i){return ["#ff496c","#ff8b36","#ffe65a","#59e391","#42b8ff","#7267ff","#d86cff"][i%7]}
function trail(path,alpha=1){
  if(path.length<2)return;
  for(let k=1;k<path.length;k+=3){
    let a=path[k-1],b=path[k],i=(k/8|0)%7;
    X.strokeStyle=rr(i);X.globalAlpha=alpha*Math.min(.7,k/path.length+.1);X.lineWidth=3;X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke();
  }X.globalAlpha=1;
}
function unicorn(a,ghost=false){
  X.save();X.translate(a.x,a.y);if(ghost)X.globalAlpha=.45;
  // rainbow tail
  for(let i=0;i<4;i++){X.strokeStyle=rr(i);X.lineWidth=5;X.beginPath();X.arc(-18-i*4,6+i*2,12+i*2,.2,2.8);X.stroke()}
  X.fillStyle="#fff";X.beginPath();X.ellipse(0,2,18,12,0,0,7);X.fill();
  X.beginPath();X.arc(13,-8,11,0,7);X.fill();
  X.fillStyle="#ffd94d";X.beginPath();X.moveTo(17,-18);X.lineTo(23,-35);X.lineTo(27,-16);X.fill();
  X.fillStyle="#20263d";X.beginPath();X.arc(16,-9,3,0,7);X.fill();
  X.restore();
}
function draw(){
  X.clearRect(0,0,W,H);
  let g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10152f");g.addColorStop(1,"#39206b");X.fillStyle=g;X.fillRect(0,0,W,H);
  // stars and clouds
  for(let i=0;i<70;i++){X.fillStyle=`hsla(${(i*47)%360},90%,80%,.7)`;X.fillRect((i*137)%W,(i*71)%H,2,2)}
  let L=current();
  X.font="bold 18px system-ui";X.fillStyle="#fff";X.fillText("CHROMA ECHO",28,38);
  X.font="14px system-ui";X.fillStyle="#bfc7ff";X.fillText(`LEVEL ${level+1}: ${L.name}`,28,62);
  X.fillText(`STARS ${p?p.stars.size:0}/${L.stars.length}   ECHOES ${echoes.length}/3   SCORE ${score}`,W-300,38);
  // pads
  L.pads.forEach((s,i)=>{X.strokeStyle="#ffe65a";X.lineWidth=4;X.beginPath();X.arc(s[0],s[1],s[2],0,7);X.stroke();X.fillStyle="rgba(255,230,90,.14)";X.fill()});
  // geometry
  X.fillStyle="#20264a";L.walls.forEach(a=>X.fillRect(...a));
  L.doors.forEach(d=>{X.fillStyle=doorOpen(d)?"rgba(89,227,145,.25)":"#ff496c";if(!doorOpen(d))X.fillRect(...d)});
  L.stars.forEach((s,i)=>{if(!p.stars.has(i)){X.fillStyle="#ffe65a";X.beginPath();for(let k=0;k<10;k++){let a=-1.57+k*Math.PI/5,r=k%2?7:16;let x=s[0]+Math.cos(a)*r,y=s[1]+Math.sin(a)*r;k?X.lineTo(x,y):X.moveTo(x,y)}X.fill()}});
  let z=L.exit;X.strokeStyle=p.stars.size===L.stars.length?"#fff":"#6b648d";X.lineWidth=7;X.beginPath();X.arc(z[0],z[1],z[2],0,7);X.stroke();
  echoes.forEach(e=>{trail(e.path,.18);unicorn(e.pos,true)});
  trail(history,.8);if(p)unicorn(p);
  particles.forEach(q=>{X.globalAlpha=Math.min(1,q.t*2);X.fillStyle=rr(q.c);X.fillRect(q.x,q.y,4,4)});X.globalAlpha=1;
  if(state===0)overlay("CHROMA ECHO","Your past mistakes become your rainbow.","MOVE: WASD / ARROWS • REWIND: R","PRESS ENTER TO BEGIN");
  if(state===2)overlay("MEMORY UNLOCKED",level===levels.length-1?"YOU RESTORED THE LAST RAINBOW":"THE NEXT MEMORY IS WAITING","","ENTER: CONTINUE");
  if(state===3)overlay("THE RAINBOW REMEMBERS","A js13kGames 2026 micro-adventure","FINAL SCORE "+score,"ENTER: PLAY AGAIN");
}
function overlay(a,b,c,d){
  X.fillStyle="rgba(5,8,20,.72)";X.fillRect(0,0,W,H);X.textAlign="center";
  X.fillStyle="#fff";X.font="900 54px system-ui";X.fillText(a,W/2,H/2-55);
  X.fillStyle="#ffe65a";X.font="20px system-ui";X.fillText(b,W/2,H/2-10);
  X.fillStyle="#bfc7ff";X.font="16px system-ui";X.fillText(c,W/2,H/2+30);
  X.fillStyle="#fff";X.font="bold 18px system-ui";X.fillText(d,W/2,H/2+75);X.textAlign="left";
}
function beep(f,d){
  if(muted||!window.AudioContext)return;
  let A=beep.a||(beep.a=new AudioContext()),o=A.createOscillator(),g=A.createGain();o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(A.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,A.currentTime+d);o.stop(A.currentTime+d);
}
addEventListener("keydown",e=>{
  keys[e.key]=1;
  if(e.key==="r"&&state===1)rewind();
  if(e.key==="m")muted=!muted;
  if(e.key==="Enter"){
    if(state===0||state===3){level=0;score=0;reset()}
    else if(state===2){if(++level>=levels.length){state=3}else reset()}
  }
});
addEventListener("keyup",e=>keys[e.key]=0);
C.addEventListener("pointerdown",e=>{let r=C.getBoundingClientRect();touch={x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};if(state===0)reset();else if(state===2){if(++level>=levels.length)state=3;else reset()}else if(state===3){level=0;score=0;reset()}});
C.addEventListener("pointermove",e=>{if(touch){let r=C.getBoundingClientRect();touch={x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}});
addEventListener("pointerup",()=>touch=null);
let last=0;function loop(t){update(Math.min(.03,(t-last)/1000||0));last=t;draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
