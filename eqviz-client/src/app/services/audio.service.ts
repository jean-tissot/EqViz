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

  private audioCtx = new AudioContext();
  private audioSource?: MediaStreamAudioSourceNode;
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

  private getNewStream(): Promise<MediaStream> {
    if (this.settings.audioSource == 'mike') {
      return this.audioSourceService.getMicStream();
    } else {
      return this.audioSourceService.getVoidStream();
    }
  }

  private stop() {
    this.audioSource?.disconnect();
    this.audioSource?.mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    console.log("stream", this.audioSource?.mediaStream.id, "stopped");
    this.audioSource = undefined;
  }

  private getSource(): Promise<MediaStreamAudioSourceNode> {
    if (this.audioSource && this.audioSource?.mediaStream.active) {
      return Promise.resolve(this.audioSource);
    } else {
      return this.getNewStream().then((stream: MediaStream) => {
        console.log("stream", stream.id, "started");
        this.audioSource = this.audioCtx.createMediaStreamSource(stream);
        return this.audioSource;
      });
    }
  }

  private async getFileSource(file: File): Promise<AudioBufferSourceNode> {
    const source = this.audioCtx.createBufferSource();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    source.buffer = audioBuffer;
    return source;
  }

  public async startAnalyser(): Promise<Analyser> {
    var file = this.settings.selectedRecording;
    console.log(file);
    var source = this.settings.audioSource == 'recordings' && file ?
        this.getFileSource(file) : this.getSource();
    return source.then((audioSource: AudioNode) => {

      var analyser = this.audioCtx.createAnalyser();
      analyser.smoothingTimeConstant = 0;
      analyser.fftSize = this.settings.nfft;

      return new Analyser(audioSource, analyser, this.settings);
    });
  }

  public startRecording() {
    if (this.recording) return
    this.recording = true;
    this.recordedChunks = [];
    this.getSource().then((audioSource: MediaStreamAudioSourceNode) => {
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
      this.storageService.saveToBrowser(event.data, "eqviz-audio-recording");
    }
    console.log("Saving audio file...");
  }

}
