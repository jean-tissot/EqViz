import { AudioSourceType } from "./types";

export default class AudioSource {
    constructor(public sourceNode: AudioNode, public type: AudioSourceType, public recordingKey: string | undefined) {}
}