import { Component, OnInit } from '@angular/core';
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

  constructor(private audioService: AudioService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.settings.setCurrentVisualizer(4);
    let canvas = document.getElementById("ampl-freq-canvas") as HTMLCanvasElement;
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
