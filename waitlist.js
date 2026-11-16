/* SPORAMI — liste d'attente (sporami.app/waitlist)
 * Envoie l'adresse à la fonction Firebase « waitlistSubscribe », qui la transmet à Brevo
 * (e-mail de confirmation, double opt-in). Aucune clé ni aucun secret ici.
 * Un message de réussite n'est affiché que si le serveur a vraiment accepté la demande. */
(function () {
  "use strict";

  var ENDPOINT = "https://europe-west1-sporami-65043.cloudfunctions.net/waitlistSubscribe";
  var TIMEOUT_MS = 15000;
  var openedAt = Date.now();

  var join = document.getElementById("join");
  var form = document.getElementById("waitlist");
  var email = document.getElementById("email");
  var adult = document.getElementById("adult");
  var trap = document.getElementById("website");
  var button = document.getElementById("submit");
  var error = document.getElementById("form-error");
  var sent = document.getElementById("sent");
  var sentEmail = document.getElementById("sent-email");
  var done = document.getElementById("done");
  var again = document.getElementById("again");
  if (!form) return;

  // Retour depuis le lien de confirmation (Brevo renvoie ici avec ?confirme=1)
  var params = new URLSearchParams(location.search);
  if (params.get("confirme") === "1") {
    join.setAttribute("data-state", "done");
    document.title = "Bienvenue dans l’aventure SPORAMI !";
    done.focus({ preventScroll: true });
  }

  var MESSAGES = {
    empty_email: "Indique ton adresse e-mail.",
    invalid_email: "Cette adresse e-mail ne semble pas valide.",
    adult_required: "Coche la case pour confirmer que tu as 18 ans ou plus.",
    too_fast: "Une seconde… réessaie dans un instant.",
    rate_limited: "Tu viens déjà de faire une demande. Vérifie ta boîte mail, ou réessaie un peu plus tard.",
    daily_cap: "Beaucoup d’inscriptions aujourd’hui ! Réessaie demain, ta place t’attend.",
    network: "Connexion impossible. Vérifie ta connexion internet et réessaie.",
    server: "Un problème est survenu de notre côté. Réessaie dans quelques minutes."
  };

  function isValidEmail(value) {
    if (!value || value.length > 254) return false;
    var at = value.lastIndexOf("@");
    if (at < 1 || at > 64) return false;
    return /^[^\s@"<>()\[\]\\,;:]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/.test(value);
  }

  function showError(code, field) {
    error.textContent = MESSAGES[code] || MESSAGES.server;
    email.setAttribute("aria-invalid", field === "email" ? "true" : "false");
    adult.setAttribute("aria-invalid", field === "adult" ? "true" : "false");
    if (field === "email") email.focus();
    else if (field === "adult") adult.focus();
  }

  function clearError() {
    error.textContent = "";
    email.removeAttribute("aria-invalid");
    adult.removeAttribute("aria-invalid");
  }

  function setBusy(busy) {
    button.disabled = busy;
    button.setAttribute("aria-busy", busy ? "true" : "false");
    button.querySelector(".label").textContent = busy ? "Envoi en cours…" : "Me prévenir du lancement";
  }

  email.addEventListener("input", function () { if (email.getAttribute("aria-invalid") === "true") clearError(); });
  adult.addEventListener("change", function () { if (adult.getAttribute("aria-invalid") === "true") clearError(); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (button.disabled) return; // pas de double envoi
    clearError();

    var value = email.value.trim();
    if (!value) return showError("empty_email", "email");
    if (!isValidEmail(value)) return showError("invalid_email", "email");
    if (!adult.checked) return showError("adult_required", "adult");

    setBusy(true);
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, TIMEOUT_MS);

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: value, adult: true, website: trap.value, elapsed: Date.now() - openedAt }),
      signal: controller ? controller.signal : undefined,
      credentials: "omit",
      cache: "no-store"
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          return { status: response.status, data: data };
        });
      })
      .then(function (result) {
        if (result.status === 200 && result.data && result.data.ok === true) {
          sentEmail.textContent = value;
          join.setAttribute("data-state", "sent");
          sent.focus();
          return;
        }
        var code = (result.data && result.data.code) || "server";
        showError(code, code === "invalid_email" ? "email" : code === "adult_required" ? "adult" : null);
      })
      .catch(function () { showError("network", null); })
      .then(function () { clearTimeout(timer); setBusy(false); });
  });

  again.addEventListener("click", function () {
    join.removeAttribute("data-state");
    email.value = "";
    email.focus();
  });
})();
