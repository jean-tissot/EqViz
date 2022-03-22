import { Injectable } from "@angular/core";
import { IndexedDBService } from "./indexed-db.service";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor(private dbService: IndexedDBService) {}

    saveToDisk(file: Blob, name: string) {
        var a = document.createElement("a");
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

    saveToBrowser(file: Blob, name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dbService.getDB().then(db => {
                var transaction = db.transaction(IndexedDBService.dbAudioTable, "readwrite");
                transaction.onerror = (err) => this.saveToDiskInErrorCase(file, name, err);
                var request = transaction.objectStore(IndexedDBService.dbAudioTable).add(new File([file], name));
                request.onsuccess = () => {
                    console.log("File %s saved to the browser with id %s", name, request.result);
                    resolve(request.result.toString());
                }
                request.onerror = (err) => {
                    this.saveToDiskInErrorCase(file, name, err);
                    reject(err);
                }
            }).catch(error => {
                console.log(error);
                alert("Cannot access the indexed DB. It may be because you didn't authorize it. Saving to the disk...");
                this.saveToDisk(file, name);
            });
        });
    }

    getSavedFiles(): Promise<Map<string, File>> {
        return new Promise((resolve, reject) => {
            this.dbService.getDB().then(db => {
                var transaction = db.transaction(IndexedDBService.dbAudioTable, "readonly");
                var objectStore = transaction.objectStore(IndexedDBService.dbAudioTable);
                var keys = objectStore.getAllKeys();
                var result = new Map<string, File>();
                keys.onsuccess = () => {
                    console.log(keys.result);
                    keys.result.forEach(key => {
                        var request = objectStore.get(key);
                        request.onsuccess = () => result.set(key.toString(), request.result);
                    });
                }
                transaction.oncomplete = () => resolve(result);
                transaction.onerror = (error) => reject(error);
            })
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