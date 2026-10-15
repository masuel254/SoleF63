# SoleF63 : historique des échanges (09 au 15/10/2026)

Résumé chronologique des demandes de Samuel, des réponses et décisions, et du travail livré. Complète `CLAUDE.md` (état technique actuel). Les demandes sont citées ou résumées au plus près de ses mots.

## Phase 1 : maquette et premières fonctions (09/10)

| Demande de Samuel | Réponse / décision | Livré |
|---|---|---|
| « Montre-moi une maquette, fais quelque chose de très pro, très APP et UX » | Maquette mobile à partir de l'Excel TradeMil | Maquette |
| 3 ou 4 programmes préenregistrés de plus (marche) ; + / − sur pente et vitesse de chaque palier | Accepté | Maquette v2 |
| Enlever les numéros de segment (« aucun intérêt »), afficher la durée cumulée, idem sur le graphique | Accepté | Maquette v3 |
| Temps total réglable de 1 min en 1 min | Accepté | |
| 3 programmes prédéfinis de plus, dont un de 60 min | Accepté (10 prédéfinis au total) | |
| « OK vas-y code » | Appli PWA complète (index.html + sw.js + manifest + icônes) | Zip |
| Création automatique : durée + kcal visées + marche/course ; vitesse max 5,8 en marche, 11 en course | Bissection sur un paramètre d'intensité | Fonction Créer auto |
| Pente max du tapis = 15 % ; 3 bips avant chaque changement de palier | Accepté | |
| Mise à jour automatique en changeant la date dans sw.js, version affichée en petit | `VERSION` daté dans sw.js, affichage « Version du … » | |
| Sons plus forts : proposer et faire écouter des échantillons | Page d'écoute de sons | Choix : **bip doux, volume 100** |
| Deux boutons en séance : Voix et Bip | Boutons indépendants | |
| « Si un ou deux fichiers changent, inutile de me redonner tout le zip » | Règle adoptée | |
| « Vas-y, fais le déploiement à ma place » | Samuel donne à Claude l'accès GitHub à tous ses dépôts | Push direct sur `main` |

## Phase 2 : refonte UX (09-10/10)

| Demande | Décision | Livré |
|---|---|---|
| « D'un point de vue UX c'est pas top… créer des onglets ? Fais une maquette » | Maquette 4 onglets : Programmes, Créer, Séance, Réglages | Refonte codée après « OK vas-y code » |
| Vitesse max marche et course comme réglages (servent à la création auto) | Dans Réglages | |
| Supprimer un programme en glissant à gauche ; trier par durée du plus court au plus long | Accepté | |
| Vmoy et Pmoy sur les programmes ; poids unique dans Réglages ; bibliothèque de 15 sons de bips | Accepté | |
| Programmes auto aussi triés par durée ; Vmoy/Pmoy sur le 1er onglet | Accepté | |
| « Enlève les programmes prédéfinis » | Liste = uniquement ses programmes ; prédéfinis intacts effacés une fois, modifiés conservés | |
| « Quand il y en a beaucoup c'est un foutoir », 2 maquettes de classement | A = accordéon, B = tuiles + puces de durée | **Choix : B (tuiles)** ; appui long = menu |

## Phase 3 : pilotage Bluetooth du tapis (10/10)

- Question : l'appli peut-elle piloter le F63 ? Réponse : oui via le protocole FTMS si le tapis l'accepte ; Samuel confirme que **Kinomap pilote son tapis**.
- iPhone : Safari n'a pas Web Bluetooth, il faut le navigateur **Bluefy** ; données séparées, donc export JSON puis import dans Bluefy (accompagnement pas à pas).
- Problèmes rencontrés et corrigés : tapis introuvable dans Bluefy (UUID passés en 128 bits texte, diagnostic détaillé), ancienne page en cache (ajout du numéro `page vX`).
- Constat réel : **le tapis démarre et la pente suit, mais la vitesse reste à 1 km/h, « contrôle refusé »** (code 5), même après démarrage. Faux message « pente refusée » corrigé.
- Décision : **mode mixte** = pente pilotée par l'appli, vitesse guidée à l'écran (« ▲ Accélérez : 1,0 → 4,2 ») d'après la vitesse réelle lue sur le tapis ; refus mémorisé, lien « Retester ».

## Phase 4 : adaptations au F63 (10/10)

| Demande | Décision | Livré |
|---|---|---|
| Bouton **Spécial F63** dans Créer : vitesse identique sauf 1er et dernier palier plus lents, seule la pente varie ; sinon comme d'habitude | Case cochée par défaut | v7 |
| (Effacer ses programmes) « je vais virer moi-même les programmes » | Aucune suppression automatique | |
| Voix en mode **Auto** : parle uniquement quand la vitesse change | Voix Coupée / Auto / Toujours | v7 |
| Bouton « tout effacer d'un coup » | « Tout effacer » ou « Effacer les N programmes de X min » selon le filtre, Annuler 5 s | v8 |
| « J'ai toujours la v7 » | Publication GitHub prend 1 à 3 min ; recharger | |
| F63 : vitesse toujours 4,7-4,8, pouvoir choisir la vitesse ; bouton de recherche de mise à jour | Réglage Vitesse (+/− 0,1, plafonné au max du type) ; Réglages → Rechercher | v9 |

## Phase 5 : classement, notes, historique (14/10)

| Demande | Décision | Livré |
|---|---|---|
| Dans chaque onglet de durée, trier du plus petit au plus grand kcal | Tri durée puis kcal puis nom | v10 |
| Noter une séance en fin de séance (1 à 5 étoiles), voir les étoiles sur la tuile, retrouver et modifier la dernière note ; historique des séances menées au bout dans l'onglet Séance | Note portée par le programme et par chaque séance ; historique avec total | v11 |
| Séance du matin (30 min intervalles, 297 kcal) à noter 5 étoiles et à mettre dans l'historique de 07:30 à 08:00 | Reprise unique automatique au 1er lancement (programme 30 min à 297 kcal) | v11 |
| Renommer depuis l'appui long sur une tuile | Ajouté ; le nouveau nom se reporte dans l'historique | v12 |
| « J'ai toujours la v11 » | Vérifié en ligne ; Rechercher ou recharger, attendre la publication | |

## Phase 6 : Strava et Kinomap (15/10), rien de codé

- Envoyer une marche sur Strava ? Options présentées : 1 saisie manuelle, 2 fichier .tcx importé sur strava.com, 3 envoi direct via un webhook **n8n sur son VPS**.
- Samuel : « Ne code rien pour l'instant ». Option 1 sans intérêt (pas de pentes), option 2 trop laborieuse sur iPhone, **option 3 retenue** avec envoi **à sa main en fin de séance**. Pas de doublon avec Kinomap car il n'utilise pas les deux applis pour la même séance.
- Limite signalée : une activité Strava sans GPS n'affichera probablement pas de courbe de pente ; solution sûre = pentes et D+ équivalent dans la description.
- **Blocage** : depuis le 01/06/2026, Strava exige un abonnement payant pour créer une application API. Samuel a un compte **gratuit** → option 3 impossible sans abonnement.
- Passer par Kinomap (abonné, synchro Strava déjà active) ? Kinomap n'a **ni API publique ni import d'activités**. Contourner serait fragile et contraire à leurs conditions : déconseillé.
- Import de programmes dans Kinomap : **pas d'import de fichier**, mais un créateur d'entraînements structurés sur creator.kinomap.com/workout (une valeur par palier, mode pente, entraînements publics). Convient aux programmes Spécial F63. **En attente** : Samuel vérifie si « Entraînement structuré » existe pour le tapis dans Kinomap.

## Phase 7 : passage à Claude Code (15/10)

Création de `CLAUDE.md` (mémoire de projet) et de ce fichier, versionnés à la racine du dépôt. `TradeMil.xlsx` non versionné (dépôt public), transmis à part.
