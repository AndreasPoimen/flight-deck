(() => {
'use strict';
const moduleId=location.pathname.toLowerCase().includes('ems612u')?'EMS612U':'EMS611U';
const key='flight-deck-progress-'+moduleId.toLowerCase()+'-v1';
const lessons=STUDY_DATA.lessons,valid=new Set(lessons.map(l=>l.id));
let checked=new Set(),persistent=true;
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))checked=new Set(saved.filter(id=>valid.has(id)));}catch{persistent=false;}
const save=()=>{try{localStorage.setItem(key,JSON.stringify([...checked]));persistent=true;}catch{persistent=false;}};
const panel=document.createElement('aside');panel.className='study-progress';panel.setAttribute('aria-label',moduleId+' study progress');
panel.innerHTML='<button class="progress-toggle" type="button" aria-expanded="false" aria-controls="progress-panel" aria-label="Open study progress"><span aria-hidden="true">›</span><span class="progress-toggle-label">PROGRESS</span></button><div class="progress-drawer" id="progress-panel" inert aria-hidden="true"><div class="progress-head"><div><span class="progress-eyebrow">'+moduleId+'</span><h2>Your progress</h2></div><strong class="progress-percent"></strong></div><p class="progress-count"></p><p class="progress-description">Tick lessons as you study. Each checkpoint shows that week’s completed lessons.</p><div class="progress-route"><div class="progress-track" role="progressbar" aria-label="Lessons studied" aria-valuemin="0" aria-valuemax="100"><div class="progress-fill"></div></div><ol class="progress-weeks"></ol></div><small class="progress-storage"></small></div>';
document.body.append(panel);
const toggle=panel.querySelector('.progress-toggle'),drawer=panel.querySelector('.progress-drawer');
function setOpen(open){panel.classList.toggle('is-open',open);drawer.inert=!open;drawer.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close study progress':'Open study progress');toggle.querySelector('span').textContent=open?'‹':'›';}
toggle.addEventListener('click',()=>setOpen(!panel.classList.contains('is-open')));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&panel.classList.contains('is-open')){setOpen(false);toggle.focus();}});
const weeks=STUDY_DATA.learningWeeks.filter(w=>lessons.some(l=>l.week===w.id));
const list=panel.querySelector('.progress-weeks');
weeks.forEach(week=>{const members=lessons.filter(l=>l.week===week.id),li=document.createElement('li');li.className='progress-week';li.dataset.week=week.id;const marker=document.createElement('span');marker.className='progress-checkpoint';marker.setAttribute('aria-hidden','true');const link=document.createElement('a');link.href='#learn/'+members[0].id;link.textContent=week.label;const detail=document.createElement('small');detail.className='progress-week-count';const content=document.createElement('div');content.append(link,detail);li.append(marker,content);list.append(li);});
function update(){
 const count=checked.size,total=lessons.length,pct=total?Math.round(count/total*100):0,track=panel.querySelector('.progress-track');
 track.style.setProperty('--percent',pct+'%');track.setAttribute('aria-valuenow',pct);track.setAttribute('aria-valuetext',`${count} of ${total} lessons studied`);panel.querySelector('.progress-percent').textContent=pct+'%';
 panel.querySelector('.progress-count').textContent=`${count} / ${total} lessons`;
 panel.querySelector('.progress-storage').textContent=persistent?'Saved in this browser':'Progress cannot be saved in this browser';
 panel.querySelectorAll('.progress-week').forEach(row=>{const members=lessons.filter(l=>l.week===row.dataset.week),done=members.filter(l=>checked.has(l.id)).length;row.classList.toggle('is-complete',done===members.length);row.classList.toggle('is-started',done>0&&done<members.length);row.querySelector('.progress-checkpoint').textContent=done===members.length?'✓':'';row.querySelector('.progress-week-count').textContent=`${done} / ${members.length} lessons${done===members.length?' · Complete':''}`;});
 document.querySelectorAll('[data-progress-id]').forEach(input=>{input.checked=checked.has(input.dataset.progressId);});
 document.querySelectorAll('.sidebar details').forEach(detail=>{const inputs=[...detail.querySelectorAll('[data-progress-id]')];if(!inputs.length)return;let badge=detail.querySelector('.week-progress');if(!badge){badge=document.createElement('span');badge.className='week-progress';detail.querySelector('summary').append(badge);}badge.textContent=`${inputs.filter(x=>x.checked).length}/${inputs.length}`;});
}
function checkbox(id){const input=document.createElement('input');input.type='checkbox';input.dataset.progressId=id;const lesson=lessons.find(l=>l.id===id);input.setAttribute('aria-label','Mark '+lesson.title+' as studied');input.addEventListener('change',()=>{input.checked?checked.add(id):checked.delete(id);save();update();});return input;}
function decorate(){
 const sidebar=document.querySelector('.sidebar');if(sidebar)sidebar.querySelectorAll('a.lesson-link').forEach(link=>{const id=link.getAttribute('href')?.split('/')[1];if(!valid.has(id)||link.parentElement.classList.contains('progress-lesson'))return;const wrap=document.createElement('div');wrap.className='progress-lesson';link.before(wrap);wrap.append(link,checkbox(id));});
 const article=document.querySelector('.study-article'),id=location.hash.slice(1).split('/')[1]||document.querySelector('.sidebar .lesson-link[aria-current="page"]')?.getAttribute('href')?.split('/')[1];
 if(article&&valid.has(id)&&!article.querySelector('.progress-current')){const label=document.createElement('label');label.className='progress-current';label.append(checkbox(id),document.createTextNode(' Mark this lesson as studied'));article.querySelector('.article-tools')?.after(label);}
 update();
}
window.addEventListener('hashchange',decorate);
window.addEventListener('storage',e=>{if(e.key!==key)return;try{let data=JSON.parse(e.newValue||'[]');checked=new Set(Array.isArray(data)?data.filter(id=>valid.has(id)):[]);update();}catch{}});
decorate();
})();
