# Sole F63 Programmes

Appli web pour créer, enregistrer et suivre des programmes de marche sur le tapis Sole F63.

Chaque programme est découpé en **18 paliers de durée égale** (1/18 du temps total). Pour chaque palier on règle la **pente** et la **vitesse** ; l'appli calcule la distance, la distance cumulée, les kcal et les kcal cumulées, selon les formules du fichier Excel TradeMil.

## Fonctions

Quatre onglets en bas de l'écran :

- **Programmes** : uniquement les programmes enregistrés, en grille de tuiles (2 par ligne) triées du plus court au plus long, avec une rangée de durées en haut pour filtrer (« Toutes », « 20 min », « 30 min »…). Chaque tuile : durée, kcal, km, nom (version courte « Intervalles » pour un programme automatique non renommé), profil, vitesse et pente moyennes. Appui sur une tuile : la fiche. Appui long : Lancer, Ouvrir, Dupliquer, Supprimer (bouton Annuler pendant 5 s). En bas de la liste, « Tout effacer » (ou, avec une durée filtrée, « Effacer les programmes de 30 min »), après confirmation et avec Annuler pendant 5 s.
- **Créer** : automatique (temps total, kcal visées, marche ou course, forme) ou manuel (profil plat ou copie). Rien n'est enregistré avant d'appuyer sur **Enregistrer** ; on peut aussi ajuster les paliers avant, ou lancer la séance sans enregistrer.
- **Séance** : reprend le dernier programme lancé. Séance plein écran : décompte par palier, consignes en grand, bips et voix, écran maintenu allumé, bilan à la fin.
- **Réglages** : poids (unique pour tous les programmes), vitesse max en marche et en course (plafonds de la création automatique), bips et voix, son des bips à choisir parmi 15 (écoute avant choix), export / import, version.

Modification d'un programme : écran dédié avec **Annuler / Enregistrer**, une ligne par palier avec + / − (pente 1 %, vitesse 0,1 km/h, appui maintenu pour défiler) et les totaux en bas.

Écran fixe : seule la zone centrale défile, champs en 16 px minimum (pas de zoom ni de décalage latéral sur iPhone). Installable sur téléphone et utilisable hors connexion.

## Pilotage du tapis (Bluetooth)

Le Sole F63 accepte le protocole standard FTMS. Testé sur le tapis : il accepte la **pente** mais refuse la **vitesse** (réponse « contrôle refusé »). L'appli pilote donc la pente, et pour la vitesse affiche l'écart en direct sous la consigne (« ▲ Accélérez : 1,0 → 4,2 », puis ✓ en vert) en lisant la vitesse réelle du tapis. Ce refus est mémorisé ; Réglages, « Retester la vitesse » pour réessayer.

- **Connexion** : Réglages ou onglet Séance, « Connecter ». Une seule appli à la fois peut être connectée au tapis (fermer Kinomap et Sole+).
- **Navigateur** : Chrome sur Android ou ordinateur. Sur iPhone, Safari et l'appli installée sur l'écran d'accueil n'ont pas accès au Bluetooth : utiliser le navigateur gratuit **Bluefy** et y ouvrir l'adresse du site. Bluefy a ses propres données : exporter les programmes puis les importer dans Bluefy.
- **Séance** : au premier démarrage, confirmation de sécurité, puis le tapis démarre et reçoit vitesse et pente à chaque palier (et avec les boutons palier précédent / suivant). Pause et Reprendre mettent le tapis en pause et le relancent ; à la fin, le tapis s'arrête.
- **Sécurité** : un arrêt sur la console ou le retrait de la clé de sécurité met la séance en pause. Si la connexion est perdue, le tapis garde sa vitesse et sa pente ; l'appli tente de se reconnecter et l'affiche en orange.
- La vitesse et la pente réelles du tapis s'affichent en haut de l'écran de séance.
- « Démarrer sans piloter le tapis » ne vaut que pour la séance en cours ; le pilotage se coupe durablement dans Réglages.

Commandes envoyées (point de contrôle FTMS 0x2AD9) : demande de contrôle `00`, démarrage `07`, pente `03` (0,1 %), vitesse `02` (0,01 km/h), pause `08 02`, arrêt `08 01`.

## Formules (identiques à l'Excel)

```
durée palier (min)  = temps total / 18
vitesse (m/min)     = vitesse km/h × 1000 / 60
distance (km)       = vitesse km/h × durée palier / 60
kcal                = (0,1 × v + 1,8 × v × pente/100 + 3,5) × poids / 200 × durée palier
```

C'est l'équation ACSM de la **marche**. Elle reste fiable jusqu'à 6-7 km/h ; en course (au-delà d'environ 8 km/h) elle sous-estime la dépense.

## En ligne

L'appli est publiée par GitHub Pages depuis la branche `main` (Settings → Pages → *Deploy from a branch*, dossier racine) :
**https://masuel254.github.io/SoleF63/**

## Installer sur le téléphone

- **iPhone** (Safari) : bouton Partager → *Sur l'écran d'accueil*.
- **Android** (Chrome) : menu ⋮ → *Installer l'application*.

## Rechercher une mise à jour

Réglages, rubrique Application, **Rechercher** : l'appli compare sa version à celle en ligne et, si une nouvelle existe, l'installe et se recharge sans avoir à la quitter.

## Mettre à jour le site

Chaque envoi sur `main` est publié en une à deux minutes. Avant chaque envoi, la ligne `const VERSION` de `sw.js` reçoit la date et l'heure du jour : c'est ce changement qui déclenche la mise à jour sur les téléphones. En cas d'envoi à la main (**Add file → Upload files**), penser à changer cette date.

À la prochaine ouverture, l'appli détecte la nouvelle version, l'installe et se recharge toute seule (message « Appli mise à jour »). Elle vérifie aussi quand on la réaffiche après une mise en veille. Si une séance est en cours, la mise à jour attend la fin de la séance.

La version en service s'affiche en petit en bas de la liste des programmes : « Version du 09/10/2026 à 15h28 ».

## Données

Les programmes sont stockés dans le navigateur de chaque appareil (localStorage). Rien n'est envoyé sur internet. Vider les données du navigateur efface les programmes : pensez à les **exporter** de temps en temps.

## Limites machine

Vitesse 0,8 à 18 km/h, pente 0 à 15 % (maximum du tapis). Modifiables en haut du script (`VMIN`, `VMAX`, `PMIN`, `PMAX`).

Création automatique : plafonds de vitesse réglés dans Réglages (par défaut 5,8 km/h en marche et 11 km/h en course), pente jusqu'à 15 %. Échauffement, récupérations et retour au calme sont calculés en pourcentage de ces vitesses max.

Mode séance : deux boutons indépendants, **Bips** et **Voix** (les deux, l'un, l'autre ou aucun, choix mémorisé).
- Bips : 3 bips courts à 3, 2 et 1 seconde de chaque changement de palier, puis un bip long au changement.
- Voix : annonce la nouvelle consigne au changement (« 3,8 kilomètres heure, pente 2 »), au départ et en fin de séance.
- Voix seule : la voix compte aussi « trois, deux, un » à la place des bips.
- Voix en mode **Auto** (Réglages, ou appui répété sur le bouton Voix : Coupée → Auto → Toujours) : ne parle qu'au départ et quand la vitesse change, pour annoncer la nouvelle vitesse.

## Spécial F63

Case cochée par défaut dans **Créer** (automatique). Comme le F63 ne laisse pas l'appli piloter la vitesse, le programme garde la vitesse choisie (réglage **Vitesse** avec + / −, mémorisé séparément pour la marche et la course, plafonné à la vitesse max de Réglages) sur les 16 paliers centraux ; seuls le premier et le dernier palier sont plus lents (échauffement, retour au calme). L'effort vient de la pente, qui suit la forme choisie (intervalles, pyramide, régulier). Décochée : création habituelle, vitesse variable à chaque palier.
