/* Course retrieval stays local and includes future lessons automatically. */
(() => {
  'use strict';
  const data = window.STUDY_DATA;
  const flatten = value => typeof value === 'string' ? value : Array.isArray(value) ? value.map(flatten).join('\n') : value && typeof value === 'object' ? Object.values(value).map(flatten).join('\n') : '';
  const normalise = text => String(text).toLowerCase().normalize('NFKD').replace(/[₀-₉]/g, c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).replace(/stagn(?:a|e)tion/g, 'stagnation').replace(/\b(?:total pressure|p0)\b/g, 'stagnation pressure').replace(/\b(?:aoa)\b/g, 'angle attack').replace(/\b(?:bpr)\b/g, 'bypass ratio').replace(/\b(?:tsfc)\b/g, 'sfc').replace(/\b(?:disk)\b/g, 'disc');
  const stop = new Set('a an the is are was be been being of in on at to for from and or with by as it its that this those these what why how when where which who can could would should do does did i me my you your we our please explain tell about mean means give show help understand simply simple terms more detail example calculate find using than then have has also course relevant question'.split(' '));
  const tokens = text => [...new Set((normalise(text).match(/[a-z0-9]+/g) || []).filter(t => t.length > 1 && !stop.has(t)).map(t => t.length > 4 ? t.replace(/s$/, '') : t))];
  const chunks = [];
  function add(chunk) {
    chunk.words = tokens(chunk.title + ' ' + chunk.text);
    chunk.titleWords = tokens(chunk.title);
    chunk.tagsWords = tokens(chunk.tags || '');
    chunks.push(chunk);
  }
  // This primer explains the terminology used on jet p. 2; its low-speed
  // equation is the Bernoulli relation already used in the actuator-disc lesson.
  add({id:'primer-stagnation', title:'What is stagnation pressure?', source:'jet', page:2, lesson:'turbojet', tags:'total pressure stagnation static dynamic Bernoulli p0', text:'Stagnation pressure (also called total pressure, p₀) is the pressure air would reach if brought to rest isentropically: ideally, without friction or other irreversible losses. Static pressure p is the pressure of the moving air locally.\n\nFor the incompressible, loss-free Bernoulli model at the same height: p₀ = p + ½ρV². The term ½ρV² is dynamic pressure. Bringing the flow to rest converts its motion into a pressure rise. This simple sum is not the general compressible-flow relation.\n\nIn your turbojet notes, the intake slows the flow while minimising stagnation-pressure loss. Slowing the flow can raise static pressure without raising stagnation pressure. The compressor supplies shaft work to raise stagnation pressure.\n\nTerminology explanation for the jet-engine notes, p. 2; the low-speed relation follows from the Bernoulli balances in the actuator-disc lesson (propeller notes, pp. 11–12).', extraRefs:[{source:'prop',page:11}]});
  for (const lesson of data.lessons) {
    add({id:lesson.id, title:lesson.title, text:lesson.intro, source:lesson.source, page:lesson.pages[0], lesson:lesson.id, tags:lesson.tags});
    (lesson.sections || []).forEach((section, i) => add({id:lesson.id+'-'+i, title:section.title+' · '+lesson.title, text:flatten([section.body, section.plain, section.equations, section.steps, section.list]), source:lesson.source, page:lesson.pages[0], lesson:lesson.id, tags:lesson.tags}));
  }
  for (const question of window.PAPERS?.questions || []) add({id:'paper-'+question.id, title:question.title, text:flatten([question.prompt, question.steps, question.answer, question.plain, question.note]), source:question.source, page:parseInt(question.pages,10), lesson:question.lesson, tags:'worked example '+question.number});
  for (const page of window.SOURCE_PAGES || []) add({id:'page-'+page.source+'-'+page.page, title:data.sources[page.source].title+' · p. '+page.page, text:page.text, source:page.source, page:page.page, original:true});
  const frequencies = new Map();
  for (const chunk of chunks) for (const word of chunk.words) frequencies.set(word, (frequencies.get(word) || 0) + 1);
  function retrieve(question, previous = '') {
    let words = tokens(question);
    if (previous && (words.length === 0 || /\b(it|that|this|simpler|again|example|more detail)\b/i.test(question)) && words.length < 4) words = [...new Set([...words, ...tokens(previous)])];
    if (!words.length) return [];
    const q = normalise(question);
    const conceptualThrust = /\b(thrust|propeller)\b/.test(q) && /\b(produce|produces|create|creates|work|works|generate|generates)\b/.test(q);
    return chunks.map(chunk => {
      let score = 0, matched = 0;
      for (const word of words) {
        if (chunk.words.includes(word)) {
          matched++;
          score += Math.log(1 + chunks.length / (1 + (frequencies.get(word) || 0))) * (chunk.titleWords.includes(word) ? 2.4 : 1);
        } else if (chunk.tagsWords.includes(word)) score += .2;
      }
      score *= matched / words.length;
      if (chunk.original) score *= .6;
      if (chunk.id === 'primer-stagnation' && words.includes('stagnation') && words.includes('pressure')) score += 12;
      if (words.includes('stall') && chunk.lesson === 'stall') score += 8;
      if (conceptualThrust && chunk.lesson === 'principle') score += 12;
      if (/\b(calculate|find|equation|formula)\b/.test(q) && words.includes('climb') && chunk.id === 'climb-0') score += 12;
      return {...chunk, score, coverage:matched / words.length};
    }).filter(c => c.score >= 1.6 && c.coverage >= .34).sort((a,b) => b.score-a.score).slice(0,5);
  }
  function context(matches) {
    return matches.slice(0,3).map((c,i) => '['+(i+1)+'] '+c.title+' ('+data.sources[c.source].title+', p. '+c.page+')\n'+c.text.slice(0,1200)).join('\n\n');
  }
  window.COURSE_ASSISTANT = {retrieve, context, chunks};
})();
