# react-native-soundfont

[![NPM](https://nodei.co/npm/react-native-soundfont.png?compact=true)](https://nodei.co/npm/react-native-soundfont/)

## Getting started

`$ npm install react-native-soundfont react-native-sound --save`

## Usage

```javascript
import SoundFont from 'react-native-soundfont';

...
SoundFont.instrument('fluidr3_gm', 'violin', {
  notes: ['C4', 'A3'] // only load 'C4' and 'A3' for speed
  gain: 1,
}).then(violin => {
  violin.play('C4', {gain: 0.5}); // Play 'C4' immediately at half gain
  violen.start('A3', 1000); // Start 'A3' after a second
  violin.stop('A3', 2000); // Stop after a second
  violin.destroy(); // release the Sound resources used (should be called, eventually)
});
...
```

`instrument(font, instrument, options)`, `play(note, options)` and `start(note, when, options)` all take the following possible `options` as their last argument:
```javascript
{
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping (or undefined for full length)
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1 // speed of playback
}
```

### Installing fonts

MP3 sounds should be placed in `android/app/src/main/res/raw`, with filenames in the format:

`<font>_<instrument>_<note>.mp3`

For example: `fluidr3_gm_violin_C4.mp3`

Some prepacked libraries can be [found here](https://github.com/ShavaShav/react-native-soundfonts).

## To Do
- iOS support
- Implement attack/release options
- Impement decay/sustain options (?)
- Custom sound fonts (mp3 libs, sfz or midi.js?)
