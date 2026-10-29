/* SPORAMI — page d'accueil : lumière WebGL, iPhone 3D, Sport Drop au défilement.
   Tout le contenu reste lisible sans JavaScript ; ici, on ne fait qu'ajouter du mouvement. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var lerp = function (a, b, k) { return a + (b - a) * k; };

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

  /* ---------- apparitions au défilement ---------- */
  var rvs = all(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rvs.forEach(function (el) { io.observe(el); });
  } else {
    rvs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- lumière qui suit le curseur, boutons aimantés, verre éclairé ---------- */
  if (fine && !reduce) {
    var spot = $("spot"), mx = innerWidth / 2, my = innerHeight / 3, sx = mx, sy = my, spotOn = false;
    addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!spotOn) { spotOn = true; spot.classList.add("on"); }
    }, { passive: true });
    (function loop() {
      sx = lerp(sx, mx, 0.12); sy = lerp(sy, my, 0.12);
      spot.style.transform = "translate3d(" + sx + "px," + sy + "px,0)";
      requestAnimationFrame(loop);
    })();
    all(".magnet").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.2 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    all(".glass").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px");
        c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------- ciel lumineux en WebGL (projecteurs de stade) ---------- */
  var sky = $("sky"), hero = $("hero");
  (function () {
    if (!sky || !sky.getContext) return;
    var gl = sky.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return;
    var vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var fs = [
      "precision mediump float;uniform vec2 r;uniform float t;",
      "float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
      "float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}",
      "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}",
      "float beam(vec2 q,vec2 o,float ang,float w){vec2 d=q-o;float a=atan(d.x,-d.y)-ang;float l=length(d);return smoothstep(w*(.35+l),0.,abs(a))*smoothstep(1.9,.1,l);}",
      "void main(){vec2 uv=gl_FragCoord.xy/r;float k=r.x/r.y;vec2 q=vec2(uv.x*k,uv.y);",
      "vec3 c=mix(vec3(.016,.039,.15),vec3(.06,.1,.32),pow(uv.y,1.4));",
      "float hz=fbm(q*1.5+vec2(t*.025,-t*.018));",
      "float b1=beam(q,vec2(k*.9,1.12),-.62+.06*sin(t*.23),.12);",
      "float b2=beam(q,vec2(k*.06,1.1),.55+.05*sin(t*.19+1.3),.10);",
      "float b3=beam(q,vec2(k*.55,1.25),.08*sin(t*.15+2.),.07);",
      "c+=vec3(1.,.78,.45)*b1*(.16+.34*hz);",
      "c+=vec3(.36,.55,1.)*b2*(.14+.32*hz);",
      "c+=vec3(.55,.68,1.)*b3*(.06+.16*hz);",
      "c+=vec3(.1,.22,.85)*.16*hz*smoothstep(.1,1.,uv.y);",
      "c*=1.-.32*length((uv-vec2(.5,.62))*vec2(.9,1.2));",
      "c=mix(c,vec3(.016,.039,.15),smoothstep(.25,0.,uv.y));",
      "c+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.018;",
      "gl_FragColor=vec4(c,1.);}"
    ].join("\n");
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return;
    var pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t");
    var scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;   // demi-résolution : la lumière est floue de toute façon
    function size() {
      var w = Math.max(1, Math.round(sky.clientWidth * scale)), h = Math.max(1, Math.round(sky.clientHeight * scale));
      if (sky.width !== w || sky.height !== h) { sky.width = w; sky.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(uR, w, h);
    }
    var visible = true, start = performance.now(), last = 0;
    function draw(now) {
      size();
      gl.uniform1f(uT, (now - start) / 1000 + 8);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function frame(now) {
      if (visible && !document.hidden && now - last > 33) { last = now; draw(now); }   // ~30 images par seconde suffisent
      requestAnimationFrame(frame);
    }
    draw(performance.now());
    sky.classList.add("on");
    if (!reduce) {
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);
      requestAnimationFrame(frame);
    }
    addEventListener("resize", function () { draw(performance.now()); });
  })();

  /* ---------- les iPhone suivent le curseur et basculent au défilement ---------- */
  var rig = $("rig"), stage = $("stage");
  if (rig && stage && !reduce) {
    var tx = 0, ty = 0, cx = 0, cy = 0, ticking = false;
    function tick() {
      cx = lerp(cx, tx, 0.07); cy = lerp(cy, ty, 0.07);
      var r = hero.getBoundingClientRect();
      var k = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      rig.style.transform = "rotateX(" + (cy * -7 + k * 10).toFixed(3) + "deg) rotateY(" + (cx * 9).toFixed(3) + "deg) translateY(" + (k * -40).toFixed(2) + "px)";
      if (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001) requestAnimationFrame(tick); else ticking = false;
    }
    function kick() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }
    if (fine) {
      hero.addEventListener("pointermove", function (e) {
        var r = stage.getBoundingClientRect();
        tx = Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1));
        ty = Math.max(-1, Math.min(1, (e.clientY - r.top) / r.height * 2 - 1));
        kick();
      });
      hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
    }
    addEventListener("scroll", function () { if (window.scrollY < innerHeight * 1.3) kick(); }, { passive: true });
  }

  /* ---------- ticket du Sport Drop : le sport choisi s'affiche dessus ---------- */
  var tSport = $("tSport"), tLevel = $("tLevel"), chips = all(".picker button");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      tSport.textContent = chip.getAttribute("data-sport");
      tLevel.textContent = chip.getAttribute("data-level") || "Le tien";
      if (!reduce && tSport.animate) {
        tSport.animate([{ opacity: 0, transform: "translateY(12px)", filter: "blur(4px)" }, { opacity: 1, transform: "none", filter: "none" }],
          { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
    });
  });

  /* ---------- Sport Drop : l'écran du téléphone suit l'étape lue ---------- */
  var steps = all(".step"), scrs = all(".story-stage .scr"), dots = all(".story-dots i"), phoneStory = document.querySelector(".phone-story");
  function setStep(i) {
    steps.forEach(function (s, j) { s.classList.toggle("is-active", j === i); });
    scrs.forEach(function (s, j) { s.classList.toggle("is-on", j === i); });
    dots.forEach(function (d, j) { d.classList.toggle("on", j === i); });
    if (phoneStory && !reduce) phoneStory.style.transform = "rotateY(" + (i % 2 ? 10 : -12) + "deg) rotateX(4deg)";
  }
  // Les étapes sont courtes : les écrans défilent tout seuls quand la partie est à l'écran, et on peut toucher une étape
  var cur = 0, auto = null, storyOn = false;
  steps.forEach(function (s, i) { s.addEventListener("click", function () { cur = i; setStep(i); }); });
  if (!reduce && steps.length && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      storyOn = es[0].isIntersecting;
      clearInterval(auto);
      if (storyOn) auto = setInterval(function () { cur = (cur + 1) % steps.length; setStep(cur); }, 2800);
    }, { threshold: 0.35 }).observe(document.querySelector(".story"));
  }
  /* ---------- vidéo de l'écran de bienvenue : arrêtée si « réduire les animations » ---------- */
  var vid = document.querySelector(".wel-vid");
  if (vid && reduce) { vid.removeAttribute("autoplay"); vid.pause(); }

  /* ---------- écussons : toucher pour voir la condition, inclinaison au survol ---------- */
  var info = $("badgeInfo"), badges = all(".badge");
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  badges.forEach(function (b) {
    b.addEventListener("click", function () {
      badges.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      info.innerHTML = "<b>" + esc(b.getAttribute("data-name")) + "</b> " + esc(b.getAttribute("data-detail")) + ". " +
        '<span class="r-' + b.getAttribute("data-r") + '">' + esc(b.getAttribute("data-rarity")) + "</span>";
    });
    if (fine && !reduce) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        b.style.setProperty("--by", (x * 26).toFixed(2) + "deg");
        b.style.setProperty("--bx", (-y * 26).toFixed(2) + "deg");
      });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--by", "0deg"); b.style.setProperty("--bx", "0deg"); });
    }
  });

  /* ---------- fiabilité : même règle que dans l'appli ---------- */
  var tot = $("tot"), hon = $("hon"), gBar = $("gBar"), gVal = $("gVal"), gSub = $("gSub");
  var C = 578.05, shown = 0, frameId = null;
  function setFill(el) { var max = +el.max || 1; el.style.setProperty("--fill", (el.value / max * 100) + "%"); }
  function update(src) {
    var t = +tot.value, h = +hon.value;
    if (h > t) { if (src === "hon") { t = h; tot.value = t; } else { h = t; hon.value = h; } }
    $("vTot").textContent = t; $("vHon").textContent = h;
    setFill(tot); setFill(hon);
    var p = t > 0 ? Math.min(100, Math.floor(h / t * 100)) : null;
    gBar.style.strokeDashoffset = C * (1 - (p || 0) / 100);
    cancelAnimationFrame(frameId);
    if (p === null) { shown = 0; gVal.textContent = "–"; gVal.className = "new"; gSub.textContent = "pas encore noté"; return; }
    gVal.className = "";
    gSub.textContent = "venu " + h + " fois sur " + t;
    var from = shown, t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var k = reduce ? 1 : Math.min(1, (ts - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      shown = Math.round(from + (p - from) * e);
      gVal.textContent = shown + " %";
      if (k < 1) frameId = requestAnimationFrame(step);
    })(performance.now());
  }
  if (tot && hon) {
    tot.addEventListener("input", function () { update("tot"); });
    hon.addEventListener("input", function () { update("hon"); });
    all(".presets button").forEach(function (b) {
      b.addEventListener("click", function () { tot.value = b.getAttribute("data-t"); hon.value = b.getAttribute("data-h"); update(); });
    });
    update();
  }

  /* ---------- Communauté : comment on rejoint un club (mêmes textes que l'appli) ---------- */
  var modeTxt = $("modeTxt"), modes = all(".modes button");
  modes.forEach(function (b) {
    b.addEventListener("click", function () {
      modes.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
      if (modeTxt) modeTxt.textContent = b.getAttribute("data-t");
    });
  });

  /* ---------- logo final en 3D, avec reflet ---------- */
  var logo = $("logo3d"), tilt = $("logoTilt");
  if (logo && tilt && fine && !reduce) {
    logo.addEventListener("pointermove", function (e) {
      var r = logo.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = "rotateY(" + x * 26 + "deg) rotateX(" + -y * 26 + "deg)";
      tilt.style.setProperty("--gx", (x + 0.5) * 100 + "%"); tilt.style.setProperty("--gy", (y + 0.5) * 100 + "%");
    });
    logo.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
  }
})();
