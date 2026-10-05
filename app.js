/* SPORAMI — interactions de la page d'accueil */
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
var qa=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var fine=window.matchMedia&&matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- icônes ---------- */
var I={
 spark:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
 run:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14" cy="4.5" r="1.8"/><path d="M8 21l3-6 3 2v4M6 12l3-3h4l2 3 3 1M11 9l-2 5"/></svg>',
 team:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15 14.6c3 0 5.5 1.9 5.5 5"/></svg>',
 quest:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.2-2.5 3.8"/><circle cx="12" cy="17.2" r=".6" fill="currentColor"/></svg>',
 club:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M3 21h18"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/></svg>',
 plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M21 3L3 10.5l7 2.5 2.5 7z"/><path d="M10 13l5-5"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 friends:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5M13 15.3c.9-.2 1.9-.3 3-.3 3 0 5.5 2 5.5 5"/></svg>'
};

/* ---------- curseur lumineux + barre de progression + nav ---------- */
var spot=$("spot"),prog=$("progress"),nav=$("nav");
var mx=innerWidth/2,my=innerHeight/3,sx=mx,sy=my,spotOn=false;
if(fine&&!reduce){
 addEventListener("pointermove",function(e){mx=e.clientX;my=e.clientY;if(!spotOn){spotOn=true;spot.classList.add("on")}},{passive:true});
 (function loop(){sx+=(mx-sx)*.12;sy+=(my-sy)*.12;spot.style.transform="translate3d("+sx+"px,"+sy+"px,0)";requestAnimationFrame(loop)})();
}
var ticking=false;
function onScroll(){
 var h=document.documentElement,max=h.scrollHeight-h.clientHeight,y=h.scrollTop||document.body.scrollTop;
 prog.style.transform="scaleX("+(max>0?y/max:0)+")";
 nav.classList.toggle("scrolled",y>40);ticking=false;
}
addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

/* section active dans le menu */
var links=qa(".nav nav a");
if("IntersectionObserver" in window){
 var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle("act",a.getAttribute("href")==="#"+e.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});
 links.forEach(function(a){var s=document.querySelector(a.getAttribute("href"));if(s)spy.observe(s)});
}

/* ---------- logo 3D + cartes flottantes ---------- */
var stage=$("stage"),tilt=$("tilt"),floats=qa(".float");
if(stage&&fine&&!reduce){
 stage.addEventListener("pointermove",function(e){
  var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  tilt.style.transform="rotateY("+(x*20)+"deg) rotateX("+(-y*20)+"deg)";
  tilt.style.setProperty("--gx",(x+.5)*100+"%");tilt.style.setProperty("--gy",(y+.5)*100+"%");
  floats.forEach(function(f){var d=+f.getAttribute("data-depth");f.style.translate=(x*d)+"px "+(y*d)+"px"});
 });
 stage.addEventListener("pointerleave",function(){tilt.style.transform="";floats.forEach(function(f){f.style.translate=""})});
}
/* sur iPhone : le logo suit l'inclinaison au défilement */
if(stage&&!fine&&!reduce){
 addEventListener("scroll",function(){var r=stage.getBoundingClientRect(),p=(r.top+r.height/2)/innerHeight-.5;tilt.style.transform="rotateX("+(p*16)+"deg)"},{passive:true});
}

/* ---------- boutons magnétiques ---------- */
if(fine&&!reduce){
 qa(".magnet").forEach(function(b){
  b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform="translate("+x*.22+"px,"+y*.32+"px)"});
  b.addEventListener("pointerleave",function(){b.style.transform=""});
 });
}

/* ---------- cartes lumineuses ---------- */
qa(".glow-card").forEach(function(c){
 c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")});
});

/* ---------- apparition au défilement + compteurs ---------- */
function count(el){
 var to=+el.getAttribute("data-count"),t0=null,dur=1400;
 if(reduce||to===0){el.textContent=to;return}
 function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,4);el.textContent=Math.round(to*e);if(k<1)requestAnimationFrame(step)}
 requestAnimationFrame(step);
}
var rvs=qa(".rv");
if("IntersectionObserver" in window&&!reduce){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");qa("[data-count]",e.target).forEach(count);io.unobserve(e.target)}})},{threshold:.15,rootMargin:"0px 0px -6% 0px"});
 rvs.forEach(function(e){io.observe(e)});
}else{rvs.forEach(function(e){e.classList.add("in")});qa("[data-count]").forEach(count)}

/* ---------- défilé des 38 sports de l'app ---------- */
var S1=["Football","Tennis","Padel","Running","Basketball","Boxe anglaise","Natation","Musculation","Handball","Escalade","Yoga","Judo","Cyclisme","Volleyball","Rugby","Badminton","Fitness","Randonnée","MMA"];
var S2=["Futsal","Cross-training","Karaté","Squash","Tennis de table","Golf","Pilates","Kick-boxing","Danse","Hockey","Athlétisme","Taekwondo","VTT","Aviron","Marche","Lutte","Roller","Jiu-jitsu brésilien","Skateboard"];
function fill(id,list){var el=$(id);if(!el)return;var h=list.concat(list).map(function(s){return "<span>"+s+"</span>"}).join("");el.innerHTML=h;
 qa("span",el).forEach(function(s,i){if(i>=list.length)s.setAttribute("aria-hidden","true")})}
fill("mrow1",S1);fill("mrow2",S2);

/* ---------- 3 façons de bouger (textes de l'app) ---------- */
var MODES=[
 {id:"drop",tab:"Sport Drop",ic:I.spark,k:"LA SPÉCIALITÉ SPORAMI",t:"Rencontre de nouveaux sportifs",p:"Choisis ton sport et ton créneau : on forme une équipe de sportifs de ton niveau, près de chez toi. Tu découvres qui vient sur place !",
  s:[[I.run,"Choisis ton sport","Et ton créneau"],[I.team,"On forme l'équipe","De ton niveau, près de chez toi"],[I.quest,"Découvre qui vient","Sur place, dans un lieu public"]]},
 {id:"club",tab:"Club",ic:I.club,k:"AVEC TON CLUB",t:"Une séance avec ton club",p:"Propose un créneau aux membres de ton club : ils reçoivent l'invitation et rejoignent la séance en un clic.",
  s:[[I.club,"Choisis ton club",""],[I.cal,"Fixe le créneau",""],[I.team,"Les membres rejoignent","En un clic"]]},
 {id:"amis",tab:"Amis",ic:I.friends,k:"AVEC TES AMIS",t:"Une séance entre amis",p:"Choisis le sport, l'heure et le lieu, puis invite tes amis. Vous vous organisez ensemble dans le chat de la séance.",
  s:[[I.run,"Choisis ton sport","L'heure et le lieu"],[I.plane,"Invite tes amis",""],[I.pin,"Rendez-vous sur place","Organisés dans le chat"]]}
];
var seg=$("seg"),ind=$("segInd"),card=$("modeCard"),btns=[];
MODES.forEach(function(m,i){
 var b=document.createElement("button");b.type="button";b.setAttribute("role","tab");b.id="mt"+i;b.className=m.id==="drop"?"drop":"";
 b.innerHTML=m.ic+m.tab;b.addEventListener("click",function(){selMode(i)});
 b.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){var n=(i+(e.key==="ArrowRight"?1:2))%3;selMode(n);btns[n].focus()}});
 seg.appendChild(b);btns.push(b);
});
function placeInd(i){var b=btns[i];ind.style.left=b.offsetLeft+"px";ind.style.width=b.offsetWidth+"px";ind.classList.toggle("gold",i===0)}
function selMode(i){
 var m=MODES[i],gold=i===0;
 btns.forEach(function(b,j){b.setAttribute("aria-selected",j===i);b.tabIndex=j===i?0:-1});
 placeInd(i);
 card.style.setProperty("--accent",gold?"rgba(255,180,80,.30)":"rgba(61,123,255,.38)");
 card.style.setProperty("--acc-txt",gold?"var(--gold)":"var(--peri)");
 card.style.setProperty("--acc-bg",gold?"linear-gradient(135deg,var(--gold2),var(--gold3))":"linear-gradient(135deg,#4C86FF,var(--blue2))");
 card.style.setProperty("--acc-ic",gold?"#2A1A02":"#fff");
 card.style.setProperty("--acc-sh",gold?"rgba(255,170,60,.9)":"rgba(40,100,255,.9)");
 card.style.setProperty("--acc-line",gold?"rgba(255,194,102,.6)":"rgba(94,158,255,.6)");
 card.innerHTML='<div><p class="mk in-anim">'+m.k+'</p><h3 class="in-anim d2">'+m.t+'</h3><p class="in-anim d3">'+m.p+'</p></div>'+
  '<ol class="msteps">'+m.s.map(function(s){return '<li><span class="ico">'+s[0]+'</span><div>'+s[1]+(s[2]?'<small>'+s[2]+'</small>':'')+'</div></li>'}).join("")+'</ol>';
 card.setAttribute("aria-labelledby","mt"+i);
}
selMode(0);
addEventListener("resize",function(){var i=btns.findIndex(function(b){return b.getAttribute("aria-selected")==="true"});placeInd(i<0?0:i)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){placeInd(btns.findIndex(function(b){return b.getAttribute("aria-selected")==="true"}))});

/* ---------- fiabilité (même règle que l'app) ---------- */
var tot=$("tot"),hon=$("hon"),gBar=$("gBar"),gVal=$("gVal"),gSub=$("gSub"),C=578.05,shown=0,anim=null;
function setFill(el){var max=+el.max||1;el.style.setProperty("--fill",(max?el.value/max*100:0)+"%")}
function rel(src){
 var t=+tot.value,h=+hon.value;
 // on ne peut pas honorer plus de séances que prévu : l'autre curseur suit
 if(h>t){if(src==="hon"){t=h;tot.value=t}else{h=t;hon.value=h}}
 $("vTot").textContent=t;$("vHon").textContent=h;setFill(tot);setFill(hon);
 var p=t>0?Math.min(100,Math.floor(h/t*100)):null;
 gBar.style.strokeDashoffset=C*(1-(p||0)/100);
 if(p===null){cancelAnimationFrame(anim);shown=0;gVal.textContent="–";gVal.className="new";gSub.textContent="pas encore noté";return}
 gVal.className="";gSub.textContent="fiable · venu "+h+" fois sur "+t;
 var from=shown,t0=null;cancelAnimationFrame(anim);
 (function step(ts){if(!t0)t0=ts;var k=reduce?1:Math.min(1,(ts-t0)/700),e=1-Math.pow(1-k,3);shown=Math.round(from+(p-from)*e);gVal.textContent=shown+"\u00a0%";if(k<1)anim=requestAnimationFrame(step)})(performance.now());
}
tot.addEventListener("input",function(){rel("tot")});hon.addEventListener("input",function(){rel("hon")});
qa(".presets button").forEach(function(b){b.addEventListener("click",function(){tot.value=b.getAttribute("data-t");hon.value=b.getAttribute("data-h");rel()})});
rel();

/* ---------- FAQ animée ---------- */
qa(".faq details").forEach(function(d){
 var s=d.querySelector("summary"),a=d.querySelector(".a");
 s.addEventListener("click",function(e){
  if(reduce||!a.animate)return;
  e.preventDefault();
  if(d.open){var h=a.offsetHeight;var an=a.animate([{height:h+"px",opacity:1},{height:"0px",opacity:0}],{duration:380,easing:"cubic-bezier(.2,.8,.2,1)"});an.onfinish=function(){d.open=false}}
  else{d.open=true;var h2=a.offsetHeight;a.animate([{height:"0px",opacity:0},{height:h2+"px",opacity:1}],{duration:480,easing:"cubic-bezier(.2,.8,.2,1)"})}
 });
});
})();
