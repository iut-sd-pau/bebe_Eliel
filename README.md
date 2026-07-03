# Invitation - Anniversaire d'Eliel (1 an)

Une vraie petite aventure pour enfant (environ 1 minute), racontée du début
à la fin par la voix intégrée du navigateur (le même principe que dans
FlashBrain : pas de fichiers audio à télécharger pour la voix, le
téléphone/l'ordinateur la génère lui-même). Un ourson compagnon anime
l'aventure. 13 écrans, guidés à la voix, avec 2 mini-jeux.

## Pourquoi la voix du navigateur (et pas un fichier audio) ?
- **Elle ne se superpose jamais** : le navigateur met les répliques en file
  d'attente automatiquement. Avant, si l'enfant finissait un mini-jeu très
  vite, la réplique de victoire pouvait démarrer par-dessus la réplique
  d'intro encore en train de parler. Avec ce systeme, c'est impossible :
  la suivante attend toujours que la precedente soit terminee.
- **Simple et legere** : pas de gros fichiers audio de voix a telecharger,
  juste du texte que l'appareil lit lui-meme.
- **Prononciation correcte** : les textes contiennent tous leurs accents
  francais.

Sur certains tres vieux appareils sans voix francaise installee, le
navigateur utilisera sa voix par defaut (le texte reste correct, seul
l'accent peut differer legerement).

## Le parcours
- **Démarrage** - "Touche l'écran pour commencer" : débloque le son et lance
  la voix qui accompagne tout le parcours
- **Mystère** - la voix demande le prénom
- **Enveloppe** - personnalisée, la voix invite à la toucher
- **Décollage, mini-jeu ballons, vol, teaser, révélation d'Eliel, mini-jeu
  "entraîne-toi à souffler", "Eliel adore...", infos pour les parents,
  invitation finale**

## Ce qui a été corrigé dans cette version
- **Voix simple et robotique** (comme FlashBrain) à la place de la voix
  synthétique "naturelle" précédente
- **Plus de superposition de voix** grâce à la file d'attente native du
  navigateur
- **Message final changé** : "On a hâte de te voir à la fête ! À très vite !"
  à la place de "Merci d'être venu" (qui n'avait pas de sens avant la fête)

## Contenu du dossier
- `index.html`, `style.css`, `script.js` - le site
- `assets/eliel.jpg` - la photo
- `assets/music.mp3` - musique de fond douce en boucle
- `assets/open.mp3`, `rise.mp3`, `chime.mp3`, `pop.mp3` - effets sonores
- `assets/balloonpop.mp3`, `giggle.mp3` - sons des mini-jeux et de la mascotte

(il n'y a plus de fichiers de voix dans `assets/` : la voix est generee en
direct par l'appareil de la personne qui ouvre le lien)

## Mettre en ligne avec GitHub Pages (gratuit)

1. Crée un repo GitHub (public), ex. `invitation-eliel`.
2. Dézippe ce dossier sur ton ordinateur.
3. Dans le repo, **Add file > Upload files**, glisse **le contenu** du
   dossier dézippé (fichiers + dossier `assets`, pas le dossier parent) pour
   que `index.html` soit à la racine du repo.
4. Vérifie que `index.html` est visible directement à la racine et que
   `assets/` est un sous-dossier avec tous les fichiers dedans.
5. **Settings > Pages** > Deploy from a branch > branche `main` > `/ (root)`
   > Save.
6. Le site sera en ligne à `https://TON-PSEUDO.github.io/invitation-eliel/`
   au bout d'une à deux minutes. Partage ce lien sur WhatsApp.

## Notes
- Le son ne démarre qu'après le tap sur l'écran de démarrage.
- Date/heure de la fête : variable `target` dans `startCountdown()` dans
  `script.js`.
- Tous les textes (affichés ET parlés) sont modifiables directement dans
  `script.js` (objet `TEXTS` en haut du fichier) et `index.html` - plus
  besoin de régénérer un audio, un simple changement de texte suffit
  maintenant.

## Derniers ajouts
- **Écran d'introduction pour les parents** tout au début : explique
  brièvement (sans dévoiler la surprise) que cette invitation est pensée
  pour être vécue par l'enfant, accompagné d'un parent - pour éviter le
  réflexe naturel du parent de la parcourir seul avant de comprendre que ce
  n'est pas pour lui.
- **Musique spéciale, douce et joyeuse** sur l'écran final uniquement : la
  musique d'aventure principale s'estompe en fondu, remplacée par une
  mélodie plus calme et tendre pour clôturer l'expérience.
