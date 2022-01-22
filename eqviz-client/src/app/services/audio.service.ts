import { Injectable } from '@angular/core';
import { Analyser } from '../objects/analyser';
import { AudioSourceService } from './audio-source.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  // TODO: add source type to objects folder - add other possible sources in source type
  private source: 'mic' = 'mic';
  // TODO: make possible to change Nftt ?
  private Nfft = 8192; // 185.8 ms if Fe = 44100 Hz (contexteAudio.sampleRate)
  private audioCtx = new window.AudioContext();

  constructor(private audioSourceService: AudioSourceService) {
  }

  private getStream(): Promise<MediaStream> {
    if (this.source == 'mic') {
      return this.audioSourceService.getMicStream();
    } else {
      return this.audioSourceService.getVoidStream();
    }
  }

  public startAnalyser(): Promise<Analyser> {
    return this.getStream().then((stream: MediaStream) => {

      console.log("stream", stream.id, "started");

      var analyser = this.audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = 0;
      analyser.fftSize = this.Nfft;

      var source = this.audioCtx.createMediaStreamSource(stream);

      return new Analyser(source, analyser);
    });
  }

  // TODO: Add setSource method

}
