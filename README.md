# Sole F63 Programmes

Appli web pour créer, enregistrer et suivre des programmes de marche sur le tapis Sole F63.

Chaque programme est découpé en **18 paliers de durée égale** (1/18 du temps total). Pour chaque palier on règle la **pente** et la **vitesse** ; l'appli calcule la distance, la distance cumulée, les kcal et les kcal cumulées, selon les formules du fichier Excel TradeMil.

## Fonctions

- Temps total (de 5 à 240 min, pas de 1 min) et poids réglables par programme
- Boutons + / − sur chaque pente (pas de 1 %) et chaque vitesse (pas de 0,1 km/h), maintien appuyé pour défiler
- Graphique : histogramme des vitesses et courbe de pente, modifiable en glissant le doigt
- Programmes nommés, enregistrés automatiquement, dupliquables
- 10 programmes de marche prédéfinis
- Création automatique : temps total + kcal visées + marche ou course → programme calculé
- Mode séance : décompte par palier, consignes en grand, 3 bips avant chaque changement, écran maintenu allumé
- Export / import des programmes (fichier .json) pour passer d'un appareil à l'autre
- Installable sur téléphone et utilisable hors connexion

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

## Mettre à jour le site

Chaque envoi sur `main` est publié en une à deux minutes. Avant chaque envoi, la ligne `const VERSION` de `sw.js` reçoit la date et l'heure du jour : c'est ce changement qui déclenche la mise à jour sur les téléphones. En cas d'envoi à la main (**Add file → Upload files**), penser à changer cette date.

À la prochaine ouverture, l'appli détecte la nouvelle version, l'installe et se recharge toute seule (message « Appli mise à jour »). Elle vérifie aussi quand on la réaffiche après une mise en veille. Si une séance est en cours, la mise à jour attend la fin de la séance.

La version en service s'affiche en petit en bas de la liste des programmes : « Version du 09/10/2026 à 14h01 ».

## Données

Les programmes sont stockés dans le navigateur de chaque appareil (localStorage). Rien n'est envoyé sur internet. Vider les données du navigateur efface les programmes : pensez à les **exporter** de temps en temps.

## Limites machine

Vitesse 0,8 à 18 km/h, pente 0 à 15 % (maximum du tapis). Modifiables en haut du script (`VMIN`, `VMAX`, `PMIN`, `PMAX`).

Création automatique : vitesse max 5,8 km/h en marche et 11 km/h en course, pente jusqu'à 15 % dans les deux cas.

Mode séance : deux boutons indépendants, **Bips** et **Voix** (les deux, l'un, l'autre ou aucun, choix mémorisé).
- Bips : 3 bips courts à 3, 2 et 1 seconde de chaque changement de palier, puis un bip long au changement.
- Voix : annonce la nouvelle consigne au changement (« 3,8 kilomètres heure, pente 2 »), au départ et en fin de séance.
- Voix seule : la voix compte aussi « trois, deux, un » à la place des bips.
