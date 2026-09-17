export var LocalStorageKey = 'newGame'

export class StorageMgr {
    private static _instance: StorageMgr;
    static get inst(): StorageMgr {
        StorageMgr._instance = StorageMgr._instance || new StorageMgr();
        return StorageMgr._instance;
    }

    save(data) {
        let str = JSON.stringify(data);
        this.saveData(LocalStorageKey, str);
    }

    saveData(key: string, value: any, callback?: Function, aes: boolean = false) {
        //3.x：用 Laya.LocalStorage 代替原生 localStorage，兼容小游戏环境
        Laya.LocalStorage.setItem(key, value);
    }

    getDate(): string {
        return Laya.LocalStorage.getItem(LocalStorageKey);
    }

    clearData() {
        Laya.LocalStorage.removeItem(LocalStorageKey);
    }

}
