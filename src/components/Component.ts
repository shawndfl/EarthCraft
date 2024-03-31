import { Engine } from '../core/Engine';

/**
 * A component is something that is part of the game engine and has a reference
 * to the game engine and all the subsystems like text managers, collision and raise events.
 */
export abstract class Component {
  /**
   * The type of component this is. This is used in deserializing
   */
  get type(): string {
    return 'component';
  }

  /**
   * returns a unique id of this component
   */
  get id(): string {
    return this._id;
  }

  /**
   * Give components easier access to gl
   */
  get gl(): WebGL2RenderingContext {
    return this.eng.gl;
  }

  /**
   * Gets the engine
   */
  get eng(): Engine {
    return this._eng;
  }

  constructor(
    private readonly _eng: Engine,
    protected _id: string = _eng.random.getUuid()
  ) {}

  /**
   * Called before drawing
   * @param dt
   */
  update(dt: number): void {}

  /**
   * Called to draw
   * @param dt
   */
  draw(dt: number): void {}

  /**
   * Called after everything has been drawn
   * @param dt
   */
  postDraw(dt: number): void {}

  serialize(): any {
    return {
      id: this.id,
      type: this.type,
    };
  }

  deserialize(data: any): void {
    this._id = data.id;
  }
}
