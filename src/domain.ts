export interface Point2D {
    x: number;
    y: number;
}

export enum SnekDirection {
    Up = 'UP',
    Down = 'DOWN',
    Left = 'LEFT',
    Right = 'RIGHT',
};

export const DIRECTIONS: { [key: string]: Point2D } = {
    [SnekDirection.Up]: { x: 0, y: -1 },
    [SnekDirection.Down]: { x: 0, y: 1 },
    [SnekDirection.Left]: { x: -1, y: 0 },
    [SnekDirection.Right]: { x: 1, y: 0 },
};
