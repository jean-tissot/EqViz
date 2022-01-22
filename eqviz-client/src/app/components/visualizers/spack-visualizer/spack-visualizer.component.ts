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
    this.audioService.startAnalyser().then((analyser: Analyser) => {
      this.analyser = analyser;
      // do stuff with this analyser
    });
  }

  ngOnDestroy(): void {
    this.analyser?.stop();
  }

}
