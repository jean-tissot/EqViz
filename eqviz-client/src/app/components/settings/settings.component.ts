import { Component, OnInit } from '@angular/core';
import { AudioSource, Visualizer } from 'src/app/objects/types';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentVisualizer: Visualizer = 'none';
  nfftPossibleValues = [2 ** 5, 2 ** 6, 2 ** 7, 2 ** 8, 2 ** 9, 2 ** 10, 2 ** 11, 2 ** 12, 2 ** 13, 2 ** 14, 2 ** 15];
  displayLenghtPossibleValues = [50, 100, 150, 200];
  possiblesAudioSources: AudioSource[] = ['mike', 'recordings'];

  constructor(public settingsService: SettingsService) { }

  ngOnInit(): void {
    // Each time the visualizer changes, we update the currentVisualizer attribute in order to adapt the left side panel
    this.settingsService.visualizerChange.subscribe(visualizerId => this.currentVisualizer = visualizerId);
  }


}
