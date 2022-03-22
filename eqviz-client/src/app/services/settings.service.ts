import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Settings, Visualizer } from "../objects/types";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    /** Subscribe with the function to call on visualizer change */
    visualizerChange = new BehaviorSubject<Visualizer>('none');
    /** Subscribe with the function to call on nfft value change */
    nfftChange = new BehaviorSubject<number>(0);
    /** Subscribe with the function to call on displayLength change */
    displayLengthChange = new BehaviorSubject<number>(0);

    private nfftValues: Settings = {
        'spack': 512,
        'ampl-time': 4096,
        'freq-time': 128,
        'ampl-freq': 2048
    }

    private displayLengthValues: Settings = { 'spack': 100, 'freq-time': 100 };

    set nfft(value: number) {
        this.nfftValues[this.visualizerChange.getValue()] = value;
        this.nfftChange.next(value);
    }

    set displayLength(value: number) {
        this.displayLengthValues[this.visualizerChange.getValue()] = value;
        this.displayLengthChange.next(value);
    }

    get nfft(): number {
        return this.nfftChange.getValue();
    }

    get displayLength(): number {
        return this.displayLengthChange.getValue();
    }

    saveToDisk = false;


    /**Changes the current visualizer */
    setCurrentVisualizer(current: Visualizer) {
        this.visualizerChange.next(current);
        this.loadVisualizerSettings(current);
    }

    private loadVisualizerSettings(current: Visualizer) {
        var nfft = this.nfftValues[current];
        var displayLength = this.displayLengthValues[current];
        if (nfft) {
            this.nfftChange.next(nfft);
        }
        if (displayLength) {
            this.displayLengthChange.next(displayLength);
        }
    }



}