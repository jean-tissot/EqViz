import { Component, OnDestroy, OnInit } from '@angular/core';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { Colors } from '../../utils/color';

@Component({
  selector: 'app-spack-visualizer',
  templateUrl: './spack-visualizer.component.html',
  styleUrls: ['./spack-visualizer.component.scss']
})
export class SpackVisualizerComponent implements OnInit, OnDestroy {

  private analyser?: Analyser;
  private nbFreqs = 5;
  private data: number[][] = [];
  private displayLength = 100;

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
    for (let i = 0; i < this.nbFreqs; i++) {
      this.data.push(new Array(this.displayLength).fill(0));
    }
    var canvas = document.getElementById("spack-canvas") as HTMLCanvasElement;
    this.fitToContainer(canvas);
    var ctxCanvas = canvas?.getContext("2d");
    this.audioService.startAnalyser().then((analyser: Analyser) => {
      this.analyser = analyser;
      // do stuff with this analyser
      this.draw(canvas, ctxCanvas, analyser);
    });
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
  }

  fitToContainer(canvas: HTMLCanvasElement) {
    // Make it visually fill the positioned parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    // ...then set the internal size to match
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }


  private draw(canvas: HTMLCanvasElement, ctxCanvas: CanvasRenderingContext2D | null, analyser: Analyser) {

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;


    if (!analyser || !canvas || !ctxCanvas) {
      console.log("Impossible d'afficher le canvas")
      return
    }

    var dataFreq = analyser.getFrequencyValues();
    var nbFreqByStack = dataFreq.length / this.nbFreqs;

    var precValue = 0
    for (let i = 0; i < this.nbFreqs; i++) {
      let value = dataFreq.slice(Math.round(nbFreqByStack * i), Math.round(nbFreqByStack * (i + 1))).reduce((a: number, b: number) => a + b) / nbFreqByStack;
      value += precValue;
      this.data[i].push(value);
      precValue = value;
    }

    ctxCanvas.fillStyle = 'rgb(10, 10, 10)';
    ctxCanvas.fillRect(0, 0, WIDTH, HEIGHT);

    ctxCanvas.lineWidth = 3;

    var start = Math.max(0, this.data[0].length - this.displayLength)

    var colors = Colors.generate(this.nbFreqs);
    var ratio = 256.0 * this.nbFreqs;

    for (let i = this.nbFreqs - 1; i >= 0; i--) {

      ctxCanvas.strokeStyle = colors[i];
      ctxCanvas.fillStyle = colors[i];


      this.trace(this.data[i].slice(start, this.data[0].length), ratio, ctxCanvas);
    }

    requestAnimationFrame(() => this.draw(canvas, ctxCanvas, analyser));

  }


  private trace(data: number[], ratio: number, ctxCanvas: CanvasRenderingContext2D) {

    var WIDTH = ctxCanvas.canvas.width;
    var HEIGHT = ctxCanvas.canvas.height;
    var sliceWidth = WIDTH * 1.0 / (this.displayLength - 1);

    ctxCanvas.beginPath();
    ctxCanvas.moveTo(0, HEIGHT);
    var x = 0;

    for (let value of data) {

      var y = (1 - value / ratio) * HEIGHT;

      ctxCanvas.lineTo(x, y);

      x += sliceWidth;
    }

    ctxCanvas.lineTo(WIDTH, HEIGHT);
    ctxCanvas.closePath();
    ctxCanvas.fill();
    ctxCanvas.stroke();
  }

}
