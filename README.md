# react-native-soundfont

## Getting started

`$ npm install react-native-soundfont react-native-sound --save`

## Usage

```javascript
import SoundFont from 'react-native-soundfont';

...
const Font = SoundFont.Font; // Enum of possible fonts
const instrumentNames = SoundFont.getInstrumentNames(Font.Fluid); // Array of instrument names for FluidR3_GM font
SoundFont.instrument('violin', {
  font: Font.Fluid,
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

[Fluid (the only installed soundfont by default) instrument names can be found here.](https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/names.json)

Font will default to `SoundFont.fonts.Fluid` and Instrument to `"acoustic_grand_piano"` if undefined.
For example, the following one liner will play 'C4' with the Fluid piano once it is loaded

```javascript
SoundFont.instrument().then(sound => sound.play('C4'));
```

`instrument(name, options)`, `play(note, options)` and `start(note, when, options)` all take the following possible `options` as their last argument:
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

## To Do
- iOS support
- Implement attack/release options
- Impement decay/sustain options (?)
- Custom sound fonts (mp3 libs, sfz or midi.js?)
