# react-native-soundfont

## Getting started

`$ npm install ShavaShav/react-native-soundfont --save`

## Usage

In it's most basic form (instrument names in `fonts.js`):

```javascript
import Soundfont from 'react-native-soundfont';

...
SoundFont.instrument('acoustic_grand_piano').then(piano => {
    piano.play('C4');
});
...
```

## To Do
- iOS support
- Intrument options
- Player options
- Custom sound font (mp3 libs)
- SFZ support