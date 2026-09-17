import { HashList } from "./HashList";

export class TableData2<T>{
    protected _hashList: HashList<T>;
    protected _primaryKey: string;

    constructor(data: any, keyName?: string | string[]) {

        if (!data) {
            console.warn('传入无效数据:', data);
            return;
        }
        let tempKey = keyName ? keyName : data.primaryKey;
        this._hashList = new HashList(data, tempKey);
    }

    getData(key: string | number, ...arg): T {
        return this._hashList.getData(key, ...arg);
    }

    getArr(): T[] {
        return this._hashList.arr;
    }

    getHash() {
        return this._hashList.hash;
    }

    get length() {
        return this.getArr().length;
    }

}
