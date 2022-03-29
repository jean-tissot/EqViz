import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioSourceService {

  audioCtx = new AudioContext();
  private micAudioSource?: MediaStreamAudioSourceNode;

  constructor() {
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = (navigator as any).webkitGetUserMedia || (navigator as any).mozGetUserMedia || (navigator as any).msGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }
  }

  private getNewMicStream() {
    return navigator.mediaDevices.getUserMedia({ video: false, audio: true });
  }


  public async getMicSource(): Promise<MediaStreamAudioSourceNode> {
    if (this.micAudioSource && this.micAudioSource?.mediaStream.active) {
      return Promise.resolve(this.micAudioSource);
    } else {
      const stream = await this.getNewMicStream();
      console.log("Stream", stream.id, "started");
      this.micAudioSource = this.audioCtx.createMediaStreamSource(stream);
      return this.micAudioSource;
    }
  }

  public stopMicStream() {
    this.micAudioSource?.disconnect();
    this.micAudioSource?.mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    console.log("Stream", this.micAudioSource?.mediaStream.id, "stopped");
    this.micAudioSource = undefined;
  }


  public async getFileSource(file: File): Promise<AudioBufferSourceNode> {
    const source = this.audioCtx.createBufferSource();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
    source.buffer = audioBuffer;
    return source;
  }

  
  public getVoidStream(): Promise<MediaStream> {
    var stream = new MediaStream();
    return new Promise(() => stream);
  }

}
