import { Injectable } from '@angular/core';
import { AudioSourceService } from './audio-source.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private source: 'mic' = 'mic';

  constructor(private audioSourceService: AudioSourceService) {
  }

  private getStream(): Promise<MediaStream> {
    if (this.source == 'mic') {
      return this.audioSourceService.getMicStream();
    } else {
      return this.audioSourceService.getVoidStream();
    }
  }

  public getAnalyser(): Promise<AnalyserNode> {
    return this.getStream().then((stream: MediaStream) => {
      console.log(stream);

      var Nfft = 8192; // 185.8 ms if Fe = 44100 Hz (contexteAudio.sampleRate)
      var contexteAudio = new window.AudioContext();

      var analyser = contexteAudio.createAnalyser();
      analyser.smoothingTimeConstant = 0;
      analyser.fftSize = Nfft;

      var source = contexteAudio.createMediaStreamSource(stream);
      source.connect(analyser);

      return analyser;
    });
  }

}
