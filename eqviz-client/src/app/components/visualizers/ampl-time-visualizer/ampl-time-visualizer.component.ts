import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Drawer } from '../../utils/drawer';

@Component({
  selector: 'app-ampl-time-visualizer',
  templateUrl: './ampl-time-visualizer.component.html',
  styleUrls: ['./ampl-time-visualizer.component.scss']
})
export class AmplTimeVisualizerComponent implements OnInit {

  private analyser?: Analyser;
  private ctxCanvas?: CanvasRenderingContext2D;
  private drawer?: Drawer;
  private audioChangeSubscription?: Subscription;

  constructor(private audioService: AudioService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.settings.setCurrentVisualizer('ampl-time');
    let canvas = document.getElementById("ampl-time-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    let ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 128.0 * 2);
      this.audioChangeSubscription =this.settings.audioSourceChange.subscribe(() => {
        if(this.analyser) {
          // analyser already started = this event doesn't come from a visualizer change but from an audio source change
          // → we stop the stream to start a new one
          this.audioService.stop();
        }
        this.loadAnalyser()
      });
      this.loadAnalyser().then(() => this.draw());
    } else {
      console.log("Impossible to display the canvas")
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
  }

  private draw() {

    if (!this.analyser || !this.ctxCanvas) return

    var dataTime = this.analyser.getTimeDomainValues();

    this.ctxCanvas.fillStyle = 'rgb(10, 10, 10)';
    this.ctxCanvas.fillRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);
    // this.ctxCanvas.clearRect(0, 0, this.ctxCanvas.canvas.width, this.ctxCanvas.canvas.height);

    this.ctxCanvas.lineWidth = 2;
    this.ctxCanvas.strokeStyle = 'rgb(200, 0, 200)';

    this.drawer?.trace(dataTime);

    requestAnimationFrame(() => this.draw());

  }


}
