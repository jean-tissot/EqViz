import { Subscription } from "rxjs";
import { SettingsService } from "../services/settings.service";

export class Analyser {

    nfftSubscription?: Subscription;

    constructor(
        private audioSource: AudioNode,
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
        const dataTime = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteTimeDomainData(dataTime);
        return dataTime;
    }

    getFrequencyValues(): Uint8Array {
        const dataFreq = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteFrequencyData(dataFreq);
        return dataFreq;
    }

}