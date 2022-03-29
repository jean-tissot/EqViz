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
      console.log("Stream from the file with id " + this.currentSource.recordingKey + " stopped");
    } else {
      this.audioSourceService.stopMicStream();
    }
    this.currentSource = undefined;
  }

  /** Gets the source to use for the analyser (creating a new source only if the selection has change in the interface) */
  private async getSource(): Promise<AudioNode> {
    // We keep the current source if possible
    if(this.currentSource?.type == 'mike' && this.settings.audioSource == 'mike') {
      console.log("Using the mike stream already opened")
      return Promise.resolve(this.currentSource.sourceNode);
    }
    if(this.currentSource?.type == 'recordings' && this.settings.audioSource == 'recordings'
        && this.settings.selectedRecordingId == this.currentSource.recordingKey) {
        console.log("Using the file stream already opened")
      return Promise.resolve(this.currentSource.sourceNode);
    }
    var file = this.settings.selectedRecording;
    var fileId = this.settings.selectedRecordingId;
    var source;
    if (this.settings.audioSource == 'recordings' && file) {
      source = await this.audioSourceService.getFileSource(file)
      source.connect(this.audioSourceService.audioCtx.destination);
      source.start();
      console.log("Starts playing the file " + file.name + " (id: " + fileId + ")");
      this.currentSource = new AudioSource(source, 'recordings', fileId);
    } else {
      source = await this.audioSourceService.getMicSource();
      this.currentSource = new AudioSource(source, 'mike', undefined);
    }
    return source;
  }

  /** Useful to play the recording again : stops the current source and starts the analyser again*/
  public replay() {
    this.stop();
    // This will trigger an event in the current visualizer → reloads the analyser
    this.settings.audioSourceChange.next(this.settings.selectedRecordingId);
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
    // TODO: simplify the filename ?
    var filename = new Date().toDateString() + " - recording";
    console.log("Saving audio file ('" + filename + "')...");
    if(this.settings.saveToDisk) {
      this.storageService.saveToDisk(event.data, filename);
    } else {
      this.storageService.saveToBrowser(event.data, filename)
          .then(() => this.settings.loadRecordings());
    }
  }

}
