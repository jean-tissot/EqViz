import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private currentVisualizerSubscription = new BehaviorSubject<number>(0);
    private currentVisualizer = 0;

    visualiserChange(): Observable<number> {
        return this.currentVisualizerSubscription.asObservable();
    }

    setCurrentVisualizer(current: number) {
        this.currentVisualizer = current;
        this.currentVisualizerSubscription.next(current);
    }



}