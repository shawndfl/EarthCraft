import rect from '../math/rect';
import vec2 from '../math/vec2';
import vec3 from '../math/vec3';

/**
 * This is the scene data that will be used in code.
 */
export class SceneData {
  size: vec3;
  tileSheetUrl: string;

  constructor(sceneData: string) {}

  reset(): void {}

  serialize(): string {
    const str = JSON.stringify(this, (_, value) => {
      if (value instanceof vec2) {
        return [value.x, value.y];
      } else if (value instanceof rect) {
        return [value.left, value.width, value.top, value.height];
      } else if (value instanceof Map) {
        return Array.from(value.entries());
      } else {
        return value;
      }
    });
    return str;
  }
}
