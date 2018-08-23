import {Drawable, Direction, Point2D, Controllable} from './domain';
import {Observable, BehaviorSubject, interval, zip, Subscription} from 'rxjs';
import {switchMap, tap, map} from 'rxjs/operators';
import {Keyboard} from '../controls/keyboard';
import {DEFAULT_CELL_SIZE} from '../config';

const VELOCITY_UPDATE_INTERVAL: number = 500;
const STARTING_LENGTH: number = 3;
const NO_EMIT: BehaviorSubject<undefined> = new BehaviorSubject(undefined);

export class Snake implements Drawable, Controllable {
    private $length: BehaviorSubject<number> = new BehaviorSubject(STARTING_LENGTH);
    private $direction: BehaviorSubject<Point2D> = new BehaviorSubject(Direction.Right);
    private $history: BehaviorSubject<Point2D[]> = new BehaviorSubject(<Point2D[]>[]);

    private $location: BehaviorSubject<Point2D>;

    private subscriptions: Subscription[] = [];

    constructor(x: number, y: number) {
        this.$location = new BehaviorSubject({x, y});
    }

    public eat(): void {
        this.$length.next(this.$length.value + 1);
    }

    public draw(context: CanvasRenderingContext2D): Observable<any> {
        console.log('Beginning to draw snake...');
        return this.$length
            .pipe(
                switchMap((length: number): Observable<number> => interval(Snake.velocityInterval(length))),
                switchMap((): Observable<[Point2D, Point2D, undefined]> => zip(
                    this.$location,
                    this.$direction,

                    NO_EMIT,
                )),
                map(([location, direction]: Point2D[]): Point2D => ({
                    x: location.x + direction.x,
                    y: location.y + direction.y,
                })),
                map((location: Point2D): Point2D => this.mutateIntoBounds(location, context.canvas)),
                tap((newLocation: Point2D): void => {
                    if (this.advancedSnakeTailCollisionDetectionAlgoritmTooPointO(newLocation)) {
                        throw new Error('Whoops, I bit my ass!');
                    }
                    this.$location.next(newLocation);
                }),
                switchMap((newLocation: Point2D): Observable<Point2D[]> => {
                    const newHistory: Point2D[] = this.$history.value.slice(-(this.$length.value - 1));
                    newHistory.push(newLocation);

                    this.$history.next(newHistory);
                    return this.$history;
                }),
                tap((history: Point2D[]) => {
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                    context.beginPath();
                    history.forEach((point: Point2D, index: number): void => {
                        if (index === history.length - 1) {
                            context.fillStyle = "#ab1265";
                        } else {
                            context.fillStyle = "#0000ff";
                        }
                        context.fillRect(
                            point.x * DEFAULT_CELL_SIZE,
                            point.y * DEFAULT_CELL_SIZE,
                            DEFAULT_CELL_SIZE,
                            DEFAULT_CELL_SIZE,
                        );
                    });
                    context.stroke();
                    context.closePath();
                    this.drawScore(context);
                }),
            )
    }

    public kill(): void {
        console.log(`Ergh, I'm die`);
    }

    public setControls(keyboard: Keyboard): void {
        this.subscriptions.push(
            keyboard.onMulti('W', 'ArrowUp').subscribe(() => this.$direction.next(Direction.Up)),
            keyboard.onMulti('A', 'ArrowLeft').subscribe(() => this.$direction.next(Direction.Left)),
            keyboard.onMulti('S', 'ArrowDown').subscribe(() => this.$direction.next(Direction.Down)),
            keyboard.onMulti('D', 'ArrowRight').subscribe(() => this.$direction.next(Direction.Right)),
            keyboard.onRelease('E').subscribe(() => this.eat()),
        );
    }

    public unsetControls(): void {
        this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
    }

    private advancedSnakeTailCollisionDetectionAlgoritmTooPointO(location: Point2D): boolean {
        return this.$history.value.some((point: Point2D) => point.x === location.x && point.y === location.y);
    }

    private static velocityInterval(length: number): number {
        return Math.max(((VELOCITY_UPDATE_INTERVAL * STARTING_LENGTH) * (1 / length)), 30);
    }

    private mutateIntoBounds(location: Point2D, canvas: HTMLCanvasElement): Point2D {
        const cols: number = canvas.width / DEFAULT_CELL_SIZE;
        const rows: number = canvas.height / DEFAULT_CELL_SIZE;
        if (location.x < 0) {
            location.x = cols - 1;
        } else if (location.x >= cols) {
            location.x = 0;
        }
        if (location.y < 0) {
            location.y = rows - 1;
        } else if (location.y >= rows) {
            location.y = 0;
        }
        return location;
    }

    private drawScore (context: CanvasRenderingContext2D): void {
        context.font = "14pt monospace";
        context.textAlign = "right";
        context.fillStyle = "#000";
        context.strokeStyle = "#fff";
        context.lineWidth = 3;
        context.strokeText(`YOU ARE ${this.$length.value} FAT`, context.canvas.width - 5, 5, 150);
        context.fillText(`YOU ARE ${this.$length.value} FAT`, context.canvas.width - 5, 5, 150);
    }
}
