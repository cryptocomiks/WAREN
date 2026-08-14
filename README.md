# Berkshire Hathaway — Le retournement acheteur du T2 2026

Site de rapport financier long format, en français, sur le premier trimestre
acheteur de Berkshire Hathaway après quatorze trimestres de ventes nettes.

**Parti pris visuel** : listing comptable à bandes vertes, annoté au crayon
rouge d'auditeur. Le document se déroule progressivement — chaque feuillet, chaque
graphique et chaque annotation apparaît à l'entrée dans le champ de lecture.

**Conformité** : le document répète, à intervalles réguliers, qu'il s'agit
d'une analyse pédagogique et **non d'un conseil en investissement**. Le
dispositif est décrit plus bas.

**Parti pris éditorial** : le sujet est technique, le texte ne l'est pas. Le
document porte deux voix distinctes, typographiquement opposées. Le **crayon
rouge** est celle de l'auditeur : elle doute, elle corrige, elle raye. Les
encadrés verts **« en clair »** sont celle du guide : après chaque passage
dense, ils reformulent l'idée en français courant, sans jargon et avec des
analogies concrètes. Dix-sept d'entre eux ponctuent le dossier, et vingt-deux
termes ouvrent leur définition d'un clic.

## Contenu

Dix feuillets et une page de contact :

| # | Feuillet | Ce qu'on y trouve |
|---|---|---|
| 01 | Où on en est | Ce qui est déjà publié, ce qui sort ce soir, et sur quoi ce dossier s'appuie |
| 02 | Le fait central | Les 14 trimestres, la bascule, et pourquoi l'arrêt des ventes prime sur l'achat |
| 03 | Les chiffres vérifiés | Flux, rachats, le piège de la trésorerie, impôt latent, résultats |
| 04 | Le portefeuille | Les 28 sociétés du 13F, le basculement du top 5, l'angle mort du 13F |
| 05 | Alphabet | Les termes exacts du placement du 4 juin et leur portée |
| 06 | La doctrine Abel | Ce qu'il conserve, ce qu'il change, et la nuance Weschler |
| 07 | Pourquoi maintenant | Coût d'opportunité, contrainte fiscale, ventilation des 23,5 Md$ |
| 08 | La vision long terme | Rotation du portefeuille et sous-performance décennale |
| 09 | Les quatre pièges | Cartes à retourner : l'erreur, puis la correction |
| 10 | Ce qu'on sait, ce qu'on ne sait pas | Le niveau de preuve de chaque affirmation |

## Éléments interactifs

- **Note de bas de page à ouvrir** (§3.3) — le titre de presse, puis le texte
  du 10-Q qui le contredit et le graphique de réconciliation.
- **Filtres de portefeuille** — nouvelles / renforcées / réduites / inchangées.
  Les lignes non retenues sont estompées, jamais repeintes : une couleur suit
  toujours la même entité.
- **Bascule du top 5** — 31 mars (classement déclaré, en barres) contre 30 juin
  (ordre alphabétique du 10-Q, en plaques : aucun rang n'est déclaré).
- **Cartes « pièges »** — cliquer révèle la correction, l'affirmation est raturée.
- **Glossaire contextuel** — 22 termes définis sans jargon, au survol ou au clic :
  13F, 10-Q, plus-value latente, impôt différé, mise en équivalence, sogo shosha,
  bon de souscription, placement privé, valeur intrinsèque, coût d'opportunité…

## Conformité

Le sujet touche à des valeurs cotées : l'avertissement ne doit pas être une
ligne perdue en pied de page. Il est présent à cinq niveaux, dans une
troisième voix typographique — l'ambre, déjà réservée au statut d'alerte et
jamais utilisée ailleurs.

1. **Bandeau permanent** sous la navigation, visible à tout instant de la
   lecture : « Analyse pédagogique · Ceci n'est pas un conseil en
   investissement · Faites vos propres recherches ».
2. **Avertissement d'ouverture** sur la couverture, avant tout contenu :
   pas de conseil, aucune société recommandée, faites vos propres
   recherches, risque de perte en capital.
3. **Rappel au pied de chaque feuillet**, engendré par le script — dix
   formulations différentes, car un même avertissement répété dix fois à
   l'identique cesse d'être lu.
4. **Encadrés ciblés** là où le risque de mélecture est le plus fort : la
   liste des positions n'est pas une liste d'achats (feuillet 04), les
   conditions du placement Alphabet ne sont accessibles à personne d'autre
   (05), le pari immobilier peut échouer (07), les performances passées
   n'annoncent rien (08).
5. **Mention légale complète** au feuillet 10 et dans le colophon, plus un
   rappel dans la page de contact et sur l'image de partage.

Le test de fumée vérifie ce dispositif à chaque exécution : présence du
bandeau, dix rappels de pied, au moins six encadrés, et un décompte minimal
des occurrences dans le texte visible.

## Navigation

- **Sommaire d'entrée** — dix feuillets avec un résumé d'une ligne chacun, et le
  temps de lecture estimé.
- **Onglets d'intercalaire** en grand écran, qui suivent la lecture ; en petit
  écran, une barre compacte affichant le feuillet courant et ouvrant un panneau
  de sommaire plein écran (fermeture au clic extérieur ou par Échap).
- **Renvoi « feuillet suivant »** au pied de chaque feuillet, engendré depuis la
  liste des onglets pour rester synchronisé.
- **Retour au sommaire** flottant, après un défilement suffisant.
- **Rail de progression** en haut de page.

## Méthode graphique

Douze graphiques SVG construits à la main, sans bibliothèque.

- Palette catégorielle validée sur la surface papier `#F4F0E1` : vert
  grand-livre `#127A46`, bleu encre `#1A5FA8`, rouge auditeur `#C0271A`
  (bande de clarté, plancher de chroma, contraste ≥ 3:1 et séparation en
  vision normale tous conformes).
- La paire rouge/vert se situe dans la bande de séparation 6–8 pour le
  daltonisme : elle porte donc systématiquement un **encodage secondaire** —
  hachure à 45° et étiquette chiffrée directe sur chaque marque.
- Deux hachures distinctes : **pleine** pour une valeur réelle (ventes, bons du
  Trésor non dénoués), **ouverte avec contour tireté** pour un montant dérivé
  ou non déclaré. Aucun chiffre estimé n'est présenté comme un chiffre publié.
- Rampe séquentielle à teinte unique pour les grandeurs (poids du portefeuille).
- L'ambre `#8A6300` est réservé au statut d'avertissement et n'est jamais
  utilisé comme série.
- Un seul axe par graphique. Niveaux et incréments ne sont jamais mélangés sur
  le même axe — le placement Alphabet de juin est intégré au niveau cumulé.
- Chaque marque est atteignable au clavier et porte son étiquette accessible ;
  les valeurs figurent aussi en clair dans les tableaux et les légendes.

## Technique

Site statique. Aucune dépendance à l'exécution, aucune requête externe,
aucune étape de compilation.

```
index.html              le document
404.html                page d'erreur, dans le même style
assets/css/report.css   papier, crayon, « en clair », navigation, impression
assets/js/report.js     données, graphiques, glossaire, navigation, révélation
og.png                  image de partage 1200×630
vercel.json             en-têtes, cache, URLs propres
build.js                assemble le tout en un fichier unique dans dist/
tools/og.js             régénère og.png
test/smoke.js           test de fumée (3 écrans + 404 + og + conformité)
```

- Responsive de 320 px à grand écran : les graphiques sont redessinés à la
  taille réelle du conteneur, pas mis à l'échelle.
- `prefers-reduced-motion` respecté : tout est affiché d'emblée, sans animation.
- Feuille d'impression : le dossier sort proprement en papier, tous les blocs
  repliés dépliés.
- Le document assume un rendu unique — du papier. Pas de mode sombre : la
  métaphore est une feuille de listing.

## Déployer sur Vercel

La branche de production est `main`. Tout est déjà configuré : il n'y a ni
commande de compilation, ni variable d'environnement, ni réglage à saisir.

1. Sur [vercel.com/new](https://vercel.com/new), importer le dépôt
   `cryptocomiks/WAREN`.
2. Laisser tous les champs tels quels — Vercel lit `vercel.json` et sert la
   racine. Le préréglage de framework doit rester **Other**.
3. Cliquer sur **Deploy**.

Chaque `git push` sur `main` redéploie la production. Chaque pull request reçoit
sa propre URL de prévisualisation.

Ce que `vercel.json` met en place :

- **URLs propres** — `/` au lieu de `/index.html`.
- **Cache** — le HTML est toujours revalidé, donc un nouveau déploiement est
  visible tout de suite ; les assets sont mis en cache une heure puis revalidés
  en tâche de fond. Pas de cache immuable : les fichiers gardent le même nom
  d'un déploiement à l'autre, un visiteur de retour resterait bloqué sur
  l'ancienne version.
- **En-têtes de sécurité** — `nosniff`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`.
- **Installation neutralisée** — `installCommand` est un simple `echo`, pour que
  Vercel ne télécharge pas Playwright (utile en développement seulement) à
  chaque déploiement.
- **`.vercelignore`** écarte du déploiement les tests, les outils et `dist/`.

### Avec un domaine personnalisé

Une seule chose mérite d'être ajustée : l'image de partage est référencée en
chemin relatif (`/og.png`), ce que les principaux robots d'aperçu résolvent
correctement. Pour être certain du rendu sur tous les réseaux, remplacer dans
`index.html` les deux lignes `og:image` et `twitter:image` par l'URL absolue :

```html
<meta property="og:image" content="https://mondomaine.fr/og.png">
<meta name="twitter:image" content="https://mondomaine.fr/og.png">
```

## Lancer en local

```sh
npm run dev     # http://127.0.0.1:8099/
npm test        # test de fumée sur 3 tailles d'écran
npm run bundle  # régénère dist/
npm run og      # régénère l'image de partage
```

Le dépôt peut aussi être servi tel quel par GitHub Pages, Netlify, Cloudflare
Pages ou n'importe quel hébergement statique.

## Intégration continue

`.github/workflows/ci.yml` s'exécute sur chaque push et chaque pull request vers
`main` : syntaxe JavaScript, validité de `vercel.json`, test de fumée sur trois
tailles d'écran, et vérification que `dist/` est bien à jour.

## Avertissement

Ce document est un travail d'analyse et de pédagogie réalisé à partir de
sources publiques. **Il ne constitue pas un conseil en investissement**, ni une
recommandation, ni une sollicitation d'achat ou de vente. Aucune des sociétés
citées n'est recommandée. Faites vos propres recherches et consultez un
professionnel agréé avant toute décision. Tout investissement comporte un
risque de perte en capital. Les niveaux de confiance et les limites de chaque
affirmation sont détaillés au feuillet 10.

Questions : [@crypto_comiks](https://www.instagram.com/crypto_comiks) sur Instagram.
