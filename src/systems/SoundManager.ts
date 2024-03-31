import { SystemComponent } from './SystemComponent';

/**
 * Manages background sounds and sounds effects
 */
export class SoundManager extends SystemComponent {
  audio: HTMLAudioElement;
  userInteraction: boolean;

  playMusic(music: string): void {
    console.warn('sound manager not implemented.');
  }

  reset(): void {}

  UserReady() {
    if (!this.userInteraction && this.audio) {
      if (this.audio.isConnected) {
        //this.audio.play();
        //this.audio.loop = true;
        //this.userInteraction = true;
      }
    }
  }
}
