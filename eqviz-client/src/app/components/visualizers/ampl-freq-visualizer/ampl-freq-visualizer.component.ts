import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Drawer } from '../../utils/drawer';

@Component({
  selector: 'app-ampl-freq-visualizer',
  templateUrl: './ampl-freq-visualizer.component.html',
  styleUrls: ['./ampl-freq-visualizer.component.scss']
})
export class AmplFreqVisualizerComponent implements OnInit {

  private analyser?: Analyser;
  private drawer?: Drawer;
  private ctxCanvas?: CanvasRenderingContext2D;
  private audioChangeSubscription?: Subscription;

  constructor(private audioService: AudioService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.settings.setCurrentVisualizer('ampl-freq');
    let canvas = document.getElementById("ampl-freq-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    let ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 256, true);
      this.audioChangeSubscription = this.settings.audioSourceChange.subscribe(() => {
        if(this.analyser) {
          // analyser already started = this event doesn't come from a visualizer change but from an audio source change
          // → we stop the stream to start a new one
          this.analyser.stop();
          this.audioService.stop();
        }
        this.loadAnalyser().then(() => this.draw());
      });
    } else {
      console.log("Impossible to diplay the canvas");
    }
  }

  private async loadAnalyser() {
    this.analyser = await this.audioService.startAnalyser();
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
    this.analyser = undefined;
    this.drawer = undefined;
    this.audioChangeSubscription?.unsubscribe()
  }


  private draw() {

    // moyenne glissée sur le temps
    // augmenter le pas de fréquence

    if (!this.analyser || !this.ctxCanvas) return

    var dataFreq = this.analyser.getFrequencyValues();

    // this.ctxCanvas.fillStyle = 'rgb(200, 200, 200)';
    this.ctxCanvas.fillRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);

    this.ctxCanvas.lineWidth = 2;
    this.ctxCanvas.strokeStyle = 'rgb(200, 0, 200)';

    this.drawer?.trace(dataFreq);

    requestAnimationFrame(() => this.draw());

  }

}
