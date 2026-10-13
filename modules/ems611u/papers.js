/* Add future supplied papers here; retain their source-specific conventions. */
(() => {
'use strict';
Object.assign(STUDY_DATA.sources,{
 jetExamples:{title:'Jet engine — Further examples',file:'sources/jet-engine-examples_V2_typed.pdf',pages:5,author:'Eldad Avital'},
 propExamples:{title:'Propeller — Further examples',file:'sources/propeller-further-examples_V2_typed.pdf',pages:4,author:'Eldad Avital'}
});
const questions=[
 {id:'jet-1',source:'jetExamples',number:'1(a–b)',title:'Bypass engine: thrust, fuel use and efficiency',pages:'2–4',lesson:'jet-efficiency',prompt:'A bypass engine flies at 100 m/s in standard sea-level conditions. Bypass ratio μ = 4 and fuel-to-air ratio f = 0.01. Cold-stream exit speed is 200 m/s and hot-stream exit speed is 300 m/s. (a) Calculate specific net thrust, specific fuel consumption and propulsive efficiency. (b) Reduce sfc by 50%, keeping both exit speeds unchanged. Estimate the new bypass ratio, specific net thrust and efficiency.',steps:[
 'Use the paper’s approximation: neglect fuel addition in the momentum balance and pressure thrust; f is referenced to the hot/core stream, not total engine airflow.',
 'SNT = (Vh + μVc)/(1 + μ) − Va = (300 + 4 × 200)/5 − 100 = 120 N/(kg/s).',
 'sfc = 3600f/[(1 + μ)SNT] = 36/(5 × 120) = 0.0600 kg/(N·hr). The factor 3600 converts seconds to hours.',
 'ηp = [(1 + μ)SNT Va] / [(1 + μ)SNT Va + ½(Vh − Va)² + ½μ(Vc − Va)²] = 60000/(60000 + 20000 + 20000) = 0.600.',
 'For part (b), keep f = 0.01 as in the solution. Combine the equations: (1 + μ)SNT = 200 + 100μ; sfc = 0.36/(μ + 2).',
 'Set sfc = 0.0300: μ + 2 = 0.36/0.03 = 12, giving μ = 10.',
 'SNTnew = (300 + 10 × 200)/11 − 100 = 109.0909 N/(kg/s). ηp,new = 120000/(120000 + 20000 + 50000) = 0.631579.'
 ],answer:'(a) SNT = 120 N/(kg/s), sfc = 0.0600 kg/(N·hr), ηp = 60%. (b) μ = 10, SNT ≈ 109.1 N/(kg/s), ηp ≈ 63.2%.',plain:'Sending more air through the cold stream reduces fuel use per unit thrust in this fixed-speed model. Thrust per unit total airflow falls, even though propulsive efficiency improves.',variant:'bypass'},
 {id:'jet-2',source:'jetExamples',number:'2',title:'Compare the cruise sfc correlation',pages:'4',lesson:'empirical',prompt:'Using the jet-engine scaling laws, estimate cruise sfc for the engine in Question 1 with bypass ratio 4. Compare with Question 1 and discuss the difference.',steps:[
 'Use the no-reheat cruise correlation: sfc = 0.88 exp(−0.05μ). At μ = 4 this gives 0.720483 lb/(lbf·hr).',
 'Convert force-based imperial sfc: multiply by 0.45359237/4.448221615, equivalently divide by 9.80665. The result is 0.0734689 kg/(N·hr).',
 'Relative difference = (0.0734689/0.0600 − 1) × 100 ≈ 22.45%.'
 ],answer:'Cruise sfc ≈ 0.0735 kg/(N·hr), about 22.4% above Question 1.',plain:'An empirical fit summarizes a range of engines. Question 1 instead uses the specified stream speeds and fuel ratio. The two approaches need not match; the paper prefers its direct calculation for that stated model.',note:'The paper’s intermediate “kg/kg” notation should be read as a force-based conversion. Do not equate kg of mass with N of thrust.'},
 {id:'jet-3',source:'jetExamples',number:'3',title:'Cruise correlation with reheat',pages:'4–5',lesson:'empirical',prompt:'The bypass engine in Question 2 is fitted with a reheat system. Use the scaling laws to estimate cruise sfc with reheat.',steps:[
 'Follow this example paper’s correlation: sfc = 1.04 exp(−0.188μ) lb/(lbf·hr).',
 'For μ = 4: sfc = 1.04 exp(−0.752) = 0.490280 lb/(lbf·hr).',
 'Convert to SI: 0.490280/9.80665 = 0.0499946 kg/(N·hr).',
 'The two printed cruise correlations cross at μ = ln(1.04/0.88)/(0.188 − 0.05) ≈ 1.2105.'
 ],answer:'Using the example paper: sfc ≈ 0.0500 kg/(N·hr).',plain:'This is the output of the supplied empirical correlation. It does not establish that switching on an afterburner generally saves fuel.',note:'Source difference: this paper uses −0.188μ; the lecture notes and current Equation lab use −0.186μ, which gives about 0.05040 kg/(N·hr) at μ = 4. Keep the chosen source explicit.'},
 {id:'jet-4',source:'jetExamples',number:'4',title:'Derive mean engine-density scaling',pages:'5',lesson:'scaling',prompt:'Using jet-engine scaling laws, derive a scaling law for mean engine mass density as a function of the ratio between required thrust and known thrust.',steps:[
 'Define SF = Frequired/Fknown and mean density ρengine = m/Volume. A cylindrical approximation gives Volume ∝ D²L; the common geometric factor cancels in the ratio.',
 'Therefore ρrequired/ρknown = (mrequired/mknown)/[(Drequired/Dknown)²(Lrequired/Lknown)]. If W denotes weight, m = W/g and the same g cancels.',
 'The example solution uses mass ∝ SF^1.1, D ∝ SF^0.4 and L ∝ SF^0.4.',
 'Combine exponents: SF^(1.1 − 2 × 0.4 − 0.4) = SF^(−0.1).'
 ],answer:'Under the example paper’s exponents: ρrequired/ρknown = SF^(−0.1).',plain:'In this model, volume grows slightly faster than mass, so a larger thrust-scaled engine has a slightly lower average density.',note:'Use the thrust-ratio scaling laws, where both diameter and length scale with SF^0.4. These agree with the Equation lab’s thrust-ratio calculator. The separate imperial empirical correlations are a different model and should not be substituted into this derivation.'},
 {id:'prop-1',source:'propExamples',number:'1(a–c)',title:'Static propeller coefficients and thrust',pages:'2–3',lesson:'activity',prompt:'A propeller has four blades, diameter 2 m, frequency n = 20 Hz, activity factor 160, mean drag coefficient 0.1 and integrated design lift coefficient 0.3. Calculate (a) static power and torque coefficients, (b) static thrust coefficient, and (c) static thrust at standard sea level, ρ = 1.225 kg/m³. Use chart C7 on page 2 for the thrust-coefficient ratio.',steps:[
 'CP = P/(ρn³D⁵). Substitute the activity-factor power relation to obtain CP = 4Bπ³C̄d AF × 10⁻⁵.',
 'CP = 4 × 4 × π³ × 0.1 × 160 × 10⁻⁵ = 0.0793761 ≈ 0.08.',
 'Since P = 2πnQ, CQ = CP/(2π) = 0.0126331 using unrounded CP.',
 'At CP ≈ 0.08 and CLi = 0.3, the supplied solution reads CT/CP ≈ 2.25 from chart C7. This is an approximate chart reading, not a universal constant.',
 'Follow the chart-rounded values: CT ≈ 2.25 × 0.08 = 0.18.',
 'F = CTρn²D⁴ = 0.18 × 1.225 × 20² × 2⁴ = 1411.2 N.'
 ],answer:'CP ≈ 0.08; CQ ≈ 0.01263; chart-based CT ≈ 0.18; F ≈ 1411 N.',plain:'Power tells you the shaft input. The chart connects power to static thrust for this blade count, activity factor and design lift coefficient. You then turn the dimensionless thrust coefficient into newtons.',note:'Rounding check: 0.08/(2π) is 0.0127324, whereas the paper prints 0.01263. Its latter number agrees with using the unrounded CP = 0.0793761. The paper calls thrust coefficient CT; the lecture site also uses CF for the same normalization.'},
 {id:'prop-2',source:'propExamples',number:'2(a–c)',title:'Propeller in forward flight',pages:'4',lesson:'advance',prompt:'The same propeller (D = 2 m, n = 20 Hz) flies at 50 m/s in standard sea-level conditions, ρ = 1.225 kg/m³. Far-downstream air speed is 52.5 m/s. Calculate (a) advance ratio J, (b) thrust, and (c) thrust coefficient. Follow the paper’s approximation that shaft power remains at its static value, with CP = 0.08.',steps:[
 'J = Va/(nD) = 50/(20 × 2) = 1.25.',
 'Ideal propulsive efficiency ηp = 2Va/(Va + Vout) = 100/102.5 = 0.9756098.',
 'Using the paper’s rounded CP = 0.08, P = CPρn³D⁵ = 0.08 × 1.225 × 20³ × 2⁵ = 25088 W.',
 'From ηp = FVa/P, F = ηpP/Va = 0.9756098 × 25088/50 = 489.52195 N.',
 'CT = F/(ρn²D⁴) = 489.52195/(1.225 × 20² × 2⁴) = 0.0624390.'
 ],answer:'Calculated from the stated rounded inputs: J = 1.25, F ≈ 489.52 N and CT ≈ 0.06244.',plain:'Only the useful fraction of shaft power becomes thrust times flight speed. This question uses the paper’s fixed-power approximation; it is not a new actuator-disc sizing calculation.',note:'The supplied solution prints 489.8 N and CT = 0.0625. These are close but do not exactly follow from its displayed inputs; both the source values and the recalculation are preserved here.',variant:'prop'}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(host){
 host.innerHTML=`<section class="paper-library"><div class="section-head"><h2>Your supplied example papers</h2><span class="chip">2 papers · 6 main questions</span></div><p class="muted">Questions transcribed with notation clarified. Worked explanations follow the supplied solutions; source differences are flagged. Standard sea level in both papers: ρ = 1.225 kg/m³, p = 101.325 kPa, T = 288.16 K, c = 340.3 m/s.</p><div class="actions">${['jetExamples','propExamples'].map(id=>`<a class="button subtle" target="_blank" rel="noopener" href="${STUDY_DATA.sources[id].file}">${esc(STUDY_DATA.sources[id].title)} ↗</a>`).join('')}</div>${questions.map(q=>`<article class="practice-card paper-card" id="paper-${q.id}"><div class="eyebrow">Supplied paper · ${q.source==='jetExamples'?'Jet engines':'Propellers'} · Q${q.number}</div><h3>${esc(q.title)}</h3><p>${esc(q.prompt)}</p>${q.id==='prop-1'?'<details class="source-figure"><summary>Inspect supplied chart C7</summary><a href="figures/prop-examples-static-chart.png" target="_blank" rel="noopener"><img src="figures/prop-examples-static-chart.png" loading="lazy" alt="Original chart C7: static thrust and power coefficients, B = 4 and AF = 160. Open full size to inspect the curves."></a><p>Original chart from Propeller — Further examples, page 2. Open the image for full resolution.</p></details>':''}<details class="derivation"><summary>Show worked answer</summary><ol>${q.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p class="practice-result">${esc(q.answer)}</p><aside class="plain"><h3>In plain language</h3><p>${esc(q.plain)}</p></aside>${q.note?`<p class="source-note"><strong>Source check:</strong> ${esc(q.note)}</p>`:''}<a href="${STUDY_DATA.sources[q.source].file}#page=${q.pages.split('–')[0]}" target="_blank" rel="noopener">Original solution · pp. ${q.pages} ↗</a> · <a href="#learn/${q.lesson}">Review lesson →</a></details>${q.variant?`<button class="button subtle paper-variant" data-variant="${q.variant}" type="button">Try a similar generated question ↻</button><div class="variant-host" aria-live="polite"></div>`:''}</article>`).join('')}</section><h2 class="generated-heading">Generate more practice</h2>`;
 host.querySelectorAll('.paper-variant').forEach(b=>b.onclick=()=>{
  const n=b.nextElementSibling,choose=a=>a[Math.floor(Math.random()*a.length)];
  if(b.dataset.variant==='bypass'){
   const mu=choose([2,3,5,6,8]),va=100,vh=300,vc=200,f=.01,snt=(vh+mu*vc)/(1+mu)-va,sfc=3600*f/((1+mu)*snt),eta=(1+mu)*snt*va/((1+mu)*snt*va+20000+mu*5000);
   n.innerHTML=`<p><strong>Generated variant:</strong> With μ = ${mu}, Va = 100 m/s, Vh = 300 m/s, Vc = 200 m/s and core-referenced f = 0.01, find SNT, sfc and ηp using the same approximations as paper Q1.</p><details class="derivation"><summary>Reveal variant solution</summary><p>SNT = (300 + ${mu} × 200)/(1 + ${mu}) − 100 = ${snt.toFixed(4)} N/(kg/s).</p><p>sfc = 36/[(1 + ${mu}) × ${snt.toFixed(4)}] = ${sfc.toFixed(6)} kg/(N·hr).</p><p>ηp = [(1 + μ)SNT × 100]/[(1 + μ)SNT × 100 + 20000 + 5000μ] = ${(eta*100).toFixed(3)}%.</p><p>More bypass flow changes the weighting of the two streams. Keep f referenced to core flow.</p></details>`;
  }else{
   const va=choose([35,40,45,55,60]),out=va+2.5,P=.08*1.225*20**3*2**5,eta=2*va/(va+out),F=eta*P/va,ct=F/(1.225*20**2*2**4);
   n.innerHTML=`<p><strong>Generated variant:</strong> Use D = 2 m, n = 20 Hz, ρ = 1.225 kg/m³ and fixed CP = 0.08. If Va = ${va} m/s and Vout = ${out} m/s, find J, F and CT using the same fixed-power approximation as paper Q2.</p><details class="derivation"><summary>Reveal variant solution</summary><p>J = ${va}/(20 × 2) = ${(va/40).toFixed(4)}.</p><p>ηp = 2 × ${va}/(${va} + ${out}) = ${eta.toFixed(6)}. P = 0.08 × 1.225 × 20³ × 2⁵ = 25088 W.</p><p>F = ηpP/Va = ${F.toFixed(3)} N. CT = F/(1.225 × 20² × 2⁴) = ${ct.toFixed(6)}.</p><p>Divide useful power by flight speed to get thrust.</p></details>`;
  }
 });
}
window.PAPERS={questions,render,searchItems:questions.map(q=>({type:'Practice',title:`Paper Q${q.number}: ${q.title}`,meta:STUDY_DATA.sources[q.source].title,text:[q.prompt,...q.steps,q.answer,q.note||''].join(' '),href:'#practice/'+q.id}))};
})();
