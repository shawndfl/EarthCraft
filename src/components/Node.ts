import { Component } from './Component';
import mxt4 from '../math/mat4';
import quat from '../math/quat';
import vec3 from '../math/vec3';
import { Engine } from '../core/Engine';
import mat4 from '../math/mat4';

/**
 * A base scene graph node
 */
export class Node extends Component {
  private _matrix: mxt4;
  private _worldMatrix: mxt4;
  private _position: vec3;
  private _rotation: quat;
  private _scale: vec3;

  private matrixWorldNeedsUpdate: boolean;
  visible: boolean;
  private _frustumCulled = true;
  renderOrder = 0;

  constructor(eng: Engine) {
    super(eng);
    this._matrix = mat4.identity;
    this.visible = true;
    this.matrixWorldNeedsUpdate = true;
    this._worldMatrix = mat4.identity;
    this._scale = vec3.one;
    this._position = new vec3();
    this._rotation = quat.identity;
    this.renderOrder = 0;
  }
}
