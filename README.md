# Berkshire Hathaway — Le retournement acheteur du T2 2026

Site de rapport financier long format, en français, sur le premier trimestre
acheteur de Berkshire Hathaway après quatorze trimestres de ventes nettes.

**Parti pris visuel** : listing comptable à bandes vertes, annoté au crayon
rouge d'auditeur. Le document se déroule progressivement — chaque feuillet, chaque
graphique et chaque annotation apparaît à l'entrée dans le champ de lecture.

## Contenu

Onze feuillets, un quiz de douze questions et une page de contact :

| # | Feuillet | Ce qu'on y trouve |
|---|---|---|
| 00 | Statut du dossier | Ce qui est publié, ce qui ne l'est pas, et les sources primaires |
| 01 | Le fait central | Les 14 trimestres, la bascule, et pourquoi l'arrêt des ventes prime sur l'achat |
| 02 | Les chiffres vérifiés | Flux, rachats, le piège de la trésorerie, fiscalité latente, résultats |
| 03 | Le portefeuille | Les 28 lignes du 13F, le basculement du top 5, ce que le 13F ne montre jamais |
| 04 | Alphabet | Les termes exacts du placement du 4 juin et leur portée |
| 05 | La doctrine Abel | Ce qu'il conserve, ce qu'il change, et la nuance Weschler |
| 06 | Pourquoi maintenant | Coût d'opportunité, contrainte fiscale, ventilation des 23,5 Md$ |
| 07 | La vision long terme | Rotation structurelle et sous-performance décennale |
| 08 | Les quatre pièges | Cartes à retourner : l'erreur, puis la correction |
| 09 | Grille de dépouillement | Six points à cocher à la publication du 13F |
| 10 | Confiance et limites | Le niveau de preuve de chaque affirmation |

## Éléments interactifs

- **Note de bas de page à ouvrir** (§2.3) — le titre de presse, puis le texte
  du 10-Q qui le contredit et le graphique de réconciliation.
- **Filtres de portefeuille** — nouvelles / renforcées / réduites / inchangées.
  Les lignes non retenues sont estompées, jamais repeintes : une couleur suit
  toujours la même entité.
- **Bascule du top 5** — 31 mars (classement déclaré, en barres) contre 30 juin
  (ordre alphabétique du 10-Q, en plaques : aucun rang n'est déclaré).
- **Cartes « pièges »** — cliquer révèle la correction, l'affirmation est raturée.
- **Grille de dépouillement** — cases à cocher au clavier ou à la souris.
- **Glossaire contextuel** — 13F, 10-Q, 424B5, section 4(a)(2), mise en
  équivalence, droits d'enregistrement, coût d'opportunité.
- **Quiz noté** — correction immédiate, explication et renvoi au feuillet.

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

Trois fichiers, aucune dépendance, aucune requête externe.

```
index.html              le document
assets/css/report.css   papier, crayon, mise en page, impression
assets/js/report.js     données, graphiques, révélation progressive, quiz
```

- Responsive de 320 px à grand écran : les graphiques sont redessinés à la
  taille réelle du conteneur, pas mis à l'échelle.
- `prefers-reduced-motion` respecté : tout est affiché d'emblée, sans animation.
- Feuille d'impression : le dossier sort proprement en papier, tous les blocs
  repliés dépliés.
- Le document assume un rendu unique — du papier. Pas de mode sombre : la
  métaphore est une feuille de listing.

## Lancer en local

```sh
npx http-server -p 8099 .
# puis http://127.0.0.1:8099/
```

Aucune étape de compilation : le dépôt peut être servi tel quel par GitHub Pages
ou n'importe quel hébergement statique.

## Avertissement

Document d'analyse et de pédagogie. Il ne constitue pas un conseil en
investissement. Les niveaux de confiance et les limites de chaque affirmation
sont détaillés au feuillet 10.

Questions : [@crypto_comiks](https://www.instagram.com/crypto_comiks) sur Instagram.
