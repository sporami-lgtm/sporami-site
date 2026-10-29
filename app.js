/* SPORAMI — page d'accueil (v1.3) : le titre change de sport, la photo du lieu et le ticket suivent.
   Tout le contenu reste lisible sans JavaScript ; ici, on ne fait qu'ajouter un peu de mouvement. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- barre de navigation ---------- */
  var nav = $("nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  var links = all(".nav nav a");
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle("act", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    all("main > section").forEach(function (s) { spy.observe(s); });   // une section sans lien efface le point
  }

  /* ---------- accueil : « Trouve avec qui faire du padel. », la photo du lieu et le ticket suivent ---------- */
  var swap = $("swap"), tSport = $("tSport"), tLevel = $("tLevel");
  var chips = all(".picker button"), photos = all(".v-ph");
  var current = 0, timer = null, userPicked = false;

  function loadPhoto(p) {   // les photos des autres sports ne se chargent qu'après la page
    if (!p || p.getAttribute("data-ready")) return;
    p.setAttribute("data-ready", "1");
    all("[data-srcset]", p).forEach(function (el) { el.setAttribute("srcset", el.getAttribute("data-srcset")); el.removeAttribute("data-srcset"); });
    all("img[data-src]", p).forEach(function (el) { el.setAttribute("src", el.getAttribute("data-src")); el.removeAttribute("data-src"); });
  }
  function setText(el, text) {
    if (!el || el.textContent === text) return;
    if (reduce || !el.animate) { el.textContent = text; return; }
    el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-.25em)" }], { duration: 160, easing: "ease-in" }).onfinish = function () {
      el.textContent = text;
      el.animate([{ opacity: 0, transform: "translateY(.35em)" }, { opacity: 1, transform: "none" }], { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" });
    };
  }
  function show(i, phrase) {
    var chip = chips[i];
    if (!chip) return;
    current = i;
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
    photos.forEach(function (p) { if (+p.getAttribute("data-i") === i) loadPhoto(p); });
    photos.forEach(function (p) { p.classList.toggle("is-on", +p.getAttribute("data-i") === i); });
    loadPhoto(photos[i + 1]);   // la suivante est prête avant d'être montrée
    setText(swap, phrase || chip.getAttribute("data-phrase"));
    var name = chip.getAttribute("data-sport");
    setText(tSport, name);
    if (tSport) tSport.classList.toggle("long", name.length > 10);
    setText(tLevel, chip.getAttribute("data-level"));
  }
  chips.forEach(function (chip, i) {
    chip.addEventListener("click", function () { userPicked = true; clearTimeout(timer); show(i); });
  });

  // Un seul tour des sports, puis le titre revient à « du sport. » (sauf si la personne a choisi un sport)
  function tour(i) {
    if (userPicked) return;
    if (i >= chips.length) { show(0, "du sport."); return; }
    show(i);
    timer = setTimeout(function () { tour(i + 1); }, 2300);
  }
  if (swap && chips.length && !reduce) {
    addEventListener("load", function () {
      loadPhoto(photos[1]);
      timer = setTimeout(function () { tour(0); }, 1600);
    });
    // L'accueil n'est plus à l'écran : on arrête le tour
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting && timer && !userPicked) { clearTimeout(timer); timer = null; userPicked = true; show(0, "du sport."); }
      }).observe($("hero"));
    }
  }

  /* ---------- Communauté : comment on rejoint un club (mêmes textes que l'appli) ---------- */
  var modeTxt = $("modeTxt"), modes = all(".modes button");
  modes.forEach(function (b) {
    b.addEventListener("click", function () {
      modes.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      if (modeTxt) modeTxt.textContent = b.getAttribute("data-t");
    });
  });

  /* ---------- écussons : toucher pour voir la condition ---------- */
  var info = $("badgeInfo"), badges = all(".badge");
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  badges.forEach(function (b) {
    b.addEventListener("click", function () {
      badges.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      info.innerHTML = "<b>" + esc(b.getAttribute("data-name")) + "</b> " + esc(b.getAttribute("data-detail")) + ". " +
        '<span class="r-' + b.getAttribute("data-r") + '">' + esc(b.getAttribute("data-rarity")) + "</span>";
    });
  });
})();
