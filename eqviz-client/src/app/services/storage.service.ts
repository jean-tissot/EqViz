import { Injectable } from "@angular/core";
import * as localforage from "localforage";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    saveToDisk(file: Blob, name: string) {
        console.log("Saving file '%s' to disk", name);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
    }

    loadFromDisk(): File {
        // TODO: load a file from the disk
        return new File([], "");
    }

    saveToBrowser(content: Blob, name: string): Promise<string | void> {
        const file = new File([content], name);
        return localforage.setItem(name, file).then(() => {
            console.log("File %s saved to the browser", name);
            return name;
        }).catch(error => this.saveToDiskInErrorCase(file, name, error));
    }

    /**
     * Gets all the files saved in the browser (EqVizStorage/AudioTable)
     * TODO: It would be better to return a Map with File names as values (and ids as key)
     * and to use the {@link getSavedFile} method to get only the File needed, when it is necessary
     * 
     * @returns A {@link Map} with Files as values and File ids as keys
     */
    getSavedFiles(): Promise<Map<string, File>> {
        return localforage.keys().then(keys => {
            const result = new Map<string, File>();
            keys.forEach(key => {
                localforage.getItem(key).then(file => {
                    if (file instanceof Blob) {
                        result.set(key, new File([file], key));
                    }
                });
            });
            return result;
        });
    }

    getSavedFile(id: string): File {
        // TODO: return the file with the given id
        return new File([], "");
    }

    private saveToDiskInErrorCase(file: Blob, name: string, error: Event) {
        console.log("Error while saving to the browser", error);
        alert("An error occured while saving the audio to the browser. Saving it to the disk...");
        this.saveToDisk(file, name);
    }

    saveSetting(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    getSetting(key: string): string | null {
        return localStorage.getItem(key);
    }

}