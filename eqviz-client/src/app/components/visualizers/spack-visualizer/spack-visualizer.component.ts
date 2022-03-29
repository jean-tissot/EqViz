import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Colors } from '../../utils/color';
import { Drawer } from '../../utils/drawer';

@Component({
  selector: 'app-spack-visualizer',
  templateUrl: './spack-visualizer.component.html',
  styleUrls: ['./spack-visualizer.component.scss']
})
export class SpackVisualizerComponent implements OnInit, OnDestroy {

  private analyser?: Analyser;
  private nbFreqs = 5;
  private colors = Colors.generate(this.nbFreqs);
  private data: number[][] = [];
  private displayLength = 100;
  private ctxCanvas?: CanvasRenderingContext2D;
  private drawer?: Drawer;
  private displayLengthSupscritpion?: Subscription;
  private audioChangeSubscription?: Subscription;

  constructor(private audioService: AudioService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.settings.setCurrentVisualizer('spack');
    this.displayLength = this.settings.displayLengthChange.getValue();
    for (let i = 0; i < this.nbFreqs; i++) {
      this.data.push(new Array(this.displayLength).fill(0));
    }
    let canvas = document.getElementById("spack-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    let ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 256.0 * this.nbFreqs, true, true);
      this.audioChangeSubscription = this.settings.audioSourceChange.subscribe(() => {
        if(this.analyser) {
          // analyser already started = this event doesn't come from a visualizer change but from an audio source change
          // → we stop the stream to start a new one
          this.analyser.stop();
          this.audioService.stop();
        }
        this.loadAnalyser().then(() => this.draw());
      });
      this.displayLengthSupscritpion = this.settings.displayLengthChange.subscribe(value => this.displayLength = value);
    } else {
      console.log("Impossible to display the canvas");
    }
  }

  private async loadAnalyser() {
    this.analyser = await this.audioService.startAnalyser();
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
    this.analyser = undefined;
    this.drawer = undefined;
    this.audioChangeSubscription?.unsubscribe();
    this.displayLengthSupscritpion?.unsubscribe();
  }

  private draw() {

    if (!this.analyser || !this.ctxCanvas) return

    var dataFreq = this.analyser.getFrequencyValues();
    var nbFreqByStack = dataFreq.length / this.nbFreqs;

    var precValue = 0
    for (let i = 0; i < this.nbFreqs; i++) {
      let value = dataFreq.slice(Math.round(nbFreqByStack * i), Math.round(nbFreqByStack * (i + 1))).reduce((a: number, b: number) => a + b) / nbFreqByStack;
      // we stack the values
      value += precValue;
      this.data[i].push(value);
      precValue = value;
    }

    this.ctxCanvas.fillStyle = 'rgb(10, 10, 10)';
    this.ctxCanvas.fillRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);

    this.ctxCanvas.lineWidth = 3;

    var start = Math.max(0, this.data[0].length - this.displayLength);

    for (let i = this.nbFreqs - 1; i >= 0; i--) {

      this.ctxCanvas.strokeStyle = this.colors[i];
      this.ctxCanvas.fillStyle = this.colors[i];

      this.drawer?.trace(this.data[i].slice(start, this.data[0].length));
    }

    requestAnimationFrame(() => this.draw());

  }

}
