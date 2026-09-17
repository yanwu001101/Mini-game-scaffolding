
export class HashList<T>{
    protected _hash: { [key: string]: T };
    protected _arr: T[];
    protected _keyName: string | string[];

    constructor(arr: T[], keyName: string | string[]) {
        this._hash = {};
        this._arr = arr;
        this._keyName = keyName;
        this._setHash(arr);
    }

    protected _setHash(arr: T[]) {
        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i];
            let key = this._getKey(temp)
            this._hash[key] = temp;
        }
    }

    protected _getKey(d: T) {
        if (this._keyName) {
            if (typeof this._keyName == "string") {
                return d[this._keyName];
            } else {
                let realKey = d[this._keyName[0]];
                for (let i = 1; i < this._keyName.length; i++) {
                    realKey += "_" + d[this._keyName[i]];
                }
                return realKey;
            }
        }
        return 'ErrorKey';
    }

    getData(key: any, ...arg): T {
        let realKey = this._getRealKey(key, ...arg);
        return this._hash[realKey];
    }

    protected _getRealKey(key: any, ...arg): string {
        if (!arg || arg.length == 0) {
            return key;
        }
        let realKey = key;
        for (let i = 0; i < arg.length; i++) {
            realKey += "_" + arg[i];
        }
        return realKey;
    }

    addData(key: any, data: T, ...arg): void {
        let temp = this.getData(key, ...arg);
        if (!temp) {
            this._arr.push(data);
        }
        let realKey = this._getRealKey(key, ...arg);
        this._hash[realKey] = data;
    }

    removeData(key: any, ...arg) {
        let temp = this.getData(key, ...arg);
        if (temp) {
            let idx = this._arr.indexOf(temp);
            if (idx > -1) this._arr.splice(idx, 1);
        }
        let realKey = this._getRealKey(key, ...arg);
        delete this._hash[realKey];
    }

    get arr(): T[] {
        return this._arr;
    }

    get hash() {
        return this._hash;
    }

    get length() {
        return this._arr.length;
    }
}
