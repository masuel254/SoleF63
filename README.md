# Sole F63 Programmes

Appli web pour créer, enregistrer et suivre des programmes de marche sur le tapis Sole F63.

Chaque programme est découpé en **18 paliers de durée égale** (1/18 du temps total). Pour chaque palier on règle la **pente** et la **vitesse** ; l'appli calcule la distance, la distance cumulée, les kcal et les kcal cumulées, selon les formules du fichier Excel TradeMil.

## Fonctions

- Temps total (de 5 à 240 min, pas de 1 min) et poids réglables par programme
- Boutons + / − sur chaque pente (pas de 1 %) et chaque vitesse (pas de 0,1 km/h), maintien appuyé pour défiler
- Graphique : histogramme des vitesses et courbe de pente, modifiable en glissant le doigt
- Programmes nommés, enregistrés automatiquement, dupliquables
- 10 programmes de marche prédéfinis
- Mode séance : décompte par palier, consignes en grand, bip au changement, écran maintenu allumé
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

## Mise en ligne sur GitHub Pages

1. Sur github.com, créer un dépôt public, par exemple `sole-f63`.
2. Bouton **Add file → Upload files**, glisser tout le contenu du dossier (index.html, sw.js, manifest.webmanifest, README.md et le dossier icons), puis **Commit changes**.
3. **Settings → Pages** : Source = *Deploy from a branch*, Branch = `main`, dossier `/ (root)`, **Save**.
4. Après une à deux minutes, l'appli est en ligne à l'adresse `https://<votre-compte>.github.io/sole-f63/`.

## Installer sur le téléphone

- **iPhone** (Safari) : bouton Partager → *Sur l'écran d'accueil*.
- **Android** (Chrome) : menu ⋮ → *Installer l'application*.

## Mettre à jour le site

Remplacer les fichiers modifiés dans le dépôt, puis changer la ligne `const CACHE = 'sole-f63-v1'` dans `sw.js` (v2, v3…) pour que les téléphones récupèrent la nouvelle version.

## Données

Les programmes sont stockés dans le navigateur de chaque appareil (localStorage). Rien n'est envoyé sur internet. Vider les données du navigateur efface les programmes : pensez à les **exporter** de temps en temps.

## Limites machine

Vitesse 0,8 à 18 km/h, pente 0 à 15 %. À vérifier sur la notice du tapis ; modifiables en haut du script (`VMIN`, `VMAX`, `PMIN`, `PMAX`).
