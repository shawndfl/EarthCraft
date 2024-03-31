import { Component } from '../components/Component';

/**
 * System component with a reset to handle scenes loading.
 */
export abstract class SystemComponent extends Component {
  /**
   * Resets the system component when a new scene is loaded
   */
  abstract reset(): void;
}
