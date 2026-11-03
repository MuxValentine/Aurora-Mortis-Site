const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const tracks = fs.readdirSync(path.join(root, 'assets'), { withFileTypes: true })
  .filter(entry => entry.isFile() && /^musica\d+\.mp3$/i.test(entry.name))
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b, 'pt', { numeric: true }))
  .map(name => {
    const number = name.match(/\d+/)[0];
    const cover = `assets/images/capas/faixa${number}.png`;
    return {
      title: `Faixa ${number}`,
      artist: 'Playlist do site',
      src: `assets/${name}`,
      ...(fs.existsSync(path.join(root, cover)) ? { capa: cover } : {}),
    };
  });

if (!tracks.length) {
  throw new Error('Nenhuma música encontrada em assets/. Adicione arquivos musica1.mp3, musica2.mp3, etc.');
}

fs.writeFileSync(
  path.join(root, 'js/tracks.js'),
  '// Gerado automaticamente a partir dos arquivos em assets/.\nconst TRACKS = ' + JSON.stringify(tracks, null, 2) + ';\n',
);
