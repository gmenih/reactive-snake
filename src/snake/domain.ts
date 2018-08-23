import {Observable, Subscription} from 'rxjs';
import {Keyboard} from '../controls/keyboard';

export interface Drawable {
    draw (context: CanvasRenderingContext2D): Observable<unknown>;
}

export interface Controllable {
    setControls (keyboard: Keyboard): void;
    unsetControls (): void;
}


export enum GameState {
    Menu,
    NewGame,
    Running,
    Paused,
    GameOver,
    Scoreboard,
    Settings,
};

export interface Point2D {
    x: number;
    y: number;
}

export class Direction {
    static Up: Point2D = {x: 0, y: -1};
    static Down: Point2D = {x: 0, y: 1};
    static Left: Point2D = {x: -1, y: 0};
    static Right: Point2D = {x: 1, y: 0};
}
