
export class Drawer {


    constructor(
        private ctxCanvas: CanvasRenderingContext2D,
        private ratio: number,
        private inverted: boolean = false,
        private filled: boolean = false) {
    }

    trace(data: number[] | Uint8Array) {

        var WIDTH = this.ctxCanvas.canvas.width;
        var HEIGHT = this.ctxCanvas.canvas.height;
        var sliceWidth = WIDTH * 1.0 / (data.length - 1);

        this.ctxCanvas.beginPath();
        if (this.filled) {
            this.ctxCanvas.moveTo(0, HEIGHT);
        } else {
            let y = data[0] / this.ratio;
            this.ctxCanvas.moveTo(0, this.inverted ? (1 - y) * HEIGHT : y * HEIGHT);
        }
        var x = 0;

        for (let value of data) {

            let y = value / this.ratio
            y = this.inverted ? (1 - y) * HEIGHT : y * HEIGHT;

            this.ctxCanvas.lineTo(x, y);

            x += sliceWidth;
        }

        if (this.filled) {
            this.ctxCanvas.lineTo(WIDTH, HEIGHT);
            this.ctxCanvas.closePath();
            this.ctxCanvas.fill();
        }
        this.ctxCanvas.stroke();
    }

    static fitToContainer(canvas: HTMLCanvasElement) {
        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

}