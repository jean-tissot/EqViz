import { Subscription } from "rxjs";
import { SettingsService } from "../services/settings.service";

export class Analyser {

    nfftSubscription?: Subscription;

    constructor(
        private audioSource: MediaStreamAudioSourceNode,
        private analyserNode: AnalyserNode,
        settings: SettingsService
    ) {
        this.nfftSubscription = settings.nfftChange.subscribe(nfft => analyserNode.fftSize = nfft)
        audioSource.connect(analyserNode);
    }

    stop() {
        this.audioSource.disconnect();
        this.audioSource.mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        console.log("stream", this.audioSource.mediaStream.id, "stopped");
        this.nfftSubscription?.unsubscribe();
    }

    getTimeDomainValues(): Uint8Array {
        var dataTime = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteTimeDomainData(dataTime);
        return dataTime;
    }

    getFrequencyValues(): Uint8Array {
        var dataTime = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteFrequencyData(dataTime);
        return dataTime;
    }

}