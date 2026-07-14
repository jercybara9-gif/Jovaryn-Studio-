# JOVARYN STUDIO — Site officiel

Site vitrine premium + tableau de bord de gestion, prêt pour GitHub Pages.
Aucun framework, aucune étape de build : uniquement du HTML / CSS / JavaScript
statique, compatible avec n'importe quel hébergement statique.

## 1. Publier le site sur GitHub Pages

1. Créez un nouveau dépôt GitHub (ex. `jovaryn-studio`).
2. Décompressez ce ZIP et poussez **tout le contenu du dossier `site/`** à la
   racine du dépôt (le fichier `index.html` doit être directement à la racine,
   pas dans un sous-dossier).
   ```bash
   git init
   git add .
   git commit -m "Site JOVARYN STUDIO"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/jovaryn-studio.git
   git push -u origin main
   ```
3. Dans le dépôt GitHub : **Settings → Pages → Source → Deploy from a branch**,
   choisissez la branche `main` et le dossier `/ (root)`, puis **Save**.
4. Votre site sera en ligne à l'adresse
   `https://VOTRE-COMPTE.github.io/jovaryn-studio/` après quelques minutes.
5. Le fichier `.nojekyll` est déjà présent : il empêche GitHub Pages de
   traiter le site avec Jekyll (indispensable, sinon certains fichiers/dossiers
   peuvent être ignorés).

### Nom de domaine personnalisé (optionnel)
Si vous connectez un domaine personnalisé (ex. `jovarynstudio.com`) :
- ajoutez un fichier `CNAME` à la racine contenant votre domaine,
- mettez à jour les URLs `https://jovarynstudio.com/...` dans
  `sitemap.xml`, `robots.txt` et les balises `<meta>` des pages si votre
  domaine final est différent.

## 2. Personnalisations indispensables avant mise en ligne

Recherchez ces éléments et remplacez-les par vos vraies informations :

| Élément | Où le trouver | Fichier(s) |
|---|---|---|
| Numéro WhatsApp | `WHATSAPP_NUMBER` / `STUDIO_WHATSAPP` | `js/forms.js`, pages générées (bouton flottant + page contact) |
| E-mail de contact | `contact@jovarynstudio.com` | toutes les pages (footer, contact, devis) |
| Téléphone | `+33 6 00 00 00 00` | footer, page contact |
| Code d'accès au tableau de bord | `PASSCODE` | `js/dashboard.js` |
| SIRET / forme juridique / adresse | mentions légales | `mentions-legales.html` |
| Réseaux sociaux | liens `instagram.com`, `linkedin.com`, `behance.net` | footer de chaque page |

## 3. Recevoir les messages des formulaires par e-mail

GitHub Pages est un hébergement **statique** : il n'y a pas de serveur pour
envoyer des e-mails. Le site enregistre déjà chaque demande localement (visible
dans le tableau de bord) et propose des liens WhatsApp / e-mail pré-remplis en
secours. Pour recevoir automatiquement un e-mail à chaque soumission :

1. Créez un compte gratuit sur [Formspree](https://formspree.io) (ou Getform,
   Basin, etc.).
2. Créez un formulaire et copiez son endpoint (`https://formspree.io/f/xxxxxxx`).
3. Ouvrez `js/forms.js` et renseignez la constante `FORMSPREE_ENDPOINT` avec
   cette URL.
4. C'est tout : les formulaires Contact, Devis et Rendez-vous enverront alors
   un e-mail réel à chaque envoi, en plus de l'enregistrement local.

## 4. Le tableau de bord (`/dashboard/`)

Le tableau de bord permet de gérer prospects, clients, commandes, projets,
paiements, revenus, messages, notifications et statistiques. Il inclut aussi
une fiche client détaillée avec export **JSON** et **Markdown**.

**Fonctionnement technique :** toutes les données sont stockées dans le
`localStorage` du navigateur (aucune base de données externe). C'est
volontaire pour rester 100% compatible avec GitHub Pages, mais cela implique :

- Les données sont propres à **chaque navigateur / appareil** — elles ne se
  synchronisent pas automatiquement entre votre ordinateur et votre téléphone.
- Utilisez le bouton **« Exporter toutes les données (JSON) »** (page
  Statistiques du tableau de bord) régulièrement pour sauvegarder vos données,
  et **« Importer un fichier JSON »** pour les recharger sur un autre appareil.
- Les nouvelles demandes de devis, contact et rendez-vous envoyées depuis le
  site public alimentent automatiquement les prospects, messages et
  notifications visibles dans le tableau de bord — sur le même navigateur.

**⚠️ À propos de la sécurité du tableau de bord :** le code d'accès
(`login.html`) est un simple verrou côté client destiné à éviter les accès
accidentels, **pas une sécurité réelle** (le code est visible dans le code
source `js/dashboard.js`). Pour une vraie protection en production, plusieurs
options :
- restreindre l'accès à l'URL `/dashboard/` via un service comme Cloudflare
  Access ou une authentification au niveau de votre hébergeur,
- migrer les données vers un vrai backend (Firebase, Supabase, Airtable...)
  avec une authentification serveur,
- ne jamais partager publiquement le lien vers `/dashboard/` et changer le
  code d'accès par défaut.

Pour changer le code d'accès (par défaut `jovaryn2026`) : ouvrez
`js/dashboard.js` et modifiez la constante `PASSCODE`.

## 5. Structure du projet

```
index.html                  Accueil
a-propos.html                À propos
services.html                 Services
portfolio.html                 Portfolio (avec filtres)
demonstrations.html              Démonstrations interactives
tarifs.html                        Tarifs
temoignages.html                     Témoignages
faq.html                               FAQ (avec recherche)
blog.html + blog-*.html                  Blog (5 articles inclus)
contact.html                               Formulaire de contact
devis.html                                   Demande de devis
rendez-vous.html                               Prise de rendez-vous
suivi-commande.html                              Suivi de commande (essayez CMD-1042)
mentions-legales.html / politique-confidentialite.html / cgv.html
404.html / offline.html                              Pages d'erreur & PWA
dashboard/                                             Tableau de bord (protégé par code)
  ├─ index.html            Vue d'ensemble (KPI, graphique revenus)
  ├─ prospects.html        Gestion des prospects
  ├─ clients.html          Gestion des clients
  ├─ fiche-client.html     Fiche client détaillée + export JSON/Markdown
  ├─ commandes.html        Suivi des commandes
  ├─ projets.html          Suivi des projets
  ├─ paiements.html        Paiements
  ├─ revenus.html          Revenus & répartition
  ├─ statistiques.html     Statistiques + import/export/reset des données
  ├─ messages.html         Messagerie
  ├─ notifications.html    Notifications
  └─ login.html            Écran de connexion
css/style.css                Design system du site public
css/dashboard.css              Design system du tableau de bord
js/main.js                       Navigation, animations, FAQ, filtres
js/forms.js                        Validation & envoi des formulaires
js/data.js                           Couche de données (localStorage)
js/export.js                           Export JSON / Markdown
js/dashboard.js                          Logique du tableau de bord
assets/                                     Logo, icônes PWA, visuels portfolio/blog
manifest.json, service-worker.js               PWA (installation, mode hors-ligne)
robots.txt, sitemap.xml                          SEO technique
```

## 6. Checklist qualité déjà appliquée

- ✅ Responsive (mobile / tablette / desktop)
- ✅ Menu mobile accessible au clavier, lien d'évitement (« Aller au contenu »)
- ✅ `prefers-reduced-motion` respecté (animations désactivées si demandé)
- ✅ Contraste texte/fond conforme à un thème sombre premium
- ✅ Balises meta SEO (title, description, Open Graph, Twitter Card, JSON-LD
  sur l'accueil), `sitemap.xml` et `robots.txt`
- ✅ PWA installable (`manifest.json` + `service-worker.js` + page hors-ligne)
- ✅ Formulaires validés côté client, avec retours d'erreur explicites
- ✅ Page 404 personnalisée
- ✅ Tableau de bord entièrement fonctionnel avec données de démonstration

## 7. Tester en local avant publication

Comme le site utilise `fetch()` pour le service worker, ouvrez-le via un
petit serveur local plutôt qu'en double-cliquant sur les fichiers :

```bash
cd site
python3 -m http.server 8080
# puis ouvrez http://localhost:8080 dans votre navigateur
```

---
Studio : **JOVARYN STUDIO** — Création · Innovation · Impact
