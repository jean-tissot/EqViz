import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private static dbName = "EqVizStorage";
    private static dbVersion = 1;
    private static dbAudioTable = "AudioTable";
    private static dbAudioKeyName = "id";

    private db?: IDBDatabase;
    
    constructor() {
        if(!window.indexedDB) {
            // TODO: open a popup to alert the user (but only the first time → create a cookie/localstorage key)
            console.log("IndededDB not supported. Audio files will not be saved in the browser")
        }
    }

    private requestDB() : Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if(window.indexedDB) {
                console.log("Requesting the indexed DB");
                var request = window.indexedDB.open(StorageService.dbName, StorageService.dbVersion);
                request.onupgradeneeded = event => this.initDB((event.target as any).result);
                request.onsuccess = () => {
                    this.db = request.result;
                    this.checkDBAudioTable(this.db);
                    // TODO: add the this.db.onerror callback (if error code VER_ERR → call this.initDb())
                    resolve(this.db);
                }
                request.onerror = reject;
            } else {
                reject();
            }
        });
    }

    private initDB(db: IDBDatabase) {
        console.log("Checking if the audio table exists in the indexed DB");
        var objectStore = db.createObjectStore(StorageService.dbAudioTable, {keyPath: StorageService.dbAudioKeyName, autoIncrement: true});
        objectStore.createIndex("name", "name", {unique: false});
        objectStore.transaction.oncomplete = () => console.log("Audio table created");
    }

    private checkDBAudioTable(db: IDBDatabase) {
        // TODO: transaction must be in "versionUpdate" mode
        if(!db.objectStoreNames.contains(StorageService.dbAudioTable)) {
            // var objectStore = db.createObjectStore(StorageService.dbAudioTable, {keyPath: StorageService.dbAudioKeyName, autoIncrement: true});
            // objectStore.createIndex("name", "name", {unique: false});
            // objectStore.transaction.oncomplete = () => console.log("Audio table created");
        }
    }

    private getDB(): Promise<IDBDatabase> {
        if(this.db) {
            return Promise.resolve(this.db);
        } else {
            return this.requestDB();
        }
    }

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
        this.getDB().then(db => {
            var transaction = db.transaction(StorageService.dbAudioTable, "readwrite");
            transaction.onerror = () => this.saveToDiskInErrorCase(file, name);
            var request = transaction.objectStore(StorageService.dbAudioTable).add(new File([file], name));
            request.onsuccess = () => console.log("File %s saved to the browser", name);
            request.onerror = () => this.saveToDiskInErrorCase(file, name);
        }).catch(error => {
            console.log(error);
            alert("Cannot access the indexed DB. It may be because you didn't authorize it. Saving to the disk...");
            this.saveToDisk(file, name);
        })
        // TODO: return a Promise encapsulating the id of the file created
    }

    private saveToDiskInErrorCase(file: Blob, name: string) {
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