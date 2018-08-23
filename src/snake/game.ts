import {Subject, BehaviorSubject, of, Observable} from "rxjs";
import {createCanvasContext} from "../helpers/canvas";
import {Menu} from './menu';
import {GameState} from './domain';
import {switchMap, tap, catchError} from 'rxjs/operators';
import {Keyboard} from '../controls/keyboard';
import {Snake} from './snake';
import {DEFAULT_CELL_SIZE} from '../config';

/**
 * ToDo:
 * Have State
 * Subscribe on State and draw appropriate screen (+ register appropriate controls for each)
 * Initialize Snake
 * Initialize Food Dispenser
 * Initialize Menu
 * When Paused; draw Menu
 * When Running; draw Snake
 * When GameOver; draw GameOver + move to Menu
*/

 export class Game {
    private $state: BehaviorSubject<GameState> = new BehaviorSubject(GameState.Menu);

    // TBD
    private snake: Snake;
    private dispenser: unknown;
    private menu: Menu;
    private keyboard: Keyboard;

    // Core stuff
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private draw: unknown;

    constructor (rows: number, cols: number) {
        const w: number = rows * DEFAULT_CELL_SIZE;
        const h: number = rows * DEFAULT_CELL_SIZE;
        const [canvas, context]: [HTMLCanvasElement, CanvasRenderingContext2D] = createCanvasContext(w, h);
        this.canvas = canvas;
        this.context = context;
        this.menu = new Menu();
        this.keyboard = new Keyboard(document.body);
        this.snake = new Snake(1, 1);

        this.menu.emittedState.subscribe((state: GameState) => {
            this.$state.next(state);
        });
    }

    public start (): Observable<any> {
        console.log('Starting game...');
        return this.$state.pipe(
            tap((state: GameState): void => console.log(`Game state changed to ${GameState[state]}`)),
            tap(() => {
                this.menu.unsetControls();
                this.snake.unsetControls();
            }),
            switchMap((state: GameState): Observable<any> => {
                switch (state) {
                    case GameState.Menu:
                        this.menu.setControls(this.keyboard);
                        return this.menu.draw(this.context);
                    case GameState.NewGame:
                        return this.setNewGame();
                    case GameState.Running:
                        this.snake.setControls(this.keyboard);
                        return this.snake.draw(this.context)
                            .pipe(
                                catchError((err: Error): Observable<any> => {
                                    console.error(err.message);
                                    this.$state.next(GameState.GameOver);
                                    return of(undefined);
                                }),
                            );
                    default:
                        console.error('Whoops! This state does not exist yet!', GameState[state]);
                        return of();
                }
            }),
        );
    }

    public appendCanvas (src: HTMLElement): void {
        src.appendChild(this.canvas);
    }

    private setNewGame (): Observable<GameState> {
        // this.snake.kill();
        this.$state.next(GameState.Running);
        return this.$state;
    }

 }
