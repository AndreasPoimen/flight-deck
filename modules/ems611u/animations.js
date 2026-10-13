/* Conceptual motion only: playback speed is not a physical flow speed. */
(() => {
'use strict';
const ns='http://www.w3.org/2000/svg';
let dispose=()=>{};
function mount(root){
 dispose();
 const cleanups=[];
 root.querySelectorAll('[data-live-diagram]').forEach(box=>{
  const kind=box.dataset.liveDiagram,svg=box.querySelector('svg');
  if(kind==='efficiency')return;
  let time=0,last=0,frame=0,speed=1;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let playing=!reduced.matches;
  const controls=document.createElement('div');controls.className='motion-controls';
  controls.innerHTML='<button type="button" class="button subtle motion-toggle"></button><label>Playback <select aria-label="Animation playback speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option></select></label><span class="motion-note">Illustrative motion · not to scale</span>';
  box.append(controls);
  if(['engine','bypass','blade'].includes(kind)&&!root.querySelector('.explore-page')){const a=document.createElement('a');a.className='button subtle';a.href='#explore/'+kind;a.textContent='Explore the parts →';controls.append(a);}
  const button=controls.querySelector('button');
  const sync=()=>{button.textContent=playing?'Pause motion':'Play motion';button.setAttribute('aria-pressed',String(playing));};
  button.onclick=()=>{playing=!playing;sync();};
  controls.querySelector('select').onchange=e=>speed=Number(e.target.value);
  const preference=()=>{playing=!reduced.matches;sync();};reduced.addEventListener('change',preference);sync();
  const particles=[];
  function stream(d,hot=false,rate=1){
   const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke','none');svg.append(path);
   const length=path.getTotalLength();
   for(let i=0;i<9;i++){
    const dot=document.createElementNS(ns,'circle');dot.setAttribute('r','3');dot.setAttribute('class',hot?'flow-dot hot':'flow-dot');dot.setAttribute('aria-hidden','true');svg.append(dot);
    particles.push({dot,path,length,offset:i/9,rate});
   }
  }
  let blade=null;
  if(kind==='blade')blade=svg.querySelector('path.body');
  if(kind==='wing')svg.querySelectorAll('path.line').forEach(p=>{if(p.getAttribute('d').includes('C'))stream(p.getAttribute('d'));});
  if(kind==='bypass'){
   stream('M24 135H165');stream('M138 86C228 72 332 82 470 104L560 103');stream('M138 184C228 198 332 188 470 166L560 167');stream('M165 135H587',true);
  }
  if(kind==='engine'){stream('M25 135H260');stream('M265 135H605',true);}
  if(kind==='momentum'){stream('M45 133H220');stream('M430 133H602',true,1.6);}
  if(kind==='disc'){
   stream('M40 83C180 87 245 108 310 108S490 115 600 119');
   stream('M40 187C180 183 245 162 310 162S490 155 600 151');
  }
  if(kind==='forces'){
   svg.querySelectorAll(':scope > path,:scope > text').forEach(e=>e.remove());
   const group=document.createElementNS(ns,'g');svg.append(group);
   const angles=document.createElement('label');angles.className='angle-control';angles.innerHTML='Flight-path angle γ <input type="range" min="-5" max="5" step="0.5" value="0" aria-label="Flight-path angle in degrees"><output>0° · level</output>';controls.before(angles);
   const note=document.createElement('p');note.className='motion-explanation';note.textContent='Steady flight: L = W cos γ; F − D = W sin γ. Arrows share a force scale. For this illustration D = 0.6W (chosen only for visibility); weight stays vertical.';box.append(note);
   const render=()=>{
    const deg=Number(angles.querySelector('input').value),a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
    angles.querySelector('output').textContent=`${deg}° · ${deg>0?'climb':deg<0?'descent':'level'}`;
    const arrow=(x,y,label,warm)=>`<path class="${warm?'warm':'line'}" d="M320 130L${320+x} ${130+y}" marker-end="url(#arrow-${warm?'warm':'teal'})"/><text x="${320+x+(x<0?-8:8)}" y="${130+y}" text-anchor="${x<0?'end':'start'}">${label}</text>`;
    group.innerHTML=`<path class="soft flight-track" d="M90 ${130+230*Math.tan(a)}L550 ${130-230*Math.tan(a)}" stroke-dasharray="5 9"/><path class="body" d="M295 127L321 120 347 130 319 140Z" transform="rotate(${-deg} 320 130)"/>${arrow(-s*c*95,-c*c*95,'L',false)}${arrow(0,95,'W',true)}${arrow(c*(.6+s)*95,-s*(.6+s)*95,'F',false)}${arrow(-c*.6*95,s*.6*95,'D',true)}<text x="320" y="261" text-anchor="middle">Weight vertical · lift perpendicular to the flight path</text>`;
    svg.setAttribute('aria-label',`Steady ${deg>0?'climbing':deg<0?'descending':'level'} flight at ${deg} degrees, with lift, weight, thrust and drag in balance.`);
   };
   angles.querySelector('input').oninput=render;render();
  }
  function tick(now){
   const dt=last?Math.min((now-last)/1000,.05):0;last=now;
   if(playing&&!document.hidden)time+=dt*speed;
   if(blade)blade.setAttribute('transform',`rotate(${time*90} 174 135)`);
   for(const p of particles){
    let phase=(time*.13*p.rate+p.offset)%1;
    // Smooth acceleration across the entire disc stream; no velocity jump at the disc.
    if(kind==='disc')phase=(Math.exp(phase*.7)-1)/(Math.exp(.7)-1);
    const point=p.path.getPointAtLength(phase*p.length);p.dot.setAttribute('cx',point.x);p.dot.setAttribute('cy',point.y);
   }
   const track=svg.querySelector('.flight-track');if(track)track.setAttribute('stroke-dashoffset',String(-time*25));
   frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
  cleanups.push(()=>{cancelAnimationFrame(frame);reduced.removeEventListener('change',preference);});
 });
 dispose=()=>cleanups.forEach(fn=>fn());
}
window.LIVE_FIGURES={mount};
})();
