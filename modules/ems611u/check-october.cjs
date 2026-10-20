const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
global.window=global;
const root=__dirname;
for(const file of ['content.js','flight-notes.js','equations.js','flight-equations.js','source-index.js','papers.js','paper-index.js','explore.js','practice.js','october-sources.js','october-notes.js','october-equations.js','october-practice.js']){
 vm.runInThisContext(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
}
const defaults=id=>Object.fromEntries(EQUATIONS.models.find(m=>m.id===id).inputs.map(f=>[f.key,f.value]));
const calc=(id,x={})=>EQUATIONS.calculate(id,{...defaults(id),...x});
const close=(actual,expected,tolerance)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
assert.equal(Object.keys(STUDY_DATA.sources).length,16);
assert.equal(SOURCE_PAGES.length,216);
assert.equal(new Set(STUDY_DATA.lessons.map(l=>l.id)).size,STUDY_DATA.lessons.length);
for(const l of STUDY_DATA.lessons){
 const s=STUDY_DATA.sources[l.source];assert.ok(s,l.id);
 assert.ok(l.pages[0]>0&&l.pages[1]<=s.pages,l.id);
 if(l.calc)assert.ok(EQUATIONS.models.some(m=>m.id===l.calc),l.id);
 for(const f of l.figures||[])assert.ok(fs.existsSync(path.join(root,f.src)),f.src);
}
for(const s of Object.values(STUDY_DATA.sources))assert.ok(fs.existsSync(path.join(root,s.file)),s.file);
for(const m of EQUATIONS.models){calc(m.id);assert.ok(STUDY_DATA.lessons.some(l=>l.id===m.lesson),m.id);}
close(calc('mission')[6].value,56699.743,0.01);
close(calc('mission',{cc:.8,cl:.7})[6].value,153062.657,0.01);
close(calc('mission',{range:5000,legs:1,loiter:0})[6].value,89044.568,0.01);
close(calc('mission',{cc:.4,cl:.32})[6].value,45214.433,0.01);
close(calc('asw-range')[4].value,2587.437,0.01);
close(calc('asw-range',{weight:56706,cc:.4,cl:.32})[4].value,3954.676,0.01);
close(calc('prop-mission')[4].value,.948,.001);
close(calc('prop-mission')[5].value,.989,.001);
close(calc('section')[0].value,1531.25,.001);
close(calc('section')[4].value,-76.5625,.001);
close(calc('thickness')[0].value,Math.sqrt(2),1e-10);
assert.throws(()=>calc('mission',{legs:1.5}));
assert.throws(()=>calc('section',{mu:0}));
assert.throws(()=>calc('sizing',{category:'homebuilt-composite',material:'0.95'}));
assert.throws(()=>calc('asw-range',{weight:10000}));
for(let i=0;i<20;i++)for(const q of PRACTICE.generate())if(q.type==='Calculation')assert.ok(Number.isFinite(q.value),q.id);
for(const p of SOURCE_PAGES)assert.ok(p.page>0&&p.page<=STUDY_DATA.sources[p.source].pages);
for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
console.log(`PASS: ${STUDY_DATA.lessons.length} lessons, ${EQUATIONS.models.length} calculators, 216 indexed pages; sizing benchmarks, validation and generated practice.`);
