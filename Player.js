// Main API for playing sounds (this class is instantiated by SoundFount.instrument() with loaded Sounds)
export default class Player {
  constructor(instrument, sounds) {
    this.sounds = sounds;
    this.instrument = instrument;
  }

  play(name, when, options) {
    if (this.sounds.hasOwnProperty(name)) {
      this.sounds[name].play((success) => {
        if (!success && __DEV__) {
          console.warn(name + ': Playback failed due to audio decoding errors.');
        }
      });
    } else if (__DEV__) {
      console.warn('Failed to play. Note is not mapped to sound: ' + name);
    }
  }

  stop(name, when) {
    if (this.sounds.hasOwnProperty(name)) {
      this.sounds[name].stop();
    } else if (__DEV__) {
      console.warn('Failed to stop. Note is not mapped to sound: ' + name);
    }
  }
}