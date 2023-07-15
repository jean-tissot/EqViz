import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IndexedDBService {

    static dbName = "EqVizStorage";
    static dbVersion = 1;
    static dbAudioTable = "AudioTable";
    static dbAudioKeyName = "id";

    private db?: IDBDatabase;

    constructor() {
        if (!window.indexedDB) {
            // TODO: open a popup to alert the user (but only the first time → create a cookie/localstorage key)
            // TODO: remove the "save to browser" option in the settings bar
            console.log("IndededDB not supported. Audio files will not be saved in the browser")
        }
    }

    /**
     * Gets the EqvizStorage db, and creates it if necessary
     */
    private requestDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            if (window.indexedDB) {
                console.log("Requesting the EqVizStorage indexed DB");
                const request = window.indexedDB.open(IndexedDBService.dbName, IndexedDBService.dbVersion);
                request.onupgradeneeded = event => this.initDB((event.target as any).result);
                request.onsuccess = () => {
                    this.checkDBOk(request.result).then(db => {
                        this.db = db;
                        resolve(db);
                    })
                }
                // TODO: if error is VersionError we might delete the database and call requestDB again
                request.onerror = reject;
            } else {
                reject();
            }
        });
    }

    private initDB(db: IDBDatabase) {
        console.log("Creating the audio table in the EqVizStorage db");
        const objectStore = db.createObjectStore(IndexedDBService.dbAudioTable, { keyPath: IndexedDBService.dbAudioKeyName, autoIncrement: true });
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.transaction.oncomplete = () => console.log("Audio table created");
    }

    /**
     * Checkes if the db contains the audio table.
     * @returns the given db if ok, else the db from a new requestDB call
     */
    private checkDBOk(db: IDBDatabase) {
        if (!db.objectStoreNames.contains(IndexedDBService.dbAudioTable)) {
            indexedDB.deleteDatabase(IndexedDBService.dbName);
            return this.requestDB();
        } else {
            return Promise.resolve(db);
        }
    }

    /**
     * Gets the EqVizStorage db (makes the request if necessary) 
     */
    public getDB(): Promise<IDBDatabase> {
        if (this.db) {
            return Promise.resolve(this.db);
        } else {
            return this.requestDB();
        }
    }
}