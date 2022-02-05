import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentVisualizer = 0;

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settingsService.visualiserChange().subscribe((current: number) => this.currentVisualizer = current);
  }

}
