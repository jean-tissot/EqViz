export default class AudioSource {
    constructor(public sourceNode: AudioNode, public recordingKey: string | undefined) {}
}