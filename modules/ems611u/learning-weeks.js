/* Weeks 1–3 follow the confirmed lecture sequence. */
(() => {
'use strict';
const data=STUDY_DATA;
data.learningWeeks=[
 {id:'week1',label:'Week 1 · Recap & flight mechanics',sources:['aero','flight'],intro:'Review aerodynamic coefficients, lift and drag, then apply force balance to level flight, climb, descent and glide.'},
 {id:'week2',label:'Week 2 · Propeller engine design concepts',sources:['prop'],intro:'Study propeller thrust, efficiency, blade geometry, actuator-disc theory and performance.'},
 {id:'week3',label:'Week 3 · Jet engines',sources:['jet'],intro:'Study engine layouts, thrust, fuel consumption, efficiency, altitude effects and engine sizing.'},
 {id:'week4',label:'Week 4 · Conceptual sizing',sources:['sizingLecture','sizingSummary','aswLecture'],intro:'Work from aircraft requirements to takeoff weight, mission fuel fractions, propulsion efficiency and the ASW sizing example.'},
 {id:'week5',label:'Week 5 · Aerofoil selection',sources:['aeroRoadmap','aerofoilLecture','aerofoilSummary','highLiftLecture'],intro:'Understand aerofoil geometry and section coefficients, then compare aerofoil families, stall characteristics, thickness and high-lift devices.'},
 {id:'week6',label:'Week 6 · Wing and tail design',sources:['wingLecture','tailLecture','wingSummary'],intro:'Move from the two-dimensional aerofoil to a finite wing, then choose planform, twist, incidence, wing position and tail arrangement.'},
 {id:'week8',label:'Week 8 · Performance constraints',sources:['loadingLecture','constraintLecture','constraintAlternate','loadingSummary'],intro:'Use thrust-to-weight and wing loading to compare stall, takeoff, landing, cruise, turn and climb requirements on a common design basis.'},

];
for(const lesson of data.lessons){const week=data.learningWeeks.find(w=>w.sources.includes(lesson.source));if(!week)throw Error('No learning week for '+lesson.id);lesson.week=week.id;}
data.lessons.sort((a,b)=>data.learningWeeks.findIndex(w=>w.id===a.week)-data.learningWeeks.findIndex(w=>w.id===b.week));
})();
