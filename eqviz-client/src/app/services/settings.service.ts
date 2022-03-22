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

    /** The nfft to use for each visualizer */
    private nfftValues: Settings;
    /** The display length to use for the spacke and freq/time visualizers */
    private displayLengthValues: Settings;
    /** Indicates if audio recording must be saved to the disk or the browser (1 → to disk, 0 → to browser) */
    private mustSaveToDisk: Settings;

    constructor(private storage: StorageService) {
        
        var defaultNfftValues = {'spack': 512, 'ampl-time': 4096, 'freq-time': 128, 'ampl-freq': 2048};
        var defaultDisplayLengthValues = { 'spack': 100, 'freq-time': 100 };
        var defaultSaveToDisk = {'none' : 0};

        this.nfftValues = this.loadSetting('nfft', defaultNfftValues);
        this.displayLengthValues = this.loadSetting('display-length', defaultDisplayLengthValues);
        this.mustSaveToDisk = this.loadSetting('save-to-disk', defaultSaveToDisk);
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
        this.saveSetting('save-to-disk', 'none', toDisk ? 1 : 0);
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

    /**
     * 
     * @param settingName The name of the setting to save (e.g: 'nfft' for a nfft value)
     * @param visualizer The visualizer concerned by the setting
     * @param value The value of the setting to save
     */
    private saveSetting(settingName: string, visualizer: Visualizer, value: number) {
        this.storage.saveSetting(this.getSettingKey(settingName, visualizer), value.toString());
    }

    /**
     * 
     * @param settingName The name of the setting to load (e.g: 'nfft' for the nfft values)
     * @param defaultValues The values to use by default (when not present in the localstorage)
     * @returns The {@link Settings} object formed with the values of the localstorage, and the
     * default values for those not present in the localstorage
     */
    private loadSetting(settingName: string, defaultValues: Settings): Settings {
        var ret: Settings = {};
        this.visualizers.forEach(visualizer => {
            var value = defaultValues[visualizer];
            if(value !== undefined) {
                var storageSetting: number | undefined = Number(this.storage.getSetting(this.getSettingKey(settingName, visualizer)));
                if(isNaN(storageSetting)) {
                    storageSetting = undefined
                }
                ret[visualizer] = +(storageSetting || value);
            }
        });
        return ret;
    }

    /**
     * Computes the key to use in the localstorage to store a setting for the given visualizer
     * @param settingName The name of the setting to save/load
     * @param visualizer The visualizer to save/load the setting for
     */
    private getSettingKey(settingName: string, visualizer: Visualizer) {
        return visualizer === 'none' ? settingName : settingName + "-" + visualizer;
    }


}