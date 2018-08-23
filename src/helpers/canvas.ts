export function createCanvasContext (width: number, height: number, d: HTMLDocument = document): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const style: string = `width: ${width}px; height: ${height}px;`;
    const canvas: HTMLCanvasElement = Object.assign(d.createElement('canvas'), { width, height, style });
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) {
        throw new Error('Could not create canvas.');
    }
    return [canvas, context];
}
