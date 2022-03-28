import { Injectable } from '@angular/core';
import { Analyser } from '../objects/analyser';
import { Visualizer } from '../objects/types';
import { AudioSourceService } from './audio-source.service';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private recording = false;
  private mediaRecorder?: MediaRecorder;
  private recordedChunks: Blob[] = [];

  constructor(private audioSourceService: AudioSourceService, private settings: SettingsService,
    private storageService: StorageService) {
    settings.visualizerChange.subscribe((current: Visualizer) => {
      if (current == 'none' && !this.recording) {
        this.stop();
      }
    })
  }

  public stop() {
    // TODO: stop the current source
    this.audioSourceService.stopMicStream();
  }

  private async getSource() {
    var file = this.settings.selectedRecording;
    console.log(file);
    var source;
    if (this.settings.audioSource == 'recordings' && file) {
      source = await this.audioSourceService.getFileSource(file)
      source.start();
    } else {
      source = await this.audioSourceService.getMicSource();
    }
    return source;
  }

  public async startAnalyser(): Promise<Analyser> {
    const audioSource = await this.getSource();
    var analyser = this.audioSourceService.audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = this.settings.nfft;
    return new Analyser(audioSource, analyser, this.settings);
  }

  public startRecording() {
    if (this.recording) return
    this.recording = true;
    this.recordedChunks = [];
    this.audioSourceService.getMicSource().then((audioSource: MediaStreamAudioSourceNode) => {
      console.log("Recording...");
      this.mediaRecorder = new MediaRecorder(audioSource.mediaStream);
      this.mediaRecorder.ondataavailable = (e => this.saveRecording(e));
      this.mediaRecorder.start();
    });
  }

  public stopRecording() {
    if (!this.mediaRecorder || this.mediaRecorder.state == "inactive") return
    this.recording = false;
    this.mediaRecorder?.stop();
    if (this.settings.visualizerChange.getValue() == 'none') this.stop();
    console.log("Recording ended");
  }

  public pauseRecording() {
    this.mediaRecorder?.pause();
  }

  public resumeRecording() {
    this.mediaRecorder?.resume();
  }

  private saveRecording(event: BlobEvent) {
    this.recordedChunks.push(event.data);
    // TODO: make the filename non constant (use the date and time ?)
    if(this.settings.saveToDisk) {
      this.storageService.saveToDisk(event.data, "eqviz-audio-recording");
    } else {
      this.storageService.saveToBrowser(event.data, "eqviz-audio-recording")
          .then(() => this.settings.loadRecordings());
    }
    console.log("Saving audio file...");
  }

}
