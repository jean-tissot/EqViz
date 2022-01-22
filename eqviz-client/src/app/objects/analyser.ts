export class Analyser {

    constructor(
        private audioSource: MediaStreamAudioSourceNode,
        private analyserNode: AnalyserNode
    ) {
        audioSource.connect(analyserNode);
    }

    stop() {
        this.audioSource.disconnect();
        this.audioSource.mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        console.log("stream", this.audioSource.mediaStream.id, "stopped");
    }

    getTimeDomainValues(): Uint8Array {
        var dataTime = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.analyserNode.getByteTimeDomainData(dataTime);
        return dataTime;
    }

}