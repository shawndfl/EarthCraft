import { Component } from '../../components/Component';
import { Engine } from '../../core/Engine';
import { HelloEngine } from '../HelloEngine';

export class GameComponent extends Component {
  get eng(): HelloEngine {
    return this.eng;
  }
  constructor(eng: HelloEngine) {
    super(eng);
  }
}
