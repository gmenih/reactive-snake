import {Observable, interval, BehaviorSubject, zip, Subscription} from "rxjs";
import {switchMap, take, tap} from "rxjs/operators";
import {SnekDirection, Point2D, DIRECTIONS} from './domain';

const VELOCITY_UPDATE_INTERVAL: number = 800;
const STARTING_LENGTH: number = 3;
const STARTING_VELOCITY: number = 1;
const NO_EMIT: BehaviorSubject<undefined> = new BehaviorSubject(undefined);

export class Snek {
    private $length: BehaviorSubject<number> = new BehaviorSubject(STARTING_LENGTH);
    private $velocity: BehaviorSubject<number> = new BehaviorSubject(STARTING_VELOCITY);
    private $direction: BehaviorSubject<SnekDirection> = new BehaviorSubject(SnekDirection.Right);
    private $location: BehaviorSubject<Point2D>;
    private $locationHistory: BehaviorSubject<Point2D[]> = new BehaviorSubject(<Point2D[]> []);

    constructor (x: number, y: number) {
        this.$location = new BehaviorSubject<Point2D>({ x, y });
    }

    public set direction (direction: SnekDirection) {
        this.$direction.next(direction);
    }

    public die (): void {
        this.$velocity.complete();
        this.$locationHistory.complete();
        this.$location.complete();
        this.$length.complete();
    }

    private checkBounds (location: Point2D, width: number, height: number): Point2D  {
        if (location.x >= width) {
            location.x = 0;
        }
        if (location.x < 0) {
            location.x = width - 1;
        }
        if (location.y >= height) {
            location.y = 0;
        }
        if (location.y < 0) {
            location.y = height - 1;
        }
        return location;
    }

    private advancedSnakeTailCollisionDetectionAlgoritmTooPointO (location: Point2D, history: Point2D[]): void {
        if (history.some((point: Point2D) => point.x === location.x && point.y === location.y)) {
            throw new Error("OwO OOPSIE!");
        }
    }

    public eat (): void {
        zip(
            this.$velocity,
            this.$length,
        ).pipe(
            take(1),
        ).subscribe(([velocity, length]) => {
            this.$length.next(length + 1);
            this.$velocity.next(velocity + 1);
            console.log(length, velocity);
        });
    }

    public score (): Observable<number> {
        return this.$length;
    }

    public locationObservable (width: number, height: number): Observable<Point2D[]> {
        return this.$velocity
            .pipe(
                switchMap((velocity: number): Observable<number> => interval(VELOCITY_UPDATE_INTERVAL / velocity)),
                switchMap((): Observable<[Point2D, SnekDirection, undefined]> => zip(
                    this.$location,
                    this.$direction,
                    // Add another Subject, so this doesn't emit when both direction and location are changed
                    NO_EMIT,
                )),
                tap(([location, direction]: [Point2D, SnekDirection]): void => {
                    const directionModifier: Point2D = DIRECTIONS[direction];
                    const newLocation: Point2D = this.checkBounds({
                        x: location.x + directionModifier.x,
                        y: location.y + directionModifier.y,
                    }, width, height);
                    this.$location.next(newLocation);
                }),
                switchMap(() => zip(
                    this.$location,
                    this.$locationHistory,
                    this.$length,

                    NO_EMIT,
                )),
                tap(([location, history]: [Point2D, Point2D[]]) => this.advancedSnakeTailCollisionDetectionAlgoritmTooPointO(location, history)),
                switchMap(([location, history, length]: [Point2D, Point2D[], number]): Observable<Point2D[]> => {
                    // do some collision detection
                    const newHistory: Point2D[] = history.slice(-(length - 1));
                    newHistory.push(location);

                    this.$locationHistory.next(newHistory);
                    return this.$locationHistory;
                }),
            )
    }
}
