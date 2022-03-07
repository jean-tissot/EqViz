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