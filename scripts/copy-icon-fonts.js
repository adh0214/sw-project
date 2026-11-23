const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const fontNames = ['Ionicons.ttf', 'MaterialCommunityIcons.ttf'];
const sourceDirectory = path.join(
  __dirname,
  '..',
  'node_modules',
  '@expo',
  'vector-icons',
  'build',
  'vendor',
  'react-native-vector-icons',
  'Fonts'
);
const outputDirectory = path.join(
  __dirname,
  '..',
  'dist',
  'assets',
  'node_modules',
  '@expo',
  'vector-icons',
  'build',
  'vendor',
  'react-native-vector-icons',
  'Fonts'
);

fs.mkdirSync(outputDirectory, { recursive: true });

for (const fontName of fontNames) {
  const sourcePath = path.join(sourceDirectory, fontName);
  const font = fs.readFileSync(sourcePath);
  const hash = crypto.createHash('md5').update(font).digest('hex');
  const outputName = `${path.basename(fontName, '.ttf')}.${hash}.ttf`;
  fs.writeFileSync(path.join(outputDirectory, outputName), font);
}
