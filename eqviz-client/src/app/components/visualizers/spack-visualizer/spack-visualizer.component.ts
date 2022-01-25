import { Component, OnDestroy, OnInit } from '@angular/core';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-spack-visualizer',
  templateUrl: './spack-visualizer.component.html',
  styleUrls: ['./spack-visualizer.component.scss']
})
export class SpackVisualizerComponent implements OnInit, OnDestroy {

  private analyser?: Analyser;

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
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

    requestAnimationFrame(() => this.draw(canvas, ctxCanvas, analyser));


    var dataTime = analyser.getFrequencyValues();
    var dataSize = dataTime.length;

    // ctxCanvas.fillStyle = 'rgb(200, 200, 200)';
    ctxCanvas.fillRect(0, 0, WIDTH, HEIGHT);

    ctxCanvas.lineWidth = 2;
    ctxCanvas.strokeStyle = 'rgb(200, 0, 200)';

    ctxCanvas.beginPath();

    var sliceWidth = WIDTH * 1.0 / dataSize;
    var x = 0;

    for (var i = 0; i < dataSize; i++) {

      var v = dataTime[i] / 128.0;
      var y = (1 - v) * HEIGHT;

      if (i === 0) {
        ctxCanvas.moveTo(x, y);
      } else {
        ctxCanvas.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctxCanvas.lineTo(canvas.width, canvas.height / 2);
    ctxCanvas.stroke();

  }

}
