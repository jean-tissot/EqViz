import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Settings, Visualizer } from "../objects/types";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    // TODO: add a reset setting option (which will delete all values in the localStorage)

    private visualizers: Visualizer[] = ['none', 'spack', 'ampl-time', 'ampl-freq', 'freq-time'];

    private nfftValues: Settings;
    private displayLengthValues: Settings;
    private mustSaveToDisk: Settings;

    constructor(private storage: StorageService) {
        
        var defaultNfftValues = {'spack': 512, 'ampl-time': 4096, 'freq-time': 128, 'ampl-freq': 2048};
        var defaultDisplayLengthValues = { 'spack': 100, 'freq-time': 100 };
        var defalutSaveToDisk = {'none' : 0};

        this.nfftValues = this.loadSetting('nfft', defaultNfftValues);
        this.displayLengthValues = this.loadSetting('display-length', defaultDisplayLengthValues);
        this.mustSaveToDisk = this.loadSetting('save-to-disk', defalutSaveToDisk);
    }

    /** You can subscribe to visualizerChange with the function to call on visualizer change */
    visualizerChange = new BehaviorSubject<Visualizer>('none');
    /** You can subscribe to nfftChange with the function to call on nfft value change */
    nfftChange = new BehaviorSubject<number>(0);
    /** You can subscribe to displayLengthChange with the function to call on displayLength change */
    displayLengthChange = new BehaviorSubject<number>(0);


    set nfft(value: number) {
        this.nfftValues[this.visualizerChange.getValue()] = value;
        this.nfftChange.next(value);
        this.saveSetting('nfft', this.visualizerChange.getValue(), value);
    }

    get nfft(): number {
        return this.nfftChange.getValue();
    }

    set displayLength(value: number) {
        this.displayLengthValues[this.visualizerChange.getValue()] = value;
        this.displayLengthChange.next(value);
        this.saveSetting('display-length', this.visualizerChange.getValue(), value);
    }

    get displayLength(): number {
        return this.displayLengthChange.getValue();
    }


    get saveToDisk(): boolean {
        return this.mustSaveToDisk['none'] === 1;
    }

    set saveToDisk(toDisk: boolean) {
        this.mustSaveToDisk['none'] = toDisk ? 1 : 0;
        this.saveSetting('save-to-disk', this.visualizerChange.getValue(), toDisk ? 1 : 0);
    }


    /** Indicate that the current visualizer has changed */
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

    private saveSetting(key: string, visualizer: string, setting: number) {
        this.storage.saveSetting(key + "-" + visualizer, setting.toString());
    }

    private loadSetting(key: string, setting: Settings): Settings {
        var ret: Settings = {};
        this.visualizers.forEach(visualizer => {
            var value = setting[visualizer];
            if(value !== undefined) {
                var storageSetting: number | undefined = Number(this.storage.getSetting(key + "-" + visualizer));
                if(isNaN(storageSetting)) {
                    storageSetting = undefined
                }
                ret[visualizer] = +(storageSetting || value);
            }
        });
        return ret;
    }


}