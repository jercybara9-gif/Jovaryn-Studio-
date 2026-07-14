/* ==========================================================================
   JOVARYN STUDIO — i18n-currency.js
   Fichier UNIQUE et autonome (aucune dépendance, aucune API externe) qui :

   1) Ajoute un sélecteur de LANGUE (FR / EN) dans le menu de chaque page
      et traduit réellement le contenu déjà présent sur la page (texte des
      liens, boutons, titres, placeholders...).
   2) Ajoute un sélecteur de DEVISE (EUR / USD / XOF / GBP) et convertit tous
      les montants en euros affichés sur la page, avec des taux FIXES
      (pas d'appel réseau, pas d'API — donc ça fonctionne aussi hors-ligne
      et sur GitHub Pages sans configuration).
   3) Corrige automatiquement, sur TOUTES les pages, les liens WhatsApp avec
      le vrai numéro, et ajoute un contact Messenger (bouton flottant +
      carte de contact) à partir de vos identifiants.

   INSTALLATION (ne nécessite pas de refaire le ZIP) :
   Ajoutez cette seule ligne juste avant la balise </body> de chaque page
   HTML publique (toutes sauf le dossier /dashboard/) :

       <script src="js/i18n-currency.js" defer></script>

   Sur les pages situées à la racine, le chemin est "js/i18n-currency.js".
   (Ce site n'a pas de pages dans des sous-dossiers publics, donc le chemin
   est le même partout.)

   Astuce pour l'ajouter automatiquement à tous les fichiers en une seule
   commande, depuis le dossier du site déjà décompressé :

     macOS / Linux (bash) :
       for f in *.html; do
         grep -q "i18n-currency.js" "$f" || \
         sed -i '' 's#</body>#  <script src="js/i18n-currency.js" defer></script>\n</body>#' "$f" 2>/dev/null || \
         sed -i 's#</body>#  <script src="js/i18n-currency.js" defer></script>\n</body>#' "$f"
       done

     (Ne touchez pas au dossier /dashboard/, ce script est prévu pour le
     site public uniquement.)
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 0. VOS IDENTIFIANTS DE CONTACT — modifiables ici, à un seul endroit *
   * ------------------------------------------------------------------ */
  var WHATSAPP_NUMBER = "2290196883971"; // +229 01 96 88 39 71 (format international sans + ni espaces)
  var WHATSAPP_TEXT = "Bonjour JOVARYN STUDIO, je souhaite discuter d'un projet de site web.";
  // ⚠️ Messenger : "Marshadow Obscuro" est un nom d'affichage, pas un lien.
  // Pour que le bouton Messenger fonctionne, remplacez MESSENGER_USERNAME
  // par votre identifiant exact (Paramètres Facebook → Nom d'utilisateur,
  // visible dans l'URL de votre profil/page, ex. facebook.com/VotreNom).
  var MESSENGER_USERNAME = "MarshadowObscuro";
  var MESSENGER_LABEL = "Marshadow Obscuro";

  /* ------------------------------------------------------------------ *
   * 1. Ne s'exécute que sur le site public (pas sur /dashboard/)        *
   * ------------------------------------------------------------------ */
  if (document.querySelector(".dash-body") || document.body.hasAttribute("data-dash-page") || document.body.hasAttribute("data-login-page")) {
    return;
  }

  var LANG_KEY = "jovaryn_lang";
  var CUR_KEY = "jovaryn_currency";

  /* ------------------------------------------------------------------ *
   * 2. Taux de change FIXES (sans API — à mettre à jour manuellement    *
   *    si besoin). Le taux EUR→XOF est le taux OFFICIEL fixe de la      *
   *    zone Franc CFA (BCEAO), pas une estimation.                      *
   * ------------------------------------------------------------------ */
  var CURRENCIES = {
    EUR: { rate: 1, symbol: "€", position: "after", locale: "fr-FR", label: "€ EUR" },
    USD: { rate: 1.08, symbol: "$", position: "before", locale: "en-US", label: "$ USD" },
    XOF: { rate: 655.957, symbol: "FCFA", position: "after", locale: "fr-FR", label: "FCFA (XOF)" },
    GBP: { rate: 0.84, symbol: "£", position: "before", locale: "en-GB", label: "£ GBP" }
  };

  function formatAmount(amountEUR, code) {
    var c = CURRENCIES[code] || CURRENCIES.EUR;
    var converted = amountEUR * c.rate;
    // pas de centimes pour rester lisible, sauf si le montant est petit
    var decimals = converted < 10 ? 2 : 0;
    var formatted = converted.toLocaleString(c.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return c.position === "before" ? c.symbol + formatted : formatted + " " + c.symbol;
  }

  /* Remplace, dans une chaîne de texte, chaque montant "1 490€" (et les
     plages "1 500 – 3 000€") par sa conversion dans la devise choisie. */
  var RANGE_RE = /(\d[\d\s.,]*)(\s?[–-]\s?)(\d[\d\s.,]*)\s?€/g;
  var SINGLE_RE = /(\d[\d\s.,]*)\s?€/g;

  function parseNum(str) {
    return parseFloat(str.replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", "."));
  }

  function convertPriceText(text, code) {
    if (code === "EUR") return text; // rien à faire, texte déjà en euros
    var out = text.replace(RANGE_RE, function (m, a, sep, b) {
      return formatAmount(parseNum(a), code) + " – " + formatAmount(parseNum(b), code);
    });
    out = out.replace(SINGLE_RE, function (m, a) {
      return formatAmount(parseNum(a), code);
    });
    return out;
  }

  /* ------------------------------------------------------------------ *
   * 3. Dictionnaire de traduction FR → EN                               *
   *    Basé sur le texte EXACT tel qu'affiché sur le site (français).   *
   *    Pour couvrir davantage de pages (articles de blog, FAQ, mentions *
   *    légales...), ajoutez simplement de nouvelles paires ici :        *
   *      "Texte français exact": "English text"                        *
   * ------------------------------------------------------------------ */
  var DICT_EN = {
    // Navigation
    "Accueil": "Home", "À propos": "About", "Services": "Services", "Portfolio": "Portfolio",
    "Démos": "Demos", "Tarifs": "Pricing", "Avis": "Reviews", "FAQ": "FAQ", "Blog": "Blog",
    "Contact": "Contact", "Demander un devis": "Get a quote", "Prendre RDV": "Book a call",
    "Devis gratuit": "Free quote", "Aller au contenu": "Skip to content",

    // Boutons / CTA communs
    "Demander un devis gratuit": "Request a free quote", "Voir nos réalisations": "See our work",
    "Voir le portfolio": "View portfolio", "Voir tout le portfolio": "View full portfolio",
    "Voir des démos live": "See live demos", "Voir nos services": "See our services",
    "Voir les tarifs": "See pricing", "Nous écrire": "Write to us", "Nous contacter": "Contact us",
    "Prendre rendez-vous": "Book an appointment", "Envoyer le message": "Send message",
    "Envoyer ma demande de devis": "Send my quote request",
    "Confirmer ma demande de rendez-vous": "Confirm my appointment request",
    "Suivre ma commande": "Track my order", "Réessayer": "Try again",
    "Retour à l'accueil": "Back to home", "Nous signaler le problème": "Report the issue",
    "Ouvrir WhatsApp": "Open WhatsApp", "Tester le suivi de commande": "Try order tracking",
    "Voir un exemple de suivi": "See a tracking example",

    // Section eyebrows / labels récurrents
    "Studio de création web premium": "Premium web design studio",
    "Prêt à démarrer ?": "Ready to start?", "Réalisations": "Our work",
    "Témoignages": "Testimonials", "Notre méthode": "Our process",
    "Pourquoi JOVARYN STUDIO": "Why JOVARYN STUDIO", "Ce que nous faisons": "What we do",
    "Nos réalisations": "Our work", "Notre mission": "Our mission", "Nos valeurs": "Our values",
    "L'équipe": "Our team", "Notre histoire": "Our story", "Questions fréquentes": "Frequently asked questions",
    "Étape 01": "Step 01", "Étape 02": "Step 02", "Étape 03": "Step 03", "Étape 04": "Step 04",
    "La parole à nos clients": "In our clients' words", "Ressources": "Resources",
    "Ce que vous devez savoir avant de vous lancer": "Everything you need to know before you start",
    "Tout ce que vous devez savoir avant de vous lancer": "Everything you need to know before you start",
    "Parlons-en": "Let's talk", "Étape 1/1 — 2 minutes": "Step 1/1 — 2 minutes",
    "Appel découverte gratuit — 30 min": "Free discovery call — 30 min",
    "Espace client": "Client area", "Des offres claires": "Clear pricing",

    // Accueil
    "Ils ont confié leur image de marque à JOVARYN STUDIO": "They trusted JOVARYN STUDIO with their brand",
    "Des sites web qui donnent envie de ": "Websites that make people want to ",
    "vous faire confiance.": "trust you.",
    "JOVARYN STUDIO conçoit des sites vitrines, boutiques en ligne et plateformes sur-mesure pour les entreprises qui veulent marquer les esprits dès la première visite : rapides, élégants, pensés pour convertir.":
      "JOVARYN STUDIO designs showcase websites, online stores and custom platforms for businesses that want to make an impression from the very first visit: fast, elegant, and built to convert.",
    "Sites livrés": "Sites delivered", "Clients satisfaits": "Happy clients",
    "Délai de première maquette": "First draft turnaround", "Note moyenne": "Average rating",
    "Un site premium n'est pas une dépense. C'est votre meilleur commercial.": "A premium website isn't an expense. It's your best salesperson.",
    "De l'idée à la mise en ligne, en 4 étapes claires": "From idea to launch, in 4 clear steps",
    "Un aperçu de nos derniers projets": "A look at our latest projects",
    "Ce que nos clients disent de nous": "What our clients say about us",
    "Discutons de votre projet dès aujourd'hui": "Let's talk about your project today",
    "Recevez une proposition détaillée sous 48h, sans engagement.": "Receive a detailed proposal within 48h, with no obligation.",
    "Rapide, vraiment": "Genuinely fast", "Design haut de gamme": "Premium design",
    "Pensé pour convertir": "Built to convert", "SEO & visibilité": "SEO & visibility",
    "Accessible & responsive": "Accessible & responsive", "Suivi transparent": "Transparent tracking",
    "Découverte": "Discovery", "Design": "Design", "Développement": "Development", "Mise en ligne": "Launch",

    // Tarifs
    "Un tarif adapté à chaque étape de votre croissance": "A price that fits every stage of your growth",
    "Essentiel": "Essential", "Vitrine": "Showcase", "Croissance": "Growth", "Signature": "Signature",
    "Sur-mesure": "Custom", "Populaire": "Popular", "Le plus choisi": "Most chosen",
    "Sur devis": "Custom quote", "Projet unique": "One-time project", "Projet complexe": "Complex project",
    "Choisir Essentiel": "Choose Essential", "Choisir Croissance": "Choose Growth",
    "Comparatif": "Comparison", "Que contient chaque forfait ?": "What's included in each plan?",
    "Pas sûr du forfait idéal ?": "Not sure which plan is right for you?",
    "Décrivez votre projet, nous vous recommandons l'offre la plus pertinente — sans pression commerciale.":
      "Describe your project and we'll recommend the most relevant plan — no sales pressure.",

    // Contact / Devis / RDV / Suivi
    "Une question ? Un projet ? Écrivez-nous": "A question? A project? Write to us",
    "Nom complet": "Full name", "E-mail": "Email", "Téléphone": "Phone",
    "Sujet": "Subject", "Message": "Message", "Entreprise": "Company",
    "Recevez une proposition sur-mesure sous 48h": "Get a custom proposal within 48h",
    "Décrivez votre projet": "Describe your project", "Budget indicatif": "Estimated budget",
    "Type de projet": "Project type", "Site vitrine": "Showcase website", "E-commerce": "E-commerce",
    "Plateforme sur-mesure": "Custom platform", "Refonte de site existant": "Redesign of an existing site",
    "Réservez un créneau avec notre équipe": "Book a slot with our team",
    "Choisissez un jour": "Choose a day", "Choisissez un créneau": "Choose a time slot",
    "Aucun créneau sélectionné pour l'instant.": "No time slot selected yet.",
    "Suivez l'avancement de votre projet": "Track your project's progress",
    "Numéro de commande": "Order number", "Commande": "Order", "Client": "Client",
    "Montant": "Amount", "Livraison prévue": "Expected delivery",
    "En attente": "Pending", "En production": "In production", "En révision": "In review", "Livrée": "Delivered",

    // Footer
    "Studio de création de sites web premium. Nous concevons des expériences digitales rapides, élégantes et pensées pour convertir vos visiteurs en clients.":
      "Premium web design studio. We craft fast, elegant digital experiences designed to convert your visitors into customers.",
    "Nos services": "Our services", "Démonstrations": "Demos", "Suivi de commande": "Order tracking",
    "Mentions légales": "Legal notice", "Confidentialité": "Privacy", "CGV": "Terms of sale",
    " JOVARYN STUDIO. Tous droits réservés.": " JOVARYN STUDIO. All rights reserved.",

    // Placeholders (attribut placeholder, traduits séparément)
    "__PLACEHOLDER__Rechercher une question...": "Search a question...",
    "__PLACEHOLDER__Votre secteur, vos objectifs, vos délais souhaités...": "Your industry, goals, and desired timeline...",
    "__PLACEHOLDER__Ex. Refonte de mon site actuel": "E.g. Redesign of my current site",
    "__PLACEHOLDER__Ex. CMD-1042": "E.g. CMD-1042",
    "__PLACEHOLDER__••••••••": "••••••••"
  };

  /* ------------------------------------------------------------------ *
   * 4. Traduction du DOM : on scanne une seule fois les nœuds de texte  *
   *    et on garde le texte français original pour pouvoir revenir en  *
   *    arrière sans jamais perdre le contenu source.                    *
   * ------------------------------------------------------------------ */
  var textNodes = [];   // { node, original }
  var placeholderEls = []; // { el, original }
  var priceNodes = [];  // { node, original } — sous-ensemble contenant un montant en €

  function collectNodes() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      textNodes.push({ node: n, original: n.nodeValue });
      if (/\d[\d\s.,]*\s?€/.test(n.nodeValue)) {
        priceNodes.push({ node: n, original: n.nodeValue });
      }
    }
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      placeholderEls.push({ el: el, original: el.getAttribute("placeholder") });
    });
  }

  function applyLanguage(lang) {
    textNodes.forEach(function (item) {
      var trimmed = item.original.trim();
      if (lang === "en" && DICT_EN[trimmed]) {
        item.node.nodeValue = item.node.nodeValue.replace(trimmed, DICT_EN[trimmed]);
      } else {
        item.node.nodeValue = item.original;
      }
    });
    placeholderEls.forEach(function (item) {
      var key = "__PLACEHOLDER__" + item.original;
      if (lang === "en" && DICT_EN[key]) {
        item.el.setAttribute("placeholder", DICT_EN[key]);
      } else {
        item.el.setAttribute("placeholder", item.original);
      }
    });
    document.documentElement.lang = lang;
    // ré-applique la devise par-dessus (les nœuds de prix viennent d'être
    // remis à leur texte français d'origine ci-dessus)
    applyCurrency(getSavedCurrency(), true);
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll(".lcs-lang-btn").forEach(function (b) {
      var active = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function applyCurrency(code, skipSave) {
    priceNodes.forEach(function (item) {
      item.node.nodeValue = convertPriceText(item.original, code);
    });
    if (!skipSave) localStorage.setItem(CUR_KEY, code);
    document.querySelectorAll(".lcs-currency").forEach(function (sel) { sel.value = code; });
  }

  function getSavedLang() { return localStorage.getItem(LANG_KEY) || "fr"; }
  function getSavedCurrency() { return localStorage.getItem(CUR_KEY) || "EUR"; }

  /* ------------------------------------------------------------------ *
   * 5. Widget d'interface (langue + devise), injecté en CSS + HTML,     *
   *    aucune modification des fichiers CSS/HTML existants requise.     *
   * ------------------------------------------------------------------ */
  function injectStyle() {
    var css = "" +
      ".lang-cur-switcher{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:6px}" +
      ".lcs-lang-group{display:inline-flex;border:1px solid rgba(0,212,255,.4);border-radius:999px;overflow:hidden}" +
      ".lcs-lang-btn{background:transparent;border:none;color:#8b93a7;font-family:'JetBrains Mono',monospace;font-size:.72rem;font-weight:600;padding:6px 12px;cursor:pointer;letter-spacing:.04em}" +
      ".lcs-lang-btn.active{background:linear-gradient(135deg,#0080ff,#00d4ff);color:#020409}" +
      ".lcs-currency{background:rgba(255,255,255,.03);border:1px solid rgba(0,212,255,.4);border-radius:999px;color:#f5f7fa;font-size:.75rem;padding:7px 12px;font-family:'JetBrains Mono',monospace;cursor:pointer}" +
      ".lcs-currency:focus,.lcs-lang-btn:focus-visible{outline:2px solid #00d4ff;outline-offset:2px}" +
      "@media (min-width:981px){.nav-links .lang-cur-switcher{order:-1;margin-right:6px;margin-bottom:0;padding:0}}" +
      ".fb-float{position:fixed;right:24px;bottom:92px;z-index:150;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px -6px rgba(0,110,255,.6)}";
    var style = document.createElement("style");
    style.setAttribute("data-jovaryn-i18n", "");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildWidget() {
    var container = document.querySelector(".nav-links");
    if (!container) return;
    var wrap = document.createElement("div");
    wrap.className = "lang-cur-switcher";
    wrap.innerHTML =
      '<div class="lcs-lang-group" role="group" aria-label="Langue">' +
      '<button type="button" class="lcs-lang-btn" data-lang="fr" aria-pressed="true">FR</button>' +
      '<button type="button" class="lcs-lang-btn" data-lang="en" aria-pressed="false">EN</button>' +
      "</div>" +
      '<select class="lcs-currency" aria-label="Devise">' +
      '<option value="EUR">€ EUR</option>' +
      '<option value="USD">$ USD</option>' +
      '<option value="XOF">FCFA (XOF)</option>' +
      '<option value="GBP">£ GBP</option>' +
      "</select>";
    container.insertBefore(wrap, container.firstChild);

    wrap.querySelectorAll(".lcs-lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLanguage(btn.getAttribute("data-lang")); });
    });
    wrap.querySelector(".lcs-currency").addEventListener("change", function () {
      applyCurrency(this.value);
    });
  }

  /* ------------------------------------------------------------------ *
   * 6. Correction des identifiants de contact (WhatsApp + Messenger)    *
   * ------------------------------------------------------------------ */
  function messengerIconSVG() {
    return '<svg viewBox="0 0 24 24" width="26" height="26" fill="#020409"><path d="M12 2C6.48 2 2 6.13 2 11.5c0 3.06 1.5 5.78 3.85 7.55V22l3.52-1.93c.84.23 1.72.36 2.63.36 5.52 0 10-4.13 10-9.5S17.52 2 12 2zm1.02 12.8-2.55-2.72-4.98 2.72 5.48-5.82 2.61 2.72 4.9-2.72-5.46 5.82z"/></svg>';
  }

  function fixContacts() {
    var waLink = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_TEXT);
    var msgLink = "https://m.me/" + MESSENGER_USERNAME;

    // 1) tous les liens WhatsApp existants -> vrai numéro
    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      a.setAttribute("href", waLink);
    });

    // 2) bouton flottant Messenger, ajouté à côté du bouton WhatsApp
    var waFloat = document.querySelector(".wa-float");
    if (waFloat && !document.querySelector(".fb-float")) {
      var fbFloat = document.createElement("a");
      fbFloat.className = "fb-float";
      fbFloat.href = msgLink;
      fbFloat.target = "_blank";
      fbFloat.rel = "noopener";
      fbFloat.setAttribute("aria-label", "Contacter " + MESSENGER_LABEL + " sur Messenger");
      fbFloat.style.background = "linear-gradient(135deg,#00b2ff,#0064e0)";
      fbFloat.innerHTML = messengerIconSVG();
      waFloat.insertAdjacentElement("afterend", fbFloat);
    }

    // 3) sur la page Contact : duplique la carte WhatsApp en carte Messenger
    document.querySelectorAll('a[href="' + waLink + '"]').forEach(function (a) {
      var card = a.closest(".glass.card");
      if (!card || card.dataset.msgCloned) return;
      var clone = card.cloneNode(true);
      var link = clone.querySelector("a");
      var icon = clone.querySelector(".icon");
      var h3 = clone.querySelector("h3");
      var p = clone.querySelector("p");
      if (link) { link.href = msgLink; link.target = "_blank"; link.rel = "noopener"; link.textContent = "Ouvrir Messenger"; }
      if (icon) icon.textContent = "✆";
      if (h3) h3.textContent = "Messenger";
      if (p) p.textContent = "Écrivez-nous directement à " + MESSENGER_LABEL + " sur Messenger.";
      card.insertAdjacentElement("afterend", clone);
      card.dataset.msgCloned = "1";
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. Initialisation                                                    *
   * ------------------------------------------------------------------ */
  function init() {
    injectStyle();
    buildWidget();
    fixContacts();
    collectNodes();
    applyLanguage(getSavedLang());
    applyCurrency(getSavedCurrency());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
