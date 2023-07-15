import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Drawer } from '../../utils/drawer';
import Scale from '../../utils/scale';

@Component({
  selector: 'app-freq-time-visualizer',
  templateUrl: './freq-time-visualizer.component.html',
  styleUrls: ['./freq-time-visualizer.component.scss']
})
export class FreqTimeVisualizerComponent implements OnInit, OnDestroy {

  private analyser?: Analyser;
  private drawer?: Drawer;
  private ctxCanvas?: CanvasRenderingContext2D;
  private data: number[][] = [];
  private displayLength = 100;
  private audioChangeSubscription?: Subscription;
  private displayLengthSupscritpion?: Subscription;

  constructor(private audioService: AudioService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.settings.setCurrentVisualizer('freq-time');
    this.displayLength = this.settings.displayLengthChange.getValue();
    for (let i = 0; i < this.displayLength; i++) {
      this.data.push([]);
    }
    const canvas = document.getElementById("freq-time-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    const ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 256, true);
      this.audioChangeSubscription = this.settings.audioSourceChange.subscribe(() => {
        if (this.analyser) {
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
    // this.data = [];
  }

  private draw() {
    if (!this.analyser || !this.ctxCanvas) return

    const dataFreq = this.analyser.getFrequencyValues();

    // TODO: Which exponential factor should we use to logarithmicly scale the data ?
    const dataFreqLog = Scale.toLogScale(dataFreq, 1.1);


    this.data.push(dataFreqLog);

    this.ctxCanvas.fillRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);

    this.ctxCanvas.lineWidth = 2;
    this.ctxCanvas.strokeStyle = 'rgb(200, 0, 200)';

    const start = this.data.length - this.displayLength;

    this.drawer?.spectrogram(this.data.slice(start, this.data.length));

    requestAnimationFrame(() => this.draw());

  }


}
