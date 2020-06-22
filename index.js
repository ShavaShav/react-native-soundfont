import allSettled from 'promise.allsettled';
import Sound from 'react-native-sound';

import Player from './Player';

// List of possible notes for soundfonts
const _notes = [ 'Ab', 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G' ];
const _notesWithOctaves = [ 'A0', 'Bb0', 'B0' ]; // A0, Bb0 and B0 are the only 0-octave notes with samples
_notes.forEach(note => {
  for (let octave = 1; octave < 8; octave++) {
    _notesWithOctaves.push(`${note}${octave}`);
  }
});

const defaultInstrumentOptions = Object.freeze({
  notes: _notesWithOctaves,
  path: Sound.MAIN_BUNDLE // defaults to res/raw
});

Sound.setCategory('Playback');

// This function is outside of 'Player' so as to not be exposed
const loadSound = (sounds, instrument, name, path) => {
  return new Promise((resolve, reject) => {
    // 'new Sound' is very expensive and blocks resolve. Wrapping in setTimeout(cb, 0) allows renders in between
    setTimeout(() => {
      sounds[name] = new Sound(`${instrument}_${name.toLowerCase()}.mp3`, path, error => {
        if (error) {
          if (__DEV__) {
            console.warn(`Failed to load "${name}" (${instrument}) from "${path}": ${JSON.stringify(error)}`);
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
  instrument: (instrument, options) => {
    if (!instrument) return Promise.reject('instrument() requires instrument name as first argument.');
    options = { ...defaultInstrumentOptions, ...options };
    const { notes, path, ...playerOptions } = options; 
    const sounds = {};
    return allSettled(
      notes.map(note => loadSound(sounds, instrument, note, path))
    ).then(() => new Player(instrument, sounds, playerOptions));
  },
};
