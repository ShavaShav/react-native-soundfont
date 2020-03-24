// import { NativeModules } from 'react-native';

// const { Soundfont } = NativeModules;

// export default Soundfont;

import allSettled from 'promise.allsettled';
import Sound from 'react-native-sound';

import Fonts, {getInstrumentNames} from './fonts';
import Player from './Player';

const defaultFont = Fonts.Fluid;
const defaultInstrument = 'acoustic_grand_piano';

// List of possible notes for soundfonts
const _notes = [ 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G' ];
const _notesWithOctaves = [];
_notes.forEach(note => {
  if (note === 'A' || note === 'Bb' || note === 'B')
    _notesWithOctaves.push(`${note}0`); // A0, Bb0 and B0 are the only 0-octave notes with samples
  for (let octave = 1; octave < 8; octave++) {
    _notesWithOctaves.push(`${note}${octave}`);
  }
});

Sound.setCategory('Playback');

// This function is outside of 'Player' so as to not be exposed
const loadSound = (sounds, font = defaultFont, instrument = defaultInstrument, name, options) => {
  return new Promise((resolve, reject) => {
    // 'new Sound' is very expensive and blocks resolve. Wrapping in setTimeout(cb, 0) allows renders in between
    setTimeout(() => {
      sounds[name] = new Sound(`${font}_${instrument}_${name.toLowerCase()}.mp3`, Sound.MAIN_BUNDLE, error => {
          if (error) {
            if (__DEV__) {
              console.warn('Failed to load "' + name + '" (' + instrument + '): ' + JSON.stringify(error));
            }
            reject(error);
          } else {
            resolve(sounds[name]);
          }
      });
    }, 0);
  });
};

export default {
  fonts: Fonts,
  getInstrumentNames: (font = defaultFont) => {
    return getInstrumentNames(font);
  },
  instrument: (name = defaultInstrument, options = {}) => {
    const sounds = {};
    const notes = options.notes || _notesWithOctaves;
    return allSettled(
      notes.map(note => loadSound(sounds, options.font, name, note))
    ).then(() => new Player(name, sounds));
  },
};

