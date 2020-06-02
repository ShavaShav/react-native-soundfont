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
  notes: _notesWithOctaves
});

Sound.setCategory('Playback');

// This function is outside of 'Player' so as to not be exposed
const loadSound = (sounds, font, instrument, name) => {
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
  instrument: (font, instrument, options) => {
    if (!font) return Promise.reject('instrument() requires font name as 1st argument.');
    if (!instrument) return Promise.reject('instrument() requires instrument name as 2nd argument.');
    options = { ...defaultInstrumentOptions, ...options };
    const { notes, ...playerOptions } = options; 
    const sounds = {};
    return allSettled(
      notes.map(note => loadSound(sounds, font, instrument, note))
    ).then(() => new Player(instrument, sounds, playerOptions));
  },
};

