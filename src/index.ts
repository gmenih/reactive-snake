import './styles/main.scss';

import { Keyboard } from './modules/keyboard';
import {Game, GameState} from './game';
import { Snek } from './snake';
import {Point2D, SnekDirection} from './domain';
import {catchError} from "rxjs/operators";
import {Observable, of} from "rxjs";

const k = new Keyboard(document);

const g = new Game(50, 50);
const s = new Snek(5, 5);

g.$state
    .subscribe((state: GameState) => {
        switch (state) {
            case GameState.Paused:
                console.log('game paused');
                break;
            case GameState.Running:
                playSnake();
                break;
            case GameState.GameOver:
                showHighscore();
        }
    });


const playSnake = () => {
    s.locationObservable(50, 50)
        .pipe(
            catchError((err: any) => {
                console.log(err);
                return of(undefined);
            })
        )
        .subscribe((history: Point2D[] | undefined): void => {
            if (!history) {
                return;
            }
            g.draw.clear();
            history.forEach((point: Point2D, i: number): void => {
                if (i === (history.length - 1)) {
                    g.draw.cell(point.x, point.y, '00f');
                } else {
                    g.draw.cell(point.x, point.y);
                }
            });
        });
};

const showHighscore = () => {
    s.score()
        .subscribe((score: number) => {
            g.gameOver(score);
        });
}

k.onMulti('W', 'ArrowUp')
    .subscribe(() => s.direction = SnekDirection.Up);

k.onMulti('A', 'ArrowLeft')
    .subscribe(() => s.direction = SnekDirection.Left);

k.onMulti('S', 'ArrowDown')
    .subscribe(() => s.direction = SnekDirection.Down);

k.onMulti('D', 'ArrowRight')
    .subscribe(() => s.direction = SnekDirection.Right);

k.onPress('P')
    .subscribe(() => s.eat());

g.inject(document.body);
