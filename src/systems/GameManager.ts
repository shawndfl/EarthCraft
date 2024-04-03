import { Engine } from '../core/Engine';
import { GameData } from '../data/GameData';
import { SystemComponent } from './SystemComponent';

/** Key for local storage */
const localStorageKey = 'EarthQuest';

/**
 * This is the main class that manages game state
 */
export class GameManager extends SystemComponent {
  data: GameData;
  private _timeCounter: number;

  constructor(eng: Engine) {
    super(eng);
    this._timeCounter = 0;
  }

  /**
   * Load game data from local storage
   */
  initialize() {
    if (localStorage.getItem(localStorageKey)) {
      this.data = JSON.parse(localStorage[localStorageKey]);
    } else {
      this.data = new GameData();
    }
  }

  /**
   * Save game data in local storage
   */
  save() {
    localStorage[localStorageKey] = JSON.stringify(this.data);
  }

  /**
   * Update the game time
   * @param dt
   */
  update(dt: number) {
    const t = this.data.player.timePlayed;
    this._timeCounter += dt;
    if (this._timeCounter > 1000) {
      t.s++;
      this._timeCounter = this._timeCounter % 1000;
      if (t.s >= 60) {
        t.s -= 60;
        t.m++;
      }

      if (t.m >= 60) {
        t.m -= 60;
        t.h++;
      }
    }
  }

  /**
   * Loading a new scene
   */
  reset(): void {
    //NOP
  }
}
