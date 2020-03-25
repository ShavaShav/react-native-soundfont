const fs = require('fs');

const compressedRAW = 'android/src/main/res/raw.7z';
const androidRAWDir = 'android/src/main/res/raw/';

if (fs.existsSync(androidRAWDir)) {
  process.stdout.write('react-native-soundfont: Sounds unpacked to ' + __dirname + '/' + androidRAWDir + '.\n');
} else {
  const sevenBin = require('7zip-bin');
  const sevenZip = require('node-7z');
  process.stdout.write('react-native-soundfont: Unpacking sounds to ' +  __dirname + '/' + androidRAWDir + '...');
  let success = true;
  sevenZip.extract(compressedRAW, androidRAWDir, {
    $bin: sevenBin.path7za
  }).on('error', err => {
    success = false;
    process.stdout.write('\n'+err+'\n\n');
  }).on('end', () => {
    if (success)
      process.stdout.write(' OK.\n\n');
  })
}
