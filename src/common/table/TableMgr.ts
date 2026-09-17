import { TableData2 } from "./TableData2";

/** 静态表管理器 */
export class TableMgr {

    private static _inst: TableMgr;
    static get inst(): TableMgr {
        TableMgr._inst = TableMgr._inst || new TableMgr();
        return TableMgr._inst;
    }

    constructor() {
        this.init();
    }

    // -------- 静态表的增加的地方 ---------
    sys_artillery: TableData2<shoot.data.Artillery>;//炮台
    sys_plant: TableData2<shoot.data.Plant>;//太阳花
    sys_door: TableData2<shoot.data.Door>;
    sys_Diamonds: TableData2<shoot.data.Diamonds>;
    sys_Coin: TableData2<shoot.data.Coin>;
    sys_Technology: TableData2<shoot.data.Technology>;

    init(): void {
        this._setConst();
        this.sys_artillery = this.registerTable2("Artillery", "level");
        this.sys_plant = this.registerTable2("Plant", "level");
        this.sys_door = this.registerTable2("Door", "level");
        this.sys_Diamonds = this.registerTable2("Diamonds", "level");
        this.sys_Coin = this.registerTable2("Coin", "level");
        this.sys_Technology = this.registerTable2("Technology", "id");
    }

    registerTable2<T>(tableName: string, keyName?: string | string[], cls?: any, callback?: Function): TableData2<T> {
        var tableName = tableName.split(".")[0];
        if (!cls) { cls = TableData2; }
        // 这里的 sdata 是window下挂载的数据壳子
        var dataHash = new cls(window['sdata'][tableName], keyName);
        if (!!callback) callback();
        return dataHash;
    }

    // -------- 以上为静态表的位置 ---------
    protected _setConst() {
        // 这里要注意xlsx2json中的const的配置
        // const表比较特殊，使用k7的导出方式,不方便统一管理调用,只能先将const挂载在window上,然后可以调用导出的类型
        window['sConst'] = window['sdata']['Const'];

    }
}


