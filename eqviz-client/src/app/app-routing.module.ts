import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmplFreqVisualizerComponent } from './components/visualizers/ampl-freq-visualizer/ampl-freq-visualizer.component';
import { AmplTimeVisualizerComponent } from './components/visualizers/ampl-time-visualizer/ampl-time-visualizer.component';
import { FreqTimeVisualizerComponent } from './components/visualizers/freq-time-visualizer/freq-time-visualizer.component';
import { SpackVisualizerComponent } from './components/visualizers/spack-visualizer/spack-visualizer.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'spack', component: SpackVisualizerComponent},
  {path: 'ampl-time', component: AmplTimeVisualizerComponent},
  {path: 'freq-time', component: FreqTimeVisualizerComponent},
  {path: 'ampl-freq', component: AmplFreqVisualizerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
