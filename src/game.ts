import { Draw } from "./modules/draw";
import {BehaviorSubject, fromEvent} from "rxjs";
import {first} from "rxjs/operators";

const CELL_SIZE: number = 10;

export enum GameState {
    Paused,
    Running,
    GameOver,
}

export class Game {

    public draw: Draw;
    public $state: BehaviorSubject<GameState> = new BehaviorSubject(GameState.Paused);
    private canvas: HTMLCanvasElement;

    constructor(cols: number, rows: number) {
        const width: number = CELL_SIZE * cols;
        const height: number = CELL_SIZE * rows;
        this.canvas = Object.assign(document.createElement('canvas'), {
            width,
            height,
            style: `width: ${width}px; height: ${height}px`,
        });
        const context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Do you even have a browser?');
        }
        this.draw = new Draw(context, CELL_SIZE);
    }

    public gameOver (score: number): void {
        this.draw.clear()
            .text(`wasted with ${score}`, this.canvas.width / 2,  (this.canvas.height / 2) - 24);


    }
    inject (src: HTMLElement): void {
        src.appendChild(this.canvas);
        fromEvent(this.canvas, 'click')
            .subscribe(() => {
                this.$state.next(GameState.Running);
            });

        fromEvent(this.canvas, 'blur')
            .subscribe(() => {
                this.$state.next(GameState.Paused);
            })
    }

}
