#!/usr/bin/env node
/* Assemble le dossier en un seul fichier HTML autonome (dist/).
   Utile pour l'héberger tel quel, l'envoyer par mail ou l'archiver.
   Usage : node build.js                                             */
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const html = read('index.html');
const css = read('assets/css/report.css');
const js = read('assets/js/report.js');

const body = html
  .split('<body>')[1]
  .split('</body>')[0]
  .replace('<script src="assets/js/report.js" defer></script>', '')
  .trim();

const out = [
  '<title>Dossier Berkshire T2 2026</title>',
  '<style>\n' + css + '\n</style>',
  body,
  '<script>\n' + js + '\n</script>',
  ''
].join('\n');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const target = path.join(root, 'dist', 'dossier-berkshire-t2-2026.html');
fs.writeFileSync(target, out);

/* Le fichier n'a volontairement ni doctype ni squelette : il est destiné à
   être injecté dans un gabarit hôte. La version autoportante ci-dessous sert
   à l'ouvrir directement dans un navigateur. */
fs.writeFileSync(
  path.join(root, 'dist', 'dossier-berkshire-t2-2026.autonome.html'),
  '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  '</head>\n<body>\n' + out + '</body>\n</html>\n'
);

console.log('dist/ écrit — ' + Math.round(Buffer.byteLength(out) / 1024) + ' Ko');
