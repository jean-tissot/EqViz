import { Component, OnInit } from '@angular/core';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-spack-visualizer',
  templateUrl: './spack-visualizer.component.html',
  styleUrls: ['./spack-visualizer.component.scss']
})
export class SpackVisualizerComponent implements OnInit {

  constructor(private audioService: AudioService) { }

  ngOnInit(): void {
    this.audioService.getAnalyser().then((analyser: AnalyserNode) => {
      var dataTime = new Float32Array(analyser.fftSize);
      setInterval(
        () => {
          analyser.getFloatTimeDomainData(dataTime);
          console.log(dataTime);
        },
        1000
      );
    });
  }

}
