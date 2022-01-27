
export class Drawer {


    constructor(
        private ctxCanvas: CanvasRenderingContext2D,
        private ratio: number) {
    }

    trace(data: number[]) {

        var WIDTH = this.ctxCanvas.canvas.width;
        var HEIGHT = this.ctxCanvas.canvas.height;
        var sliceWidth = WIDTH * 1.0 / (data.length - 1);

        this.ctxCanvas.beginPath();
        this.ctxCanvas.moveTo(0, HEIGHT);
        var x = 0;

        for (let value of data) {

            var y = (1 - value / this.ratio) * HEIGHT;

            this.ctxCanvas.lineTo(x, y);

            x += sliceWidth;
        }

        this.ctxCanvas.lineTo(WIDTH, HEIGHT);
        this.ctxCanvas.closePath();
        this.ctxCanvas.fill();
        this.ctxCanvas.stroke();
    }

}