// Spatial Web Audio Synthesizer for Estate Empire (Zero External Dependencies)

type SoundType = 'dice' | 'move' | 'purchase' | 'rent' | 'card' | 'jail' | 'victory' | 'click' | 'error' | 'cash' | 'auction';

interface SoundConfig {
  enabled: boolean;
  volume: number;
}

class SoundManager {
  private config: SoundConfig = { enabled: true, volume: 0.5 };
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  play(type: SoundType): void {
    if (!this.config.enabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.config.volume * 0.4, now);
      masterGain.connect(ctx.destination);

      switch (type) {
        case 'dice': {
          // Rolling noise tumble effect
          for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150 + Math.random() * 250, now + i * 0.05);
            gain.gain.setValueAtTime(0.3, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.08);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.08);
          }
          break;
        }

        case 'move': {
          // Token step click sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'cash':
        case 'purchase': {
          // Cash register double ding chime
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(987.77, now); // B5
          osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(masterGain);

          osc1.start(now);
          osc1.stop(now + 0.35);
          osc2.start(now + 0.08);
          osc2.stop(now + 0.35);
          break;
        }

        case 'rent': {
          // Rent payment coin drop tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(220, now + 0.15);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'jail': {
          // Low heavy metal lock thud
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(120, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'victory': {
          // Arpeggio fanfare
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.12);
            gain.gain.setValueAtTime(0.3, now + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.3);
          });
          break;
        }

        case 'click': {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'auction': {
          // Gavel hammer tap sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        default:
          break;
      }
    } catch (e) {
      // Ignore Web Audio errors if audio context blocked before user gesture
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
