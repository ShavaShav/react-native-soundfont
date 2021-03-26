import { Platform } from "react-native";

// TODO: Convert this to use typescript

export const defaultOptions = Object.freeze({
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping/looping (or undefined for full length). This is NOT sustain
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1,
  // Since this module uses pre-rendered sounds, we dont have much control over the sound envelope, and probably wouldn't
  // want to do it artificially (ex. looping a small section for sustain will sound weird depending on the particular sound loaded). 
  // We'll implement a 'release' for convenience though as it is simple and should work across sounds pretty much the same:
  release: undefined, // time taken for the level to decay to zero after key is released (or undefined to play rest of sound)
});

// Main API for playing sounds (this class is instantiated by SoundFount.instrument() with loaded Sounds)
export default class Player {
  constructor(instrument, sounds, options = defaultOptions) {
    this.instrument = instrument;
    this.sounds = sounds;
    this.decayTimers = [];
    this.playerOptions = {
      ...defaultOptions,
      ...options
    }
  }

  // Pseudo-private methods

  // Decreases sound volume over duration. Returns a 'Timer' so can be canceled by caller
  _decaySound(sound, note, duration, interval = 0.1, gainDecrement) {
    const currentVolume = sound.getVolume();
    if (duration <= 0 || currentVolume <= 0) {
      sound.stop();
      return;
    }
    if (!gainDecrement) {
      // Calculate gain decrement so that sound will decay linearly to duration
      gainDecrement = currentVolume / (duration / interval);
    }
    sound.setVolume(currentVolume - gainDecrement);
  
    // Repeat this decay function with decreased duration after interval
    this.decayTimers[note] = setTimeout(() => this._decaySound(sound, note, duration - interval, interval, gainDecrement), interval * 1000);
  }

  _playSound(note, options) {
    const sound = this.sounds[note];
    const _play = () => {
      if (this.decayTimers.hasOwnProperty(note)) {
        // Stop decay of note
        clearTimeout(this.decayTimers[note]);
      }
      sound.setVolume(options.gain);
      sound.setCurrentTime(options.clip);
      sound.setSpeed(options.speed);
    
      if (options.loop) {
        sound.setNumberOfLoops(-1);
      }
  
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
              this._stopSound(sound, options);
            }
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

  _stopSound(note, options) {
    const sound = this.sounds[note];
    if (isNaN(options.release)) {
      sound.stop();
    } else {
      this._decaySound(sound, note, options.release);
    }
  }

  // Public methods

  destroy() {
    Object.values(this.sounds).forEach(sound => sound.release());
  }

  // Same as start(), without the time
  play(note, options) {
    return this.start(note, undefined, options);
  }

  start(note, when = 0, options) {
    if (!this.sounds.hasOwnProperty(note) || !this.sounds[note]) {
      if (__DEV__) {
        console.warn('Failed to play. Note is not mapped to sound: ' + note);
      }
      return;
    }

    options = {
      ...this.playerOptions,
      ...options // override defaults
    }
    if (when > 0) {
      setTimeout(() => this._playSound(note, options), when);
    } else {
      this._playSound(note, options);
    }
    return this;
  }

  stop(note, when = 0, options) {
    if (!this.sounds.hasOwnProperty(note) || !this.sounds[note]) {
      if (__DEV__) {
        console.warn('Failed to stop. Note is not mapped to sound: ' + note);
      }
      return;
    }

    options = {
      ...this.playerOptions,
      ...options // override player's default options
    }
    if (when > 0) {
      setTimeout(() => this._stopSound(note, options), when);
    } else {
      this._stopSound(note, options);
    }
    return this;
  }
}