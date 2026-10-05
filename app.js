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

/* ---------- démo Sport Drop : les vrais écrans de l'appli ---------- */
var SPORTS=["Running","Football","Basketball","Street workout"];
var LEVELS=["Découverte","Débutant","Intermédiaire","Confirmé","Expert"];
var LVC={"Découverte":"#9433EB","Débutant":"#006BFF","Intermédiaire":"#05C759","Confirmé":"#F5A100","Expert":"#ED2E38"};
var GENDERS=[["mixte","Mixte"],["femmes","Entre filles"],["hommes","Entre garçons"]];
var D={st:0,sport:"Running",levels:[],gender:"mixte",cap:4,joined:1,present:null,votes:{},sent:false},timer=null;
var scr=$("screen"),flowLis=qa("#flow li"),stepLbl=$("dStep"),prevB=$("dPrev"),nextB=$("dNext");
var NSTEPS=5;
var A={
 dice:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor"/><circle cx="8.5" cy="8.5" r="1.6" fill="#fff"/><circle cx="15.5" cy="15.5" r="1.6" fill="#fff"/><circle cx="12" cy="12" r="1.6" fill="#fff"/><circle cx="15.5" cy="8.5" r="1.6" fill="#fff"/><circle cx="8.5" cy="15.5" r="1.6" fill="#fff"/></svg>',
 heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2.5a1 1 0 0 1 1 1V5h8V3.5a1 1 0 1 1 2 0V5h.5A2.5 2.5 0 0 1 21 7.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-11A2.5 2.5 0 0 1 5.5 5H6V3.5a1 1 0 0 1 1-1zM5 10v8.5c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V10z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="9" cy="8" r="3.4"/><circle cx="17" cy="9" r="2.8"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z"/><path d="M15.6 20c0-2.2-.7-4-2-5.3.9-.5 2.1-.8 3.4-.8 2.9 0 4.9 2 4.9 4.7V20z"/></svg>',
 person:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="8.5" r="4"/><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z"/></svg>',
 down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>',
 up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V6M6.5 11.5L12 6l5.5 5.5"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
 ok:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M7.5 12.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 no:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="7.6" stroke-width="3.6" stroke-dasharray="3 3"/></svg>',
 info:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 11v6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.3" fill="#fff"/></svg>',
 bubbles:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h9A2.5 2.5 0 0 1 17 5.5v5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.5V13h.5"/><path d="M19 8.5h.5A1.5 1.5 0 0 1 21 10v6a1.5 1.5 0 0 1-1.5 1.5H19V21l-3.5-3.5H11A1.5 1.5 0 0 1 9.5 16v-1.2h5A3.8 3.8 0 0 0 18.3 11V8.5z" opacity=".7"/></svg>'
};
/* Icônes de sport (silhouettes blanches comme dans l'appli) */
var SP={
 "Padel":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><ellipse cx="10" cy="9" rx="5.5" ry="6"/><path d="M13.6 13.6L19.5 20"/><circle cx="18.5" cy="5.5" r="1.6" fill="#fff" stroke="none"/></svg>',
 "Tennis":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M4.6 8.5c3.6 1 5.4 3.6 5.4 7.3M19.4 15.5c-3.6-1-5.4-3.6-5.4-7.3"/></svg>',
 "Football":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.6l3.6 2.6-1.4 4.2H9.8L8.4 10.2z" fill="#fff"/><path d="M12 3.5v4.1M15.6 10.2l4.1-1.2M14.2 14.4l2.4 3.6M9.8 14.4l-2.4 3.6M8.4 10.2L4.3 9"/></svg>',
 "Running":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14.5" cy="4.3" r="1.9" fill="#fff" stroke="none"/><path d="M7 21l3.2-5.6 3 2.4V21M5.5 11.5l3.4-3h4.3l2.2 3.4 3.1 1M11.6 8.5l-2 5.4"/></svg>',
 "Basketball":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5v17M6 6c2.4 1.6 3.8 3.6 3.8 6S8.4 16.4 6 18M18 6c-2.4 1.6-3.8 3.6-3.8 6s1.4 4.4 3.8 6"/></svg>',
 "Street workout":'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3.5h18M6 3.5V21M18 3.5V21"/><circle cx="12" cy="9.2" r="1.8" fill="#fff" stroke="none"/><path d="M9.2 3.8l1.5 3.6h2.6l1.5-3.6M12 11.5v4M12 15.5l-1.6 4.2M12 15.5l1.6 4.2"/></svg>',
 "Boxe anglaise":'<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><circle cx="9" cy="4.5" r="2"/><path d="M7.2 8h3.6l3.7 2.2 2.8-1.3a2.3 2.3 0 1 1 1.4 3.7l-4.5 1.7-2.2-1.2V21H9.6l-.4-5.5L7 21H4.8l2.4-9.2z"/></svg>'
};
function clockText(){var d=new Date();return d.getHours()+":"+("0"+d.getMinutes()).slice(-2)}
setInterval(function(){qa(".sbar .clock").forEach(function(c){c.textContent=clockText()})},15000);
function sbar(light){return '<div class="sbar'+(light?" light":"")+'"><span class="clock">'+clockText()+'</span><span class="ico"><i style="width:17px;height:10px;border-radius:2px;clip-path:polygon(0 70%,25% 70%,25% 50%,50% 50%,50% 25%,75% 25%,75% 0,100% 0,100% 100%,0 100%)"></i><i style="width:24px;height:11px;border-radius:3px;box-shadow:inset 0 0 0 1.5px currentColor;background:linear-gradient(90deg,currentColor 70%,transparent 70%);background-clip:content-box;padding:2px"></i></span></div>'}
function lvLabel(){
 var o=LEVELS.filter(function(l){return D.levels.indexOf(l)>=0});
 if(!o.length||o.length===LEVELS.length)return "Tous niveaux";
 if(o.length===1)return o[0];
 var a=LEVELS.indexOf(o[0]),b=LEVELS.indexOf(o[o.length-1]);
 return (b-a+1===o.length)?o[0]+" à "+o[o.length-1]:o.join(", ");
}
function gLabel(){for(var i=0;i<GENDERS.length;i++)if(GENDERS[i][0]===D.gender)return GENDERS[i][1];return "Mixte"}
/* Participants de la démo (anonymes, comme dans un vrai Sport Drop) */
function members(){
 var lv=D.levels.length&&D.levels.length<5?LEVELS.filter(function(l){return D.levels.indexOf(l)>=0}):["Intermédiaire","Débutant","Confirmé"];
 var g=D.gender==="femmes"?["femme","femme","femme"]:D.gender==="hommes"?["homme","homme","homme"]:["femme","homme","femme"];
 var out=[];for(var i=0;i<Math.min(3,D.cap-1);i++)out.push({g:g[i],lv:lv[i%lv.length]});return out;
}
function summary(n){
 /* Toi compris : femme si « entre filles », homme si « entre garçons » ; en mixte, la démo ne suppose rien */
 var m=members().slice(0,n),f=D.gender==="femmes"?1:0,h=D.gender==="hommes"?1:0;
 m.forEach(function(x){if(x.g==="femme")f++;else h++});
 var p=[];if(f)p.push(f+" femme"+(f>1?"s":""));if(h)p.push(h+" homme"+(h>1?"s":""));return p.join(" · ");
}
function navBar(left,title,right,rightCls){return '<div class="a-nav"><span class="l">'+(left||"")+'</span><b>'+title+'</b><span class="r'+(rightCls?" "+rightCls:"")+'">'+(right||"")+'</span></div>'}
function aSeg(list,cur,key){return '<div class="a-seg">'+list.map(function(x){return '<button type="button" data-k="'+key+'" data-v="'+x[0]+'" aria-pressed="'+(x[0]===cur)+'">'+x[1]+'</button>'}).join("")+'</div>'}

function scCreate(){
 var lvChips='<button type="button" class="a-lv" data-lv="" style="--c:#175CF2" aria-pressed="'+(!D.levels.length)+'">Tous niveaux</button>'+
  LEVELS.map(function(l){return '<button type="button" class="a-lv" data-lv="'+l+'" style="--c:'+LVC[l]+'" aria-pressed="'+(D.levels.indexOf(l)>=0)+'">'+l+'</button>'}).join("");
 return sbar()+navBar("Annuler","Créer une séance",'<button type="button" class="a-pub" data-go="1">Publier</button>')+
 '<div class="a-form">'+
  '<p class="a-h">TYPE DE SÉANCE</p><div class="a-grp">'+aSeg([["m","Mystère"],["c","Club"],["a","Amis"]],"m","type")+'</div>'+
  '<p class="a-h">SPORT</p><div class="a-grp"><button type="button" class="a-row" data-sport="1"><span>Sport</span><em>'+D.sport+' ⌃⌄</em></button><div class="a-row sub">Ton niveau : Intermédiaire</div></div>'+
  '<p class="a-h">NIVEAU DES PARTICIPANTS</p><div class="a-grp"><div class="a-lvs">'+lvChips+'</div></div>'+
  '<p class="a-f">'+(D.levels.length&&D.levels.length<5?"Seules les personnes de niveau "+lvLabel()+" en "+D.sport.toLowerCase()+" verront cette séance et pourront la rejoindre.":"Tout le monde peut venir, du débutant à l'expert.")+'</p>'+
  '<p class="a-h">QUI PEUT VENIR ?</p><div class="a-grp">'+aSeg(GENDERS,D.gender,"gender")+'</div>'+
  '<p class="a-f">'+(D.gender==="mixte"?"Ouvert à tout le monde.":"Entre filles ou entre garçons : seules les personnes concernées voient cette séance.")+'</p>'+
  '<p class="a-h">DATE ET HEURE</p><div class="a-grp"><div class="a-row"><span>Date</span><em class="pill">Demain</em></div><div class="a-row"><span>Heure</span><em class="pill">18:00</em></div><div class="a-row col"><span>Durée : 60 min</span><i class="a-sl" aria-hidden="true"></i></div></div>'+
  '<p class="a-h">LIEU DE RENDEZ-VOUS (OBLIGATOIRE)</p><div class="a-grp"><div class="a-row"><span class="okline">'+A.ok+'Parc du Château, Suresnes</span></div><div class="a-row"><span class="small">Je confirme que ce lieu est un espace public accessible à tous</span><i class="a-sw" aria-hidden="true"></i></div></div>'+
  '<p class="a-h">NOMBRE DE PARTICIPANTS</p><div class="a-grp"><div class="a-row"><span>Total : '+D.cap+' personnes (toi inclus)</span><span class="a-step"><button type="button" data-cap="-1" aria-label="Moins">−</button><button type="button" data-cap="1" aria-label="Plus">+</button></span></div></div>'+
 '</div>';
}
function typePill(){return '<span class="a-type">'+A.dice+'Séance surprise</span>'}
function extraPills(){
 var h="";
 if(D.gender!=="mixte")h+='<span class="a-gp">'+gLabel()+'</span>';
 if(D.levels.length&&D.levels.length<5)h+='<span class="a-lp">'+lvLabel()+'</span>';
 return h;
}
function scList(){
 var places=(D.joined)+"/"+D.cap+" places",sm=D.joined>1?" · "+summary(D.joined-1):"";
 return '<div class="a-dark">'+sbar(true)+
  '<div class="a-title">Séances</div>'+
  '<div class="a-hero"><span class="a-kick">SÉANCES</span><b>Bouge avec les autres</b><small>Séance surprise, club ou avec un ami :<br>trouve ton prochain défi.</small><img src="/seance-art.png" alt=""></div>'+
 '</div>'+
 '<div class="a-panel">'+
  '<div class="a-tabs"><span>Découvrir</span><span class="on">Mes séances</span></div>'+
  '<div class="a-sec mine">Mes séances</div>'+
  '<div class="a-card" data-go="2" role="button" tabindex="0">'+
   '<div class="top"><span class="ic">'+(SP[D.sport]||SP.Running)+'</span><div class="t"><b>'+D.sport+'</b><div class="pills">'+typePill()+extraPills()+'</div></div><span class="hrt">'+A.heart+'</span></div>'+
   '<div class="lines"><div>'+A.cal+'Demain · 18:00</div><div>'+A.pin+'Parc du Château, Suresnes</div><div>'+A.people+places+sm+'</div></div>'+
   '<div class="bot"><span class="team">'+A.people+'Créée par toi</span><button type="button" class="join sec" data-go="2">Gérer</button></div>'+
  '</div>'+
 '</div>';
}
function scDetail(){
 var m=members(),n=Math.min(D.joined-1,m.length),rows="";
 for(var i=0;i<n;i++){var x=m[i];rows+='<div class="a-who"><span class="q">?</span><div><b>'+(x.g==="femme"?"Sportive":"Sportif")+' mystère</b><small>'+(x.g==="femme"?"Femme":"Homme")+' · '+x.lv+' · Pas encore noté</small></div></div>'}
 if(!n)rows='<p class="a-muted">Personne d\'autre pour l\'instant.</p>';
 return sbar()+navBar("",D.sport,"Fermer")+
 '<div class="a-sheet">'+
  '<div class="a-conf"><span class="cf">'+A.ok+'</span><h5>C\'est confirmé</h5><p class="a-muted">Demain · 18:00 — Parc du Château, Suresnes</p></div>'+
  '<div class="a-part"><b>Participants ('+D.joined+'/'+D.cap+')</b>'+(n?'<span class="sum">'+A.people+'Inscrits : '+summary(n)+'</span>':'')+
   '<div class="a-who me"><span class="q">'+A.person+'</span><div><b>Toi</b><small>Tu organises cette séance</small></div></div>'+rows+'</div>'+
  '<button type="button" class="a-btn" data-go="3">'+A.bubbles+'Ouvrir le chat de la séance</button>'+
  '<p class="a-note">Pense à indiquer le point de rendez-vous précis dans le chat.</p>'+
  '<button type="button" class="a-btn red">Je ne peux plus venir</button><p class="a-note">La séance restera maintenue pour les autres.</p>'+
 '</div>';
}
function scChat(){
 return '<div class="a-chat-head">'+sbar(true)+'<div class="row"><span class="b">'+A.down+'</span><span class="ic">'+(SP[D.sport]||SP.Padel)+'</span><div><b>Chat de la séance</b><small>'+D.sport+' · Demain · 18:00</small></div></div></div>'+
 '<div class="a-chat">'+
  '<div class="a-notice">'+A.pin+'<span>Tu organises : précise ici le point de rendez-vous exact (entrée, terrain, couleur de ton t-shirt…).</span></div>'+
  '<div class="a-day"><span>Aujourd\'hui</span></div>'+
  '<div class="a-msg me"><p>On se retrouve à l\'entrée du parc, rue de la République. Je porte un t-shirt bleu.</p><small>17:42</small></div>'+
  '<div class="a-msg"><span class="av">'+A.person+'</span><div><em>Sportive mystère</em><p>Parfait, j\'arrive vers 17 h 55 !</p><small>17:45</small></div></div>'+
  '<div class="a-msg"><span class="av b">'+A.person+'</span><div><em>Sportif mystère</em><p>Top, à demain.</p><small>17:51</small></div></div>'+
 '</div>'+
 '<div class="a-comp"><span class="p">'+A.plus+'</span><span class="f">Écris un message…</span><span class="s">'+A.up+'</span></div>';
}
function scReview(){
 var m=members().slice(0,Math.min(D.joined-1,3)),rows="";
 if(D.sent){
  /* Après « Valider le bilan », la fiche se ferme : ta fiabilité est mise à jour dans ton Profil */
  var hon=D.present?1:0,nos=D.present?0:1,pc=D.present?100:0;
  return '<div class="a-dark prof">'+sbar(true)+'<div class="a-ptitle">Profil<span class="gear">'+A.gear+'</span></div></div>'+
  '<div class="a-ppanel"><b class="a-psec">Ma fiabilité</b>'+
   '<div class="a-rel"><div class="ring"><svg viewBox="0 0 70 70" aria-hidden="true"><circle cx="35" cy="35" r="30" class="t"/><circle cx="35" cy="35" r="30" class="b" style="--to:'+(188.5*(1-pc/100)).toFixed(1)+'"/></svg><div><b>'+pc+' %</b><small>fiable</small></div></div>'+
   '<div class="r"><div class="cols"><i></i><div><b>'+hon+'</b><small>'+(hon===1?'séance<br>honorée':'séances<br>honorées')+'</small></div><i></i><div><b>'+nos+'</b><small>'+(nos===1?'absence':'absences')+'<br>(inscrit, pas venu)</small></div></div>'+
   '<p>'+A.info+'<span>Les séances où tu es venu, sur celles où tu étais inscrit. Se désinscrire avant ne compte pas.</span></p></div></div>'+
  '</div>';
 }
 m.forEach(function(x,i){var id="p"+i,v=D.votes[id];
  rows+='<div class="a-vote"><span class="av'+(x.g==="homme"?" b":"")+'">'+A.person+'</span><div><b>'+(x.g==="femme"?"Sportive":"Sportif")+' mystère n°'+(i+1)+'</b><small>'+(x.g==="femme"?"Femme":"Homme")+' · '+x.lv+'</small></div>'+
  '<button type="button" class="vc g" data-vote="'+id+'" data-v="1" aria-pressed="'+(v===true)+'">Là</button><button type="button" class="vc r" data-vote="'+id+'" data-v="0" aria-pressed="'+(v===false)+'">Absent</button></div>'});
 return sbar()+navBar("","","Fermer")+
 '<div class="a-sheet">'+
  '<h4 class="a-big">Bilan de la séance</h4><p class="a-muted">'+D.sport+' · Hier · 18:00</p>'+
  '<b class="a-q">Étais-tu là ?</b><div class="a-yn"><button type="button" class="g" data-present="1" aria-pressed="'+(D.present===true)+'">'+A.ok+'Oui, j\'y étais</button><button type="button" class="r" data-present="0" aria-pressed="'+(D.present===false)+'">'+A.no+'Non</button></div>'+
  (D.present===true&&rows?'<b class="a-q">Qui était là ?</b><p class="a-muted small">Ton avis compte pour la fiabilité des autres. Si quelqu\'un n\'est pas venu, même l\'organisateur, dis-le ici. Si tu ne sais pas, ne réponds pas.</p>'+rows:'')+
  (D.present===false?'<p class="a-card-note">Merci d\'être honnête. La prochaine fois, désinscris-toi avant la séance : seules les absences sans prévenir comptent dans ta fiabilité.</p>':'')+
  '<div class="a-dock"><button type="button" class="a-btn'+(D.present===null?" off":"")+'" data-send="1">Valider le bilan</button></div>'+
 '</div>';
}
function render(){
 var h;
 if(D.st===0)h=scCreate();else if(D.st===1)h=scList();else if(D.st===2)h=scDetail();else if(D.st===3)h=scChat();else h=scReview();
 scr.innerHTML='<div class="a-scr s'+D.st+'">'+h+'</div>';
 flowLis.forEach(function(li){var s=+li.getAttribute("data-s");li.classList.toggle("cur",s===D.st);li.classList.toggle("done",s<D.st)});
 if(stepLbl)stepLbl.textContent="Écran "+(D.st+1)+" sur "+NSTEPS;
 if(prevB)prevB.disabled=D.st===0;
 var atEnd=D.st===NSTEPS-1;
 if(nextB){nextB.disabled=atEnd&&!D.sent;nextB.textContent=atEnd&&D.sent?"↺":"›";nextB.setAttribute("aria-label",atEnd&&D.sent?"Recommencer la démo":"Écran suivant")}
 clearTimeout(timer);
 /* Les autres rejoignent la séance, un par un */
 if(D.st===2&&D.joined<Math.min(4,D.cap)){timer=setTimeout(function(){D.joined++;render()},reduce?250:1100)}
}
function go(s){
 D.st=Math.max(0,Math.min(NSTEPS-1,s));
 if(D.st===1)D.joined=Math.max(D.joined,2);
 if(D.st>=3)D.joined=Math.max(D.joined,Math.min(4,D.cap));
 /* Bilan : « Oui, j'y étais » déjà coché pour montrer la suite (on peut changer) */
 if(D.st===4&&D.present===null&&!D.sent)D.present=true;
 D.joined=Math.min(D.joined,D.cap);
 render();
}
scr.addEventListener("click",function(e){
 var t=e.target.closest("button,[data-go]");if(!t)return;
 if(t.hasAttribute("data-lv")){var l=t.getAttribute("data-lv");if(!l)D.levels=[];else{var i=D.levels.indexOf(l);if(i>=0)D.levels.splice(i,1);else D.levels.push(l);if(D.levels.length===LEVELS.length)D.levels=[]}render();return}
 if(t.hasAttribute("data-k")){var k=t.getAttribute("data-k");if(k==="gender")D.gender=t.getAttribute("data-v");render();return}
 if(t.hasAttribute("data-sport")){D.sport=SPORTS[(SPORTS.indexOf(D.sport)+1)%SPORTS.length];render();return}
 if(t.hasAttribute("data-cap")){D.cap=Math.max(2,Math.min(15,D.cap+(+t.getAttribute("data-cap"))));D.joined=Math.min(D.joined,D.cap);render();return}
 if(t.hasAttribute("data-present")){D.present=t.getAttribute("data-present")==="1";render();return}
 if(t.hasAttribute("data-vote")){var id=t.getAttribute("data-vote"),v=t.getAttribute("data-v")==="1";D.votes[id]=(D.votes[id]===v)?undefined:v;render();return}
 if(t.hasAttribute("data-send")){if(D.present===null)return;D.sent=true;render();return}
 if(t.hasAttribute("data-reset")){D={st:0,sport:D.sport,levels:[],gender:"mixte",cap:4,joined:1,present:null,votes:{},sent:false};render();return}
 if(t.hasAttribute("data-go")){go(+t.getAttribute("data-go"))}
});
if(prevB)prevB.addEventListener("click",function(){go(D.st-1)});
if(nextB)nextB.addEventListener("click",function(){if(D.st===NSTEPS-1&&D.sent){D={st:0,sport:D.sport,levels:[],gender:"mixte",cap:4,joined:1,present:null,votes:{},sent:false};render()}else go(D.st+1)});
flowLis.forEach(function(li){li.addEventListener("click",function(){go(+li.getAttribute("data-s"))})});
render();

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
