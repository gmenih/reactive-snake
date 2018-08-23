import {Observable, fromEvent, merge, Subscription} from 'rxjs';
import {filter, tap} from 'rxjs/operators';

/**
 * A small class which exports methods that allow subscribing to different keyboard events
 */
export class Keyboard {

    private onKeyUp: Observable<KeyboardEvent>;
    private onKeyDown: Observable<KeyboardEvent>;

    constructor (src: HTMLElement | HTMLDocument) {
        this.onKeyUp = fromEvent<KeyboardEvent>(src, "keyup");
        this.onKeyDown = fromEvent<KeyboardEvent>(src, "keydown");

    }

    onRelease (keyCode: number): Observable<KeyboardEvent>;
    onRelease (keyName: string): Observable<KeyboardEvent>;
    onRelease (keyCode: number | string): Observable<KeyboardEvent> {
        return this.onKeyUp.pipe(
            filter((event: KeyboardEvent) => {
                if (typeof keyCode === 'string') {
                    return event.key.toLowerCase() === keyCode.toLowerCase();
                }
                return event.keyCode === keyCode;
            }),
        );
    }

    onPress (keyCode: number): Observable<KeyboardEvent>;
    onPress (keyName: string): Observable<KeyboardEvent>;
    onPress (keyCode: number | string): Observable<KeyboardEvent> {
        return this.onKeyDown.pipe(
            // filter((event: KeyboardEvent) => !event.repeat),
            filter((event: KeyboardEvent) => {
                if (typeof keyCode === 'string') {
                    return event.key.toLowerCase() === keyCode.toLowerCase();
                }
                return event.keyCode === keyCode;
            }),
        );
    }

    onMulti (...args: any[]): Observable<KeyboardEvent> {
        return merge(
            ...args.map((code: string | number) => this.onPress(<any> code)),
        );
    }
}
