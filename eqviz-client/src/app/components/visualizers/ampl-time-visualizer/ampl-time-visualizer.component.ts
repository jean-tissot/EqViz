import { Component, OnInit } from '@angular/core';
import { Analyser } from 'src/app/objects/analyser';
import { AudioService } from 'src/app/services/audio.service';
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

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
    let canvas = document.getElementById("ampl-time-canvas") as HTMLCanvasElement;
    Drawer.fitToContainer(canvas);
    let ctxCanvas = canvas?.getContext("2d");
    if (ctxCanvas) {
      this.ctxCanvas = ctxCanvas;
      this.drawer = new Drawer(ctxCanvas, 128.0 * 2);
      this.audioService.startAnalyser().then((analyser: Analyser) => {
        this.analyser = analyser;
        this.draw();
      });
    } else {
      console.log("Impossible d'afficher le canvas")
    }
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
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
