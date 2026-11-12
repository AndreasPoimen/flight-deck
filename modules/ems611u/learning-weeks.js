/* Course structure is based on the labels in the supplied lecture files. */
(() => {
'use strict';
const data=STUDY_DATA;
data.learningWeeks=[
 {id:'week4',label:'Week 4 · Conceptual sizing',sources:['sizingLecture','sizingSummary','aswLecture'],intro:'Work from aircraft requirements to takeoff weight, mission fuel fractions, propulsion efficiency and the ASW sizing example.'},
 {id:'week5',label:'Week 5 · Aerofoil selection',sources:['aeroRoadmap','aerofoilLecture','aerofoilSummary','highLiftLecture'],intro:'Understand aerofoil geometry and section coefficients, then compare aerofoil families, stall characteristics, thickness and high-lift devices.'},
 {id:'week6',label:'Week 6 · Wing and tail design',sources:['wingLecture','tailLecture','wingSummary'],intro:'Move from the two-dimensional aerofoil to a finite wing, then choose planform, twist, incidence, wing position and tail arrangement.'},
 {id:'week8',label:'Week 8 · Performance constraints',sources:['loadingLecture','constraintLecture','constraintAlternate','loadingSummary'],intro:'Use thrust-to-weight and wing loading to compare stall, takeoff, landing, cruise, turn and climb requirements on a common design basis.'},
 {id:'support-aero',label:'Supporting notes · Aerodynamics',sources:['aero'],intro:'Review lift, drag, the linear lift relation and finite-wing effects using the supplied aerodynamics recap.'},
 {id:'support-flight',label:'Supporting notes · Flight mechanics',sources:['flight'],intro:'Review force balance in level flight, climb, descent and glide, with the supplied atmosphere and powered-glider examples.'},
 {id:'support-prop',label:'Supporting notes · Propellers',sources:['prop'],intro:'Study propeller thrust, efficiency, pitch, actuator-disc theory, coefficients and blade-element momentum.'},
 {id:'support-jet',label:'Supporting notes · Jet engines',sources:['jet'],intro:'Study engine layouts, momentum and thrust, fuel consumption, efficiency, altitude effects and engine sizing.'}
];
for(const lesson of data.lessons){const week=data.learningWeeks.find(w=>w.sources.includes(lesson.source));if(!week)throw Error('No learning week for '+lesson.id);lesson.week=week.id;}
data.lessons.sort((a,b)=>data.learningWeeks.findIndex(w=>w.id===a.week)-data.learningWeeks.findIndex(w=>w.id===b.week));
})();
