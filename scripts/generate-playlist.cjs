const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tracks = fs.readdirSync(path.join(root, 'assets'), { withFileTypes: true })
  .filter(entry => entry.isFile() && /^musica\d+\.mp3$/i.test(entry.name))
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b, 'pt', { numeric: true }))
  .map(name => ({
    title: `Faixa ${name.match(/\d+/)[0]}`,
    artist: 'Playlist do site',
    src: `assets/${name}`,
  }));

if (!tracks.length) {
  throw new Error('Nenhuma música encontrada em assets/. Adicione arquivos musica1.mp3, musica2.mp3, etc.');
}

fs.writeFileSync(
  path.join(root, 'js/tracks.js'),
  '// Gerado automaticamente a partir dos arquivos em assets/.\nconst TRACKS = ' + JSON.stringify(tracks, null, 2) + ';\n',
);
