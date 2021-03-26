# react-native-soundfont

[![NPM](https://nodei.co/npm/react-native-soundfont.png?compact=true)](https://nodei.co/npm/react-native-soundfont/)

## Getting started

`$ npm install react-native-soundfont react-native-sound --save`

## Usage

#### Example
```javascript
import SoundFont from 'react-native-soundfont';

...
SoundFont.instrument('violin', {
  notes: ['C4', 'A3'] // only load 'C4' and 'A3' for speed
  gain: 1,
  release: 0.5 // release after half second
}).then(violin => {
  violin.play('C4', {gain: 0.5}); // Play 'C4' immediately at half gain
  violen.start('A3', 1000); // Start 'A3' after a second
  violin.stop('A3', 2000); // Stop after a second
  violin.destroy(); // release the Sound resources used (should be called, eventually)
});
...
```

### Functions

The main API can be imported directly like `import { instrument } from 'react-native-soundfont'`:

| Function | Arguments       | Returns | Description |
|----------|-----------------|---------|-----------------------------|
| instrument | name, options | Promise\<Player\> | Initializes player for specific instrument |

##### Options:
```javascript
{
  notes: ['A3','B3'], // list of all valid notes (there is a matching sound file). Defaults to all notes (A0->G8)
  path: Sound.MAIN_BUNDLE, // path to sound files. defaults to res/raw (assumes imported react-native-sound as Sound)
  ext: 'mp3', // sound file extension

  // Global Player options (applies to all start, stop functions unless overridden)
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping (or undefined for full length)
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1 // speed of playback
  release: undefined, // time taken for the level to decay to zero after key is released (or undefined to play rest of sound)
}
```
#### Player

The following can be invoked on the `Player` object that is returned by `instrument()`

| Function | Arguments       | Returns | Description |
|----------|-----------------|---------|-----------------------------|
| start | note, when, options | Player | Starts note playback in `when` milliseconds |
| play | note, options | Player | Starts note now |
| stop | note, when, options | Player | Stops note playback in `when` milliseconds |
| destroy | | | Releases sound files for player |


##### Options:
```javascript
{
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping (or undefined for full length)
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1 // speed of playback
  release: undefined, // time taken for the level to decay to zero after key is released (or undefined to play rest of sound)
}
```

### Adding sounds

By default, MP3 sounds will be loaded from `android/app/src/main/res/raw`. You may specify a different directory using the `path` option for `intrument()`:

ex: Load from the "Document" directory (using react-native-sound path macros for convenience)
```
import Sound from 'react-native-sound';
...
Soundfont.instrument('acoustic_piano` { path: Sound.DOCUMENT });
```

MP3 filenames must be in the following format for the player to recognize them:

`<instrument>_<note>.mp3`

For example: `violin_C4.mp3`

Some prepacked libraries can be [found here](https://github.com/ShavaShav/react-native-soundfonts).


## To Do
- iOS support
- Implement an artifical sound envelope?
- ~~Custom sound fonts (mp3 libs, sfz or midi.js?)~~
