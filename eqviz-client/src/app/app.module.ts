import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AmplFreqVisualizerComponent } from './components/visualizers/ampl-freq-visualizer/ampl-freq-visualizer.component';
import { AmplTimeVisualizerComponent } from './components/visualizers/ampl-time-visualizer/ampl-time-visualizer.component';
import { FreqTimeVisualizerComponent } from './components/visualizers/freq-time-visualizer/freq-time-visualizer.component';
import { SpackVisualizerComponent } from './components/visualizers/spack-visualizer/spack-visualizer.component';
import { WelcomeComponent } from './components/welcome/welcome.component';


@NgModule({
  declarations: [
    AppComponent,
    SpackVisualizerComponent,
    AmplTimeVisualizerComponent,
    FreqTimeVisualizerComponent,
    AmplFreqVisualizerComponent,
    WelcomeComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

