# SoleF63 : mémoire de projet pour Claude Code

Appli web (PWA) pour créer, enregistrer et lancer des programmes de marche/course en 18 paliers sur le tapis **Sole F63** de Samuel. Dépôt public `masuel254/SoleF63`, publié par GitHub Pages depuis `main` : https://masuel254.github.io/SoleF63/

## 1. Instructions d'origine du projet (verbatim)

> Avoir une appli lien web github qui me permet de creer des modeles de marche/course sur mon tapis de course Sole F63, en partant du fichier excel joint.
> il y a systematiquement 18 segments qui repesentent une duree identique qui correspond a 1/18 du temps total definit.
> le temps total definit est une variable que la personne peut choisiR. idem comme le poids.
> dans chaque cegment il existe egalement une varibale qui est l'inclinaison et la vitesse.
> a partir de la, il faut ensuite calculer la distance de chaque segment et la distance cumulée; ainsi que les kcal depensées et les kcal cumulées.
> il doit etre possible d'enregistrer plusieurs programme et chaque programme enregistrés on doit lui donner un nom.
> pour chaque programme il doit y avoir agelement un petit graphique genre histogramme qui correspond a vitesse de chaque segment et une courbe en parallele qui correspond a la pente

## 2. Fichier de référence : TradeMil.xlsx

Non versionné (fichier personnel, dépôt public). Feuille `TradeMill`, A1:I24 :
- C1 = temps total (min), F1 = poids (kg).
- Ligne 3 : Segment, Durée par segment, Temps cumulé, Pente, Vitesse km/h, Distance (km), Distance cumul, Kcal, Kcal cumul.
- Lignes 4 à 21 : les 18 paliers. Formules :

```
durée palier (min)  = T / 18
distance (km)       = v × (T/18) / 60
kcal                = (0,1 × vm + 1,8 × vm × pente/100 + 3,5) × poids / 200 × (T/18)    avec vm = v × 1000 / 60 (m/min)
cumuls              = sommes successives
```
Équation ACSM de la marche, fiable jusqu'à 6-7 km/h ; sous-estime en course. L'appli (`compute()`) reproduit exactement ces formules : ne pas les changer.

## 3. Travailler avec Samuel

- Réponses directes, honnêtes, sans complaisance ; le contredire quand il se trompe ; signaler clairement une mauvaise idée.
- Français, concis, pas de tirets cadratins ni de tics d'IA.
- Il travaille surtout depuis son **iPhone** (navigateur **Bluefy** pour le Bluetooth). Écrans testés en 390 × 844.
- Il veut que Claude **déploie lui-même** (commit + push sur `main`) quand il le demande (« pousse »). Ne lui renvoyer que les fichiers modifiés, jamais tout un zip.
- Proposer une maquette avant un gros changement d'UX quand il le demande ; pour une petite demande, coder directement.
- Il gère lui-même la suppression de ses programmes : ne jamais effacer ses données par migration.

## 4. Architecture

- `index.html` : toute l'appli (HTML, CSS, JS inline, ~1800 lignes, IIFE). Aucune dépendance externe hormis Google Fonts.
- `sw.js` : service worker. `const VERSION = 'AAAA-MM-JJ HH:MM'` (heure de Paris) ; le cache en dérive. Navigation network-first (`cache: 'no-cache'`), le reste cache-first.
- `manifest.webmanifest`, `icons/` : PWA installable.
- `README.md` : doc utilisateur (onglets, formules, Bluetooth, mise à jour). La tenir à jour à chaque fonction.

Coquille fixe : `html/body` en `overflow:hidden`, seule `.scroll` défile, champs en 16 px minimum (pas de zoom iOS). Thème clair/sombre par variables CSS (`--speed` bleu = vitesse, `--grade` orange = pente).

### Données (localStorage, préfixe `KEY = 'solef63.programs.v1'`)
- `KEY` : tableau des programmes `{ id, name, minutes, segs:[{v,p}×18], origin:'auto'|..., updated, rating? }`.
- `KEY.settings` : `{ weight, walkMax:5.8, runMax:11, beep, voice, voiceMode:'auto'|'all', sound, drive, speedManualFor }`.
- `KEY.auto` : préférences de l'écran Créer (dont `f63`, `v63w`, `v63r`).
- `KEY.last` : id du dernier programme lancé.
- `KEY.hist` : historique des séances terminées `{ id, pid, name, minutes, kcal, dist, start, end, rating }` (plus récente en premier).
- `KEY.seed-hist1` : drapeau de la reprise unique de la séance du 14/10/2026 07:30-08:00 (30 min, 297 kcal, 5 étoiles).
- Export/import JSON : `{ app, version:2, settings, programs, history }` (Bluefy et Safari ont des stockages séparés).

### Limites
`VMIN 0,8`, `VMAX 18` km/h, `PMIN 0`, `PMAX 15` % (pente max du F63). Création auto plafonnée par `walkMax` / `runMax` (Réglages).

## 5. Fonctions en place (état au 15/10/2026, page v12)

Quatre onglets : **Programmes**, **Créer**, **Séance**, **Réglages**.

- **Programmes** : tuiles 2 colonnes ; puces de durée pour filtrer ; tri par durée croissante puis **kcal croissantes** puis nom. Tuile : durée, kcal, km, nom court (`shortName`), étoiles (grises « à noter » si non noté), profil, Vmoy/Pmoy. Appui long → Lancer, Ouvrir, Renommer, Dupliquer, Supprimer (Annuler 5 s). Bouton « Tout effacer » (ou « Effacer les N programmes de X min » si filtre), confirmation + Annuler 5 s.
- **Créer** : automatique (durée, kcal visées, marche/course, forme intervalles/pyramide/régulier, bissection sur `k` dans `generateAuto`) ou manuel. Case **Spécial F63** (cochée par défaut) : `buildF63`, vitesse choisie (+/− 0,1, mémorisée par type, plafonnée au max du type) sur les paliers 2 à 17, 1er et dernier à 75 %, seule la pente varie pour atteindre les kcal. Décochée : `buildAuto` (vitesse puis pente).
- **Fiche / édition** : + / − par palier (pente 1 %, vitesse 0,1), graphique histogramme vitesse + courbe pente (`profileSvg`), totaux.
- **Séance** (plein écran) : décompte par palier, consignes, bips (15 sons, défaut « bip doux » volume 100) et voix (Coupée / Auto / Toujours ; Auto = parle seulement au départ et quand la vitesse change), Wake Lock, bilan de fin avec **note 1 à 5 étoiles** (préremplie avec la dernière note, modifiable). Onglet Séance : programme courant + **historique** des séances terminées (date, heures, durée, kcal, programme, étoiles, total).
- **Réglages** : poids, vitesses max marche/course, sons, export/import, Bluetooth, rubrique Application avec bouton **Rechercher** une mise à jour, version affichée « Version du … · page vX ».

### Pilotage Bluetooth (FTMS)
Service 0x1826 ; Treadmill Data 0x2ACD ; Control Point 0x2AD9 (`00` contrôle, `07` start, `02` vitesse 0,01 km/h, `03` pente 0,1 %, `08 02` pause, `08 01` stop) ; Status 0x2ADA. UUID en 128 bits texte (Bluefy l'exige). Constat réel sur le F63 : **la pente est acceptée, la vitesse est refusée** (code résultat 5) → mode mixte : pente pilotée, vitesse guidée à l'écran (« ▲ Accélérez : 1,0 → 4,2 ») d'après la vitesse réelle ; refus mémorisé (`speedManualFor`), lien « Retester ». Safari iOS n'a pas Web Bluetooth : Bluefy obligatoire. Une seule appli connectée à la fois (fermer Kinomap).

## 6. Procédure de déploiement (à suivre à chaque envoi)

1. Incrémenter `PAGE_BUILD` dans `index.html` (v12 → v13…).
2. Dater `sw.js` : `V=$(TZ=Europe/Paris date +'%Y-%m-%d %H:%M') && sed -i "s/^const VERSION = '.*';/const VERSION = '$V';/" sw.js`
3. Mettre à jour `README.md`.
4. Commit (message en français) puis `git push origin HEAD:main`.
5. Attendre 2 à 3 min et vérifier que https://masuel254.github.io/SoleF63/sw.js porte la nouvelle date.
6. Dire à Samuel : Réglages → Rechercher (ou recharger la page dans Bluefy) et vérifier « page vX ».

Tests : serveur local `python3 -m http.server 8766`, Playwright (Chromium, viewport 390×844, `timezoneId: 'Europe/Paris'`, `page.clock` pour accélérer une séance), injection de programmes via `localStorage`, captures pour contrôle visuel. Ne pas faire `pkill` dans la même commande que le push.

## 7. Décisions et historique

- Plus aucun programme prédéfini : la liste ne contient que les programmes de Samuel (les anciens prédéfinis intacts ont été effacés une fois par migration, les modifiés conservés).
- Liste en tuiles (variante B préférée à l'accordéon), filtrage par durée.
- Poids unique pour tous les programmes (Réglages).
- Mise à jour automatique au lancement + bouton Rechercher ; rechargement différé si séance ou édition en cours.
- Spécial F63 créé parce que le tapis refuse le pilotage de la vitesse.

## 8. Sujets ouverts

- **Strava** : envoi direct prévu via un webhook n8n sur le VPS de Samuel (bouton en fin de séance, à sa main, pentes dans la description). **Bloqué** : depuis le 01/06/2026, Strava exige un abonnement payant pour créer une application API ; Samuel a un compte gratuit. Option 1 (saisie manuelle) et option 2 (fichier .tcx importé sur le site) écartées par lui. Ne pas coder sans son feu vert.
- **Kinomap** (Samuel est abonné ; Kinomap synchronise déjà vers Strava ; il n'utilise pas les deux applis en même temps) : pas d'import de programmes ni d'API publique. Piste : créateur d'entraînements structurés sur creator.kinomap.com/workout (une valeur par palier, mode pente, entraînements publics) pour y recopier les programmes Spécial F63. En attente : Samuel doit vérifier si « Entraînement structuré » existe pour le tapis dans Kinomap. Idée si oui : bloc « Pour Kinomap » dans la fiche (vitesse à régler + 18 lignes durée/pente).
