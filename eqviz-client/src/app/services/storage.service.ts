import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    saveToDisk(file: Blob, name: string) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }

    saveToBrowser(file: Blob, name: string) {
        // TODO: save file to local storage ? indexDB ?
    }

    saveSetting(key: string, value: string) {
        // TODO: save to local storage ?
    }

    getSetting(key: string): string | null {
        // TODO: get from local storage
        return null;
    }

}