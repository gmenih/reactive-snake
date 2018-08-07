export class Draw {
    private ctx: CanvasRenderingContext2D;
    private cellSize: number;
    private cols: number;
    private rows: number;

    constructor(ctx: CanvasRenderingContext2D, cellSize: number) {
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.cols = ctx.canvas.width / cellSize;
        this.rows = ctx.canvas.height / cellSize;
    }

    clear (): Draw {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        return this;
    }

    cell (x: number, y: number, color: string = 'f00'): Draw {
        if (x > this.rows || y > this.cols || y < 0 || x < 0) {
            throw new Error(`Out of bounds { x: ${x}, y: ${y} }`);
        }
        this.ctx.fillStyle = `#${color}`;
        this.ctx.beginPath();
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        this.ctx.closePath();
        this.ctx.fill();
        return this;
    }

    text (text: string, x: number, y: number, color: string = 'f00') {
        this.ctx.font = '48px serif';
        this.ctx.fillStyle = `#${color}`;
        this.ctx.strokeStyle = '2px black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, x, y, this.ctx.canvas.width);
    }
}
