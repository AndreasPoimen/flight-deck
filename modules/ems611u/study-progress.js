(() => {
'use strict';
const moduleId=location.pathname.toLowerCase().includes('ems612u')?'EMS612U':'EMS611U';
const key='flight-deck-progress-'+moduleId.toLowerCase()+'-v1';
const lessons=STUDY_DATA.lessons,valid=new Set(lessons.map(l=>l.id));
let checked=new Set(),persistent=true;
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))checked=new Set(saved.filter(id=>valid.has(id)));}catch{persistent=false;}
const save=()=>{try{localStorage.setItem(key,JSON.stringify([...checked]));persistent=true;}catch{persistent=false;}};
const panel=document.createElement('aside');panel.className='study-progress';panel.setAttribute('aria-label',moduleId+' study progress');
panel.innerHTML='<div class="progress-ring" role="progressbar" aria-label="Lessons studied" aria-valuemin="0" aria-valuemax="100"><span></span></div><div class="progress-copy"><strong>Study progress</strong><span class="progress-count"></span><small class="progress-storage"></small></div>';
document.body.append(panel);
function update(){
 const count=checked.size,total=lessons.length,pct=total?Math.round(count/total*100):0,ring=panel.querySelector('.progress-ring');
 ring.style.setProperty('--percent',pct+'%');ring.setAttribute('aria-valuenow',pct);ring.setAttribute('aria-valuetext',`${count} of ${total} lessons studied`);ring.querySelector('span').textContent=pct+'%';
 panel.querySelector('.progress-count').textContent=`${count} / ${total} lessons`;
 panel.querySelector('.progress-storage').textContent=persistent?'Saved in this browser':'Progress cannot be saved in this browser';
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
