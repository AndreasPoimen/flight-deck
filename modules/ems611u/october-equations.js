(() => {
'use strict';
const f=(key,label,unit,value,min=0,max)=>({key,label,unit,value,min,max});
const row=(label,value,unit='')=>({label,value,unit});
const positive=(x,...keys)=>{for(const k of keys)if(!(x[k]>0))throw Error(`${k} must be greater than zero.`);};
const classes=[
['sailplane','Sailplane · unpowered',.86,-.05],['powered','Sailplane · powered',.91,-.05],
['homebuilt','Homebuilt · metal/wood',1.19,-.09],['homebuilt-composite','Homebuilt · composite',.99,-.09],
['ga-single','GA · single engine',2.36,-.18],['ga-twin','GA · twin engine',1.51,-.10],
['agricultural','Agricultural',.74,-.03],['turboprop','Twin turboprop',.96,-.05],
['flying-boat','Flying boat',1.09,-.05],['trainer','Jet trainer',1.59,-.10],
['fighter','Jet fighter',2.34,-.13],['cargo','Military cargo/bomber · ASW example',.93,-.07],
['transport','Jet transport',1.02,-.06]];
function size(payload,fuel,A=.93,C=-.07,K=1,material=1) {
 if(!(payload>0&&fuel>=0&&fuel<1&&A>0&&C<0&&K>0&&material>0))throw Error('Sizing needs positive payload, 0 ≤ fuel fraction < 1 and a valid empty-weight correlation.');
 const residual=w=>w*(1-fuel-material*A*w**C*K)-payload;
 let lo=payload,hi=payload*2,steps=0;
 while(residual(hi)<0&&hi<1e9)hi*=2;
 if(hi>=1e9)throw Error('No usable solution below 10⁹ lb. Revise the mission or weight fractions; this initial-sizing model is not credible here.');
 for(;steps<100;steps++){const mid=(lo+hi)/2;if(residual(mid)>0)hi=mid;else lo=mid;if(hi-lo<1e-7)break;}
 const weight=(lo+hi)/2,empty=material*A*weight**C*K;
 return {weight,empty,fuel,emptyWeight:empty*weight,fuelWeight:fuel*weight,residual:residual(weight),steps:steps+1};
}
function mission(x){
 positive(x,'speed','ldc','ldl');
 if(x.range<0||x.legs<1||!Number.isInteger(x.legs)||x.loiter<0||x.reserve<0||x.cc<0||x.cl<0)throw Error('Ranges, times and SFC must be nonnegative; cruise leg count must be a positive integer.');
 const cruise=Math.exp(-x.range*6076*(x.cc/3600)/(x.speed*x.ldc));
 const loiter=Math.exp(-x.loiter*x.cl/x.ldl);
 const reserve=Math.exp(-x.reserve/60*x.cl/x.ldl);
 const remaining=.970*.985*cruise**x.legs*loiter*reserve*.995;
 return {cruise,loiter,reserve,remaining,fuel:1.06*(1-remaining)};
}
const baseline={range:1500,legs:2,speed:596.9,ldc:13.86,ldl:16,cc:.5,cl:.4,loiter:3,reserve:20};
window.OCTOBER_CALC={size,mission,baseline,classes};
const missionInputs=[f('range','Range per cruise leg','nmi',1500),f('legs','Number of equal cruise legs','count',2,1,10),f('speed','Cruise speed','ft/s',596.9),f('ldc','Cruise L/D','dimensionless',13.86),f('ldl','Loiter L/D','dimensionless',16),f('cc','Cruise SFC C','1/hr',.5),f('cl','Loiter SFC C','1/hr',.4),f('loiter','Main loiter duration','hr',3),f('reserve','Additional loiter duration','min',20)];
EQUATIONS.models.push(
{id:'mission',title:'Mission fuel & ASW sizing',topic:'Conceptual sizing',lesson:'mission-fractions',source:'sizingSolutions',page:1,
formula:'fcr = exp[−RC/(V·L/D)]     fmission = 0.970 × 0.985 × fcrⁿ × flt × fres × 0.995',
assumption:'Simple fuel-only mission. Descent is included in cruise. Reserve/trapped-fuel allowance is 6% of mission fuel. Full-precision calculations follow PBL inputs, not the older slide speed typo. Aircraft size uses the ASW empty-weight correlation.',
defaultsLabel:'PBL baseline: two 1,500 nmi legs, 3 hr + 20 min loiter; V = 596.9 ft/s.',
inputs:[...missionInputs,f('payload','Crew + payload','lb',10800)],
run(x){positive(x,'payload');const m=mission(x),s=size(x.payload,m.fuel);return [
row('Each cruise remaining fraction',m.cruise),row('Main loiter remaining fraction',m.loiter),row('Additional loiter remaining fraction',m.reserve),
row('Mission weight remaining Wx/W₀',m.remaining),row('Mission fuel fraction',1-m.remaining),row('Fuel fraction with 6% allowance',m.fuel),
row('Consistent takeoff weight W₀',s.weight,'lb'),row('Empty weight',s.emptyWeight,'lb'),row('Fuel weight',s.fuelWeight,'lb'),
row('Interpretation',s.weight>1e6?'Extreme extrapolation: this statistical result is outside ordinary use of the initial estimate.':'Initial-sizing result, not a validated aircraft design.')] }},
{id:'sizing',title:'Iterative takeoff-weight build-up',topic:'Conceptual sizing',lesson:'empty-weight',source:'sizingFormula',page:1,
formula:'W₀ = (Wcrew + Wpayload) / [1 − f − material × A W₀^C Kvs]',
assumption:'Source class coefficients require W₀ in pounds. A bracketed numerical solve finds a consistent solution and checks weight closure. The material factor adjusts a metal estimate; do not double-discount the composite-specific class.',
defaultsLabel:'ASW class with the rounded PBL fuel fraction 0.3773.',
inputs:[f('crew','Crew weight','lb',800),f('payload','Payload weight','lb',10000),f('fuel','Fuel fraction (including allowance)','dimensionless',.3773,0,.95),
{key:'category',label:'Aircraft class',type:'select',value:'cargo',options:classes.map(c=>[c[0],c[1]])},
{key:'sweep',label:'Wing sweep type',type:'select',value:'1',options:[['1','Fixed sweep · Kvs = 1'],['1.04','Variable sweep · Kvs = 1.04']]},
{key:'material',label:'Material adjustment',type:'select',value:'1',options:[['1','Use class trend directly'],['0.95','Composite alternative · 95% of metal trend']]}],
run(x){if(x.category==='homebuilt-composite'&&x.material!=='1')throw Error('This class already represents composite construction. Choose “Use class trend directly”.');const c=classes.find(c=>c[0]===x.category),s=size(x.crew+x.payload,x.fuel,c[2],c[3],+x.sweep,+x.material);return [
row('Takeoff weight W₀',s.weight,'lb'),row('Empty fraction We/W₀',s.empty),row('Empty weight We',s.emptyWeight,'lb'),row('Fuel weight Wf',s.fuelWeight,'lb'),row('Crew + payload fraction',(x.crew+x.payload)/s.weight),row('Weight-balance residual',s.residual,'lb'),row('Solver iterations',s.steps),row('Correlation check',s.empty<.3||s.empty>.7?'Outside the lecture’s approximate 0.3–0.7 empty-fraction range; inspect the assumptions.':'Within the lecture’s approximate empty-fraction range; not a structural validation.')];}},
{id:'prop-mission',title:'Propeller cruise & loiter fractions',topic:'Conceptual sizing',lesson:'sizing-efficiency',source:'sizingSolutions',page:6,
formula:'C = Cbhp Vft/s/(550ηp) [1/hr]     fcr = exp[−RC/(V·L/D)]',
assumption:'Fixed-pitch piston trainer defaults from the supplied past-exam solution. Cruise uses maximum L/D; loiter uses 0.866 maximum L/D. Loiter speed is a stated assumption. L/D is entered from a chart or supplied value, not interpolated from invented data.',
defaultsLabel:'Source example: 70 m/s, 1,000 km cruise, 30 min loiter, (L/D)max ≈ 15.5.',
inputs:[f('speed','Cruise speed','m/s',70),f('loiterSpeed','Assumed loiter speed','m/s',70),f('range','Cruise range','km',1000),f('time','Loiter time','min',30),f('ld','Maximum L/D (chart estimate)','dimensionless',15.5),f('bhpc','Cruise Cbhp','lb/(hr·bhp)',.4),f('bhpl','Loiter Cbhp','lb/(hr·bhp)',.5),f('etac','Cruise propeller efficiency','dimensionless',.8,0,1),f('etal','Loiter propeller efficiency','dimensionless',.7,0,1)],
run(x){positive(x,'speed','loiterSpeed','ld','etac','etal');const cc=x.bhpc*(x.speed/.3048)/(550*x.etac),cl=x.bhpl*(x.loiterSpeed/.3048)/(550*x.etal);return [row('Cruise equivalent C',cc,'1/hr'),row('Loiter equivalent C',cl,'1/hr'),row('Cruise L/D',x.ld),row('Loiter L/D',.866*x.ld),row('Cruise remaining fraction',Math.exp(-x.range*1000*(cc/3600)/(x.speed*x.ld))),row('Loiter remaining fraction',Math.exp(-x.time/60*cl/(.866*x.ld)))];}},
{id:'asw-range',title:'ASW range from available fuel',topic:'Conceptual sizing',lesson:'asw-sizing',source:'sizingSolutions',page:5,
formula:'fmission = 1 − (Wf/W₀)/1.06     fleg = √[fmission/(0.970·0.985·flt·fres·0.995)]',
assumption:'Same crew/payload and empirical ASW empty-weight trend. Two equal cruise legs and both loiters are retained. Changing SFC leaves aircraft weight and available fuel fixed; it does not resize the aircraft.',
inputs:[f('weight','Takeoff weight','lb',50000),f('payload','Crew + payload','lb',10800),f('speed','Cruise speed','ft/s',596.9),f('ldc','Cruise L/D','dimensionless',13.86),f('ldl','Loiter L/D','dimensionless',16),f('cc','Cruise SFC','1/hr',.5),f('cl','Loiter SFC','1/hr',.4),f('loiter','Main loiter time','hr',3),f('reserve','Additional loiter time','min',20)],
run(x){positive(x,'weight','payload','speed','ldc','ldl','cc');const empty=.93*x.weight**(-.07),fuel=1-empty-x.payload/x.weight;if(fuel<=0)throw Error('No positive fuel allowance remains at this weight.');const remain=1-fuel/1.06,noncr=.970*.985*.995*Math.exp(-(x.loiter+x.reserve/60)*x.cl/x.ldl),leg=Math.sqrt(remain/noncr);if(!(leg>0&&leg<=1))throw Error('Available fuel cannot cover the specified loiters and historical segments.');const range=x.speed*x.ldc/(x.cc/3600)*Math.log(1/leg)/6076;return [row('Fuel weight available',fuel*x.weight,'lb'),row('Mission remaining fraction',remain),row('Each cruise remaining fraction',leg),row('Range per leg',range,'nmi'),row('Total cruise range',2*range,'nmi')];}},
{id:'section',title:'Aerofoil section coefficients & flow conditions',topic:'Aerofoil selection',lesson:'section-coefficients',source:'aerofoilLecture',page:11,
formula:'Cl = a(α−αL=0)     l = qcCl     d = qcCd     m = qc²Cm     Re = ρVc/μ',
assumption:'Linear, attached-flow section model only. Angles are converted from degrees to radians. Cd and quarter-chord Cm are supplied inputs, not predicted. This is not a stall or compressible-flow solver.',
inputs:[f('rho','Air density','kg/m³',1.225),f('speed','Freestream speed','m/s',50),f('chord','Chord','m',1),f('mu','Dynamic viscosity','Pa·s',.0000181),f('sound','Speed of sound','m/s',340.3),f('alpha','Angle of attack','degrees',5,-20,20),f('zero','Zero-lift angle','degrees',-2,-20,20),f('slope','Lift-curve slope','rad⁻¹',2*Math.PI),f('cd','Supplied Cd','dimensionless',.012),f('cm','Supplied quarter-chord Cm','dimensionless',-.05,-2,2),f('dp','Local pressure minus freestream','Pa',-1000,-1000000,1000000)],
run(x){positive(x,'rho','speed','chord','mu','sound','slope');const q=.5*x.rho*x.speed**2,cl=x.slope*(x.alpha-x.zero)*Math.PI/180;return [row('Dynamic pressure q',q,'Pa'),row('Section Cl (linear model)',cl),row('Lift per span l',q*x.chord*cl,'N/m'),row('Drag per span d',q*x.chord*x.cd,'N/m'),row('Moment per span about quarter chord',q*x.chord**2*x.cm,'N·m/m'),row('Local Cp',x.dp/q),row('Chord Reynolds number',x.rho*x.speed*x.chord/x.mu),row('Freestream Mach number',x.speed/x.sound),row('Validity check',x.speed/x.sound>=.3?'Mach ≥ 0.3: the lecture’s incompressible approximation needs reassessment. No compressibility correction applied.':'Check attached flow and relevant aerofoil data; this tool cannot locate stall or Mcrit.')];}},
{id:'design-cl',title:'Design Cl from wing loading',topic:'Aerofoil selection',lesson:'design-lift',source:'highLiftLecture',page:5,
formula:'Cl ≈ (W/S)/q     q = ½ρV²',
assumption:'Steady level flight, and the lecture’s first approximation CL ≈ Cl. Weight loading is force per area, not mass per area.',
inputs:[f('loading','Wing loading W/S','N/m²',750),f('rho','Air density','kg/m³',1.0),f('speed','Flight speed','m/s',55)],
run(x){positive(x,'loading','rho','speed');const q=.5*x.rho*x.speed**2;return [row('Dynamic pressure',q,'Pa'),row('Required approximate design Cl',x.loading/q)];}},
{id:'thickness',title:'Thickness and wing-weight trade',topic:'Aerofoil selection',lesson:'thickness-trade',source:'highLiftLecture',page:15,
formula:'Wwing,new/Wwing,old ≈ √[(t/c)old/(t/c)new]',
assumption:'Lecture statistical trend; all other empty-weight components fixed. Thickness inputs are percentages of chord. This is a relative comparison, not a structural certification calculation.',
inputs:[f('old','Original t/c','%',12,0,40),f('next','New t/c','%',6,0,40),f('wing','Original wing share of empty weight','%',15,0,100)],
run(x){positive(x,'old','next');const ratio=Math.sqrt(x.old/x.next);return [row('Wing-weight multiplier',ratio),row('Wing-weight change',(ratio-1)*100,'%'),row('Empty-weight change with other components fixed',x.wing*(ratio-1),'%')];}}
);
})();
