import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    /** Subscribe with the function to call on visualizer change */
    visualizerChange = new BehaviorSubject<number>(0);
    /** Subscribe with the function to call on nfft value change */
    nfftChange = new BehaviorSubject<number>(0);

    private nfftValues = [512, 4096, 128, 4096];

    set nfft(value: number) {
        this.nfftValues[this.visualizerChange.getValue() - 1] = value;
        this.nfftChange.next(value);
    }

    get nfft() {
        return this.nfftChange.getValue();
    }


    /**Changes the current visualizer */
    setCurrentVisualizer(current: number) {
        this.visualizerChange.next(current);
        this.loadVisualizerSettings(current);
    }

    private loadVisualizerSettings(current: number) {
        this.nfftChange.next(this.nfftValues[current - 1]);
    }



}