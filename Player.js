import { Platform } from "react-native";

export const defaultOptions = Object.freeze({
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping/looping (or undefined for full length). This is NOT sustain
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1,
  // Sound envelope
  attack: 0, // the time taken for initial run-up of level from nil to peak, beginning when the key is pressed.
  release: 0, // time taken for the level to decay from the sustain level to zero after the key is released
});

const playSound = (sound, options) => {
  const _play = () => {
    sound.setVolume(options.gain);
    sound.setNumberOfLoops(options.loop ? -1 : 1);
    sound.setCurrentTime(options.clip);
    sound.setSpeed(options.speed);

    if (Platform.OS === 'ios') {
      sound.setPan(options.pan);
    }

    sound.play((success) => {
      if (!success && __DEV__) {
        console.warn(note + ': Playback failed due to audio decoding errors.');
      }
    });
  
    if (options.duration && !isNaN(options.duration)) {
      // Stop the sound or reloop after duration
      setTimeout(() => {
        if (sound.isPlaying()) {
          if (options.loop) {
            sound.setCurrentTime(options.clip);
          } else {
            sound.stop();
          }+
        }
      }, options.duration);
    }
  }

  if (sound.isPlaying()) {
    // Stop the sound and rewind first before attempting play
    sound.stop(_play);
  } else {
    _play();
  }
}

const stopSound = (sound, options) => {
  if (!sound || !sound.isPlaying()) {
    return; // nothing to stop
  }

  sound.stop();
}

// Main API for playing sounds (this class is instantiated by SoundFount.instrument() with loaded Sounds)
export default class Player {
  constructor(instrument, sounds, options = defaultOptions) {
    this.instrument = instrument;
    this.sounds = sounds;
    this.playerOptions = {
      ...defaultOptions,
      ...options
    }
  }

  // Same as start(), without the time
  play(note, options) {
    this.start(note, undefined, options);
  }

  start(note, when = 0, options) {
    if (this.sounds.hasOwnProperty(note)) {
      const sound = this.sounds[note];
      options = {
        ...this.playerOptions,
        ...options // override player's default options
      }
      if (when > 0) {
        setTimeout(() => playSound(sound, options), when);
      } else {
        playSound(sound, options);
      }
    } else if (__DEV__) {
      console.warn('Failed to play. Note is not mapped to sound: ' + note);
    }
    return this;
  }

  stop(note, when = 0, options) {
    if (this.sounds.hasOwnProperty(note)) {
      const sound = this.sounds[note];
      options = {
        ...this.playerOptions,
        ...options // override player's default options
      }
      if (when > 0) {
        setTimeout(() => stopSound(sound, options), when);
      } else {
        stopSound(sound, options);
      }
    } else if (__DEV__) {
      console.warn('Failed to stop. Note is not mapped to sound: ' + note);
    }
    return this;
  }

  destroy() {
    Object.values(this.sounds).forEach(sound => sound.release());
  }
}