import { Platform } from "react-native";

export const defaultOptions = Object.freeze({
  gain: 1, // (volume)
  clip: 0, // second into sound to seek to before playing
  duration: undefined, // length to play before stopping (or undefined for full length)
  loop: false, // loop sound while key is pressed
  pan: 0.5, // left (0) to right (1)
  speed: 1,
  attack: 0, // the time taken for initial run-up of level from nil to peak, beginning when the key is pressed.
  release: 0, // time taken for the level to decay from the sustain level to zero after the key is released
});

const playSound = (sound, duration) => {
  if (duration && !isNaN) {
    // Stop the sound after duration
    setTimeout(sound.stop, duration);
  }
  sound.play((success) => {
    if (!success && __DEV__) {
      console.warn(note + ': Playback failed due to audio decoding errors.');
    }
  });
}

// Main API for playing sounds (this class is instantiated by SoundFount.instrument() with loaded Sounds)
export default class Player {
  constructor(instrument, sounds, options = defaultOptions) {
    this.instrument = instrument;
    this.sounds = sounds;
    this.defaultOptions = {
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
        ...this.defaultOptions,
        ...options // override defaults
      }

      sound.setVolume(options.gain);
      sound.setNumberOfLoops(options.loop ? -1 : 1);
      sound.setCurrentTime(options.clip);
      sound.setSpeed(options.speed);

      if (Platform.OS === 'ios')
        sound.setPan(options.pan);

      if (when > 0) {
        this.setTimeout(() => playSound(sound, options.duration), when);
      } else {
        playSound(sound, options.duration);
      }
    } else if (__DEV__) {
      console.warn('Failed to play. Note is not mapped to sound: ' + note);
    }
    return this;
  }

  stop(note, when = 0) {
    if (this.sounds.hasOwnProperty(note)) {
      if (when > 0) {
        this.setTimeout(this.sounds[note].stop, when);
      } else {
        this.sounds[note].stop();
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