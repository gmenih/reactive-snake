import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {Drawable, Controllable} from './domain';
import {GameState} from './domain';
import {switchMap, tap} from 'rxjs/operators';
import {Keyboard} from '../controls/keyboard';

interface MenuOption {
    title: string;
    action: GameState;
}

/**
 * TODO:
 * Draw Menu options
 * Export subscription that allows triggering of actions outside
 * Allow selecting stuff
 * Maybe Have MenuOptions be enum?
 */
export class Menu implements Drawable, Controllable {

    private $selectedIndex: BehaviorSubject<number> = new BehaviorSubject(0);
    private $selection: Subject<GameState> = new Subject();

    private subscriptions: Subscription[] = [];

    private options: MenuOption[] = [
        {title: 'New Game', action: GameState.Running},
        {title: 'Settings', action: GameState.Settings},
        {title: 'Scoreboard', action: GameState.Scoreboard},
        {title: 'Exit', action: GameState.GameOver},
    ];

    public get emittedState (): Observable<GameState> {
        return this.$selection;
    }

    public selectNext (): void {
        const value: number = this.$selectedIndex.value;
        if (value >= this.options.length - 1) {
            return this.$selectedIndex.next(0);
        }
        this.$selectedIndex.next(value + 1);
    }


    public draw (context: CanvasRenderingContext2D): Observable<number> {
        const topOffset: number = 160;
        return this.$selectedIndex.pipe(
            tap((index: number): void => {
                context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                this.drawTitle(context);
                context.textAlign = "center";
                context.textBaseline = "top";
                context.font = "bold 25px Verdana";
                this.options.forEach((option: MenuOption, i: number): void => {
                    if (i === index) {
                        context.beginPath();
                        context.fillStyle = "#12ccff";
                        context.fillRect(70, (topOffset + (35 * i)) - 5, (400 - 140), 40);
                        context.closePath();
                        context.fillStyle = "#fff";
                        context.fillText(option.title.toUpperCase(), 200, topOffset + (35 * i));
                    } else {
                        context.fillText(option.title.toUpperCase(), 200, topOffset + (35 * i));
                    }
                    context.fillStyle = "#000";
                });
            }),
        );
    }

    public setControls (keyboard: Keyboard): void {
        this.subscriptions.push(
            keyboard.onMulti('S', 'ArrowDown').subscribe(() => this.selectNext()),
            keyboard.onMulti('W', 'ArrowUp').subscribe(() => this.selectPrevious()),
            keyboard.onRelease('Enter').subscribe(() => this.emitSelection()),
        );
    }

    public unsetControls (): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private drawTitle (context: CanvasRenderingContext2D): void {

    }

    private selectPrevious (): void {
        const value: number = this.$selectedIndex.value;
        if (value <= 0) {
            return this.$selectedIndex.next(this.options.length - 1);
        }
        this.$selectedIndex.next(value - 1);
    }

    private emitSelection (): void {
        this.$selection.next(this.options[this.$selectedIndex.value].action);
    }
}
