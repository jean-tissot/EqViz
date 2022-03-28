import { Injectable } from '@angular/core';
import { Analyser } from '../objects/analyser';
import AudioSource from '../objects/audio-source';
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
  private currentSource?: AudioSource;

  constructor(private audioSourceService: AudioSourceService, private settings: SettingsService,
    private storageService: StorageService) {
    settings.visualizerChange.subscribe((current: Visualizer) => {
      if (current == 'none' && !this.recording) {
        this.stop();
      }
    })
  }

  public stop() {
    if(this.currentSource?.sourceNode instanceof AudioBufferSourceNode) {
      this.currentSource.sourceNode.stop();
    } else {
      this.audioSourceService.stopMicStream();
    }
    this.currentSource = undefined;
  }

  /** Gets the source to use for the analyser (creating a new source only if the selection has change in the interface) */
  private async getSource(): Promise<AudioNode> {
    // We keep the current source if possible
    // TODO: we should stock the information of the source type in the AudioSource object instead of testing the sourceNode type
    if(this.currentSource?.sourceNode instanceof MediaStreamAudioSourceNode && this.settings.audioSource == 'mike') {
      return Promise.resolve(this.currentSource.sourceNode);
    }
    if(this.currentSource?.sourceNode instanceof AudioBufferSourceNode && (this.settings.selectedRecording as any).id == this.currentSource.recordingKey) {
      return Promise.resolve(this.currentSource.sourceNode);
    }
    var file = this.settings.selectedRecording;
    var source;
    if (this.settings.audioSource == 'recordings' && file) {
      source = await this.audioSourceService.getFileSource(file)
      source.start();
      console.log("Starting to play the file " + file.name + " (id: " + (file as any).id + ")");
      // TODO: we should use the key of this.settings.audioSource → this.settings.selectedRecording = key
      this.currentSource = new AudioSource(source, (file as any).id);
    } else {
      source = await this.audioSourceService.getMicSource();
      this.currentSource = new AudioSource(source, undefined);
    }
    return source;
  }

  /** Useful to play the recording again */
  private startCurrentSourceIfApplicable() {
    var sourceNode = this.currentSource?.sourceNode
    if(sourceNode instanceof AudioBufferSourceNode) {
      sourceNode.start();
      console.log("Starting to play the file with id" + this.currentSource?.recordingKey);
    }
  }

  public async startAnalyser(): Promise<Analyser> {
    console.log("Starting an analyser");
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
    if (this.settings.visualizerChange.getValue() == 'none' || this.settings.audioSource != 'mike')
      this.audioSourceService.stopMicStream();
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
    var filename = new Date().toDateString() + " - recording";
    if(this.settings.saveToDisk) {
      this.storageService.saveToDisk(event.data, filename);
    } else {
      this.storageService.saveToBrowser(event.data, filename)
          .then(() => this.settings.loadRecordings());
    }
    console.log("Saving audio file...");
  }

}
