(function(){
var $=function(i){return document.getElementById(i)};
/* démo séance mystère */
var sports=["Padel","Running","Foot","Tennis","Fitness"],levels=["Débutant","Intermédiaire","Confirmé"];
var sp="Padel",lv="Intermédiaire",stage=0;
function chips(id,list,cur,set){var box=$(id);box.innerHTML="";list.forEach(function(x){var b=document.createElement("button");b.type="button";b.className="chip";b.textContent=x;b.setAttribute("aria-pressed",x===cur);b.onclick=function(){set(x);};box.appendChild(b)})}
function draw(){
 chips("sports",sports,sp,function(x){sp=x;stage=0;draw()});
 chips("levels",levels,lv,function(x){lv=x;stage=0;draw()});
 $("dTitle").textContent=sp;$("dSub").textContent="Niveau "+lv.toLowerCase();
 document.querySelectorAll(".who small").forEach(function(s){s.textContent=lv+" · Nouveau"});
 var h=["Tu vois le niveau et la fiabilité des autres, jamais leur prénom. Exemple illustratif.","Tu es inscrit. Retrouvez-vous dans le lieu public choisi.","Après la séance, chacun confirme sa présence. C'est ce qui construit la fiabilité."];
 $("hint").textContent=h[stage];
 $("reveal").textContent=["Rejoindre la séance","Confirmer ma présence","Recommencer"][stage];
}
$("reveal").onclick=function(){stage=(stage+1)%3;draw()};
draw();
/* étapes */
var steps=[
 {t:"Choisis",h:"Choisis ton sport et ton niveau",p:"Running, foot, tennis, padel, fitness… Tu indiques ton niveau pour tomber sur des partenaires qui te correspondent.",v:["Padel","Niveau intermédiaire"]},
 {t:"Rejoins",h:"Rejoins ou crée une séance",p:"Parmi les séances proches, ou en créant la tienne. En mode mystère, entre amis ou dans un club.",v:["Séance mystère","Entre amis","En club"]},
 {t:"Retrouvez-vous",h:"Un lieu public, un chat de séance",p:"Chaque séance a lieu dans un lieu public confirmé par l'organisateur. Vous discutez dans le chat pour vous organiser.",v:["Lieu public confirmé","Chat de la séance"]},
 {t:"Jouez",h:"Confirme ta présence",p:"Les participants confirment qui est venu. C'est ce qui construit la fiabilité de chacun.",v:["Présence confirmée","Fiabilité mise à jour"]}];
var tabs=$("tabs"),panels=$("panels");
steps.forEach(function(s,i){
 var b=document.createElement("button");b.className="tab";b.type="button";b.id="t"+i;b.setAttribute("role","tab");b.setAttribute("aria-controls","p"+i);b.textContent=(i+1)+". "+s.t;tabs.appendChild(b);
 var d=document.createElement("div");d.className="panel";d.id="p"+i;d.setAttribute("role","tabpanel");d.innerHTML="<div><h3>"+s.h+"</h3><p>"+s.p+"</p></div><div class='vis'>"+s.v.map(function(x,j){return "<span class='pill"+(j==0?" on":"")+"'>"+x+"</span>"}).join("")+"</div>";panels.appendChild(d);
 b.onclick=function(){sel(i)}});
function sel(n){steps.forEach(function(_,i){$("t"+i).setAttribute("aria-selected",i===n);$("p"+i).hidden=i!==n})}
sel(0);
/* fiabilité (même règle que l'app) */
function rel(){var t=+$("tot").value,h=+$("hon").value;if(h>t){h=t;$("hon").value=h}
 $("hon").max=Math.max(t,0);$("vTot").textContent=t;$("vHon").textContent=h;
 var p=t>0?Math.min(100,Math.floor(h/t*100)):null;
 $("ring").style.setProperty("--p",p||0);
 $("rTxt").innerHTML=p===null?"Nouveau<small>pas encore de séance</small>":p+" %<small>fiable</small>"}
$("tot").oninput=rel;$("hon").oninput=rel;rel();
/* apparition douce */
var els=document.querySelectorAll(".rv");
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})}else els.forEach(function(e){e.classList.add("in")});
})();
