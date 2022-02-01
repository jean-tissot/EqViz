import { Component, OnDestroy, OnInit } from '@angular/core';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { Drawer } from '../../utils/drawer';

@Component({
  selector: 'app-freq-time-visualizer',
  templateUrl: './freq-time-visualizer.component.html',
  styleUrls: ['./freq-time-visualizer.component.scss']
})
export class FreqTimeVisualizerComponent implements OnInit, OnDestroy {

  private analyser?: Analyser;
  private drawer?: Drawer;
  private ctxCanvas?: CanvasRenderingContext2D;
  private data: Uint8Array[] = [];
  private displayLength = 100;

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
    for (let i = 0; i < this.displayLength; i++) {
      this.data.push(new Uint8Array());
    }
    let canvas = document.getElementById("freq-time-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    let ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 256, true);
      this.audioService.startAnalyser().then((analyser: Analyser) => {
        this.analyser = analyser;
        this.draw();
      });
    } else {
      console.log("Impossible d'afficher le canvas");
    }
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
    this.analyser = undefined;
    this.drawer = undefined;
    // this.data = [];
  }

  private draw() {
    if (!this.analyser || !this.ctxCanvas) return

    var dataFreq = this.analyser.getFrequencyValues();

    this.data.push(dataFreq);

    this.ctxCanvas.fillRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);

    this.ctxCanvas.lineWidth = 2;
    this.ctxCanvas.strokeStyle = 'rgb(200, 0, 200)';

    var start = this.data.length - this.displayLength;

    this.drawer?.spectrogram(this.data.slice(start, this.data.length));

    requestAnimationFrame(() => this.draw());

  }


}
