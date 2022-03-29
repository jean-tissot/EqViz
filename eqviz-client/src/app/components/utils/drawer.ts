import { Colors } from "./color";

export class Drawer {

    constructor(
        private ctxCanvas: CanvasRenderingContext2D,
        private ratio: number, // used for scaling values to display
        private inverted: boolean = false,
        private filled: boolean = false) {
    }

    trace(data: number[] | Uint8Array) {

        var WIDTH = this.ctxCanvas.canvas.width;
        var HEIGHT = this.ctxCanvas.canvas.height;
        var dx = WIDTH * 1.0 / (data.length - 1);

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

            x += dx;
        }

        if (this.filled) {
            this.ctxCanvas.lineTo(WIDTH, HEIGHT);
            this.ctxCanvas.closePath();
            this.ctxCanvas.fill();
        }
        this.ctxCanvas.stroke();
    }

    spectrogram(data: Uint8Array[]) {

        var WIDTH = this.ctxCanvas.canvas.width;
        var HEIGHT = this.ctxCanvas.canvas.height;

        var dx = WIDTH * 1.0 / (data.length - 1);
        // TODO: take into account the case where the nfft is change by the user to a lower value
        var ny = data[data.length - 1].length;
        var abs_dy = HEIGHT / (ny - 1);
        var dy = this.inverted ? -abs_dy : abs_dy;

        var x = 0;
        for (let freqs of data) {
            var y = this.inverted ? HEIGHT - abs_dy : 0;
            for (let i = 0; i < ny; i++) {
                this.ctxCanvas.fillStyle = Colors.getFromGradient(freqs[i], this.ratio, true);
                this.ctxCanvas.fillRect(x, y, dx, abs_dy);
                y += dy;
            }
            x += dx;
        }

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