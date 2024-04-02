import { Engine } from '../core/Engine';
import { Curve } from '../math/Curve';
import vec2 from '../math/vec2';
import vec4 from '../math/vec4';
import { SystemComponent } from './SystemComponent';

/**
 * Runs a simple loading screen animation using the textManager
 */
export class LoadingManager extends SystemComponent {
  private curve: Curve;
  private text: string[] = [' ', '|', '/', '-', '\\'];

  /**
   * Is the loading screen running
   */
  public get isRunning(): boolean {
    return this.curve.isRunning();
  }

  /**
   * constructor
   * @param eng
   */
  constructor(eng: Engine) {
    super(eng);
    this.curve = new Curve();
    this.curve.repeat(-1).points([
      { p: 0, t: 0 },
      { p: 1, t: 500 },
      { p: 2, t: 1000 },
      { p: 3, t: 1500 },
      { p: 4, t: 1500 },
      { p: 4, t: 2000 },
    ]);
  }

  /**
   * Draw the loading animation
   * @param dt
   */
  draw(dt: number): void {
    if (!this.isRunning) {
      this.curve.start(true);
    }
    this.curve.update(dt);
    if (this.curve.getValue() > 0) {
      this.eng.textManager.setTextBlock({
        id: 'Loading',
        text: 'Loading: ' + this.text[this.curve.getValue()],
        position: new vec2([100, 100]),
        color: new vec4([1, 0.0, 0.0, 1.0]),
        depth: -1,
        scale: 0.8,
      });
    }
  }

  reset(): void {
    this.curve.pause();
    this.eng.textManager.hideText('Loading');
  }
}
