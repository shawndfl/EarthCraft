import { Emitter, EmitterArgs } from '../particle/Emitter';
import { Engine } from '../core/Engine';
import { SpriteInstanceShader } from '../shaders/SpriteInstanceShader';
import { SystemComponent } from './SystemComponent';

export class ParticleManager extends SystemComponent {
  private _shader: SpriteInstanceShader;

  emitter: Map<string, Emitter>;

  get shader(): SpriteInstanceShader {
    return this._shader;
  }

  constructor(eng: Engine) {
    super(eng);
    this.emitter = new Map<string, Emitter>();
    this._shader = new SpriteInstanceShader(eng.gl, 'instancing');
  }

  /**
   * Add an emitter
   * @param name
   * @param options
   */
  setEmitter(name: string, options: EmitterArgs): Emitter {
    let emitter = this.emitter.get(name);
    if (!emitter) {
      emitter = new Emitter(this.eng, name);
      this.emitter.set(name, emitter);
    }
    emitter.initialize(options);
    return emitter;
  }

  /**
   * Remove the emitter
   * @param name
   */
  removeEmitter(name: string): void {
    let emitter = this.emitter.get(name);
    if (emitter) {
      emitter.dispose();
      this.emitter.delete(name);
    }
  }

  initialize(): void {}

  reset(): void {
    this.emitter.clear();
  }

  update(dt: number): void {
    this.emitter.forEach((e) => e.update(dt));
  }
}
