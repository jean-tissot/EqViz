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

    saveToBrowser(file: Blob, name: string) {
        this.dbService.getDB().then(db => {
            var transaction = db.transaction(IndexedDBService.dbAudioTable, "readwrite");
            transaction.onerror = (err) => this.saveToDiskInErrorCase(file, name, err);
            var request = transaction.objectStore(IndexedDBService.dbAudioTable).add(new File([file], name));
            request.onsuccess = () => console.log("File %s saved to the browser", name);
            request.onerror = (err) => this.saveToDiskInErrorCase(file, name, err);
        }).catch(error => {
            console.log(error);
            alert("Cannot access the indexed DB. It may be because you didn't authorize it. Saving to the disk...");
            this.saveToDisk(file, name);
        })
        // TODO: return a Promise encapsulating the id of the file created
    }

    getSavedFiles(): Promise<Map<number, string>[]> {
        // TODO: return list of saved file (key: id, value: filename)
        return Promise.resolve([]);
    }

    getSavedFile(id: number): File {
        // TODO: return the file with the given id
        return new File([], "");
    }

    private saveToDiskInErrorCase(file: Blob, name: string, error: Event) {
        console.log("Error while saving to the browser", error);
        alert("An error occured while saving the audio to the browser. Saving it to the disk...");
        this.saveToDisk(file, name);
    }

    saveSetting(key: string, value: string) {
        // TODO: save to local storage ?
    }

    getSetting(key: string): string | null {
        // TODO: get from local storage
        return null;
    }

}