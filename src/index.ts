import {Game} from './snake/game';
import './styles/main.scss';
/**
 * ToDo:
 * Generate Game
 * Inject Canvas
 * Set Initial State
 * Start Rendering
 */

const game = new Game(20, 20);

game.appendCanvas(document.body);

game.start().subscribe();
