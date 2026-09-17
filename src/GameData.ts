import Mvc from "./common/mvc/Mvc";
import { StorageMgr } from "./common/utils/StorageMgr";
import { TimeTools } from "./common/utils/TimeTools";
import Const from "./Const";
// import Const, { GameMode } from "./Const";

/**游戏数据 */
export class Data {
    /**在线时间 */
    aliveTime: number;
    /**是否签到 */
    isSign: boolean;
    /**是否新手 */
    isNewPlayer: boolean;
    /**玩家金币 */
    coin: number;
    /**是否同意隐私政策 */
    secret: number;
    /**背景音乐开关 */
    musicOnOff: boolean;
    /**音效开关 */
    soundOnOff: boolean;
    /**引导 */
    guide: number;
    /**抽奖当日剩余次数 */
    luckDrawNum: number;
    /**体力 */
    power: number;
    /**解锁 */
    unLockIndex: number;
}

/**
 * 玩家数据管理
 */
export class GameDataMgr {
    private static _inst: GameDataMgr;
    static get inst(): GameDataMgr {
        GameDataMgr._inst = GameDataMgr._inst || new GameDataMgr();
        return GameDataMgr._inst;
    }

    public gameLevel: number = 0;

    gameData: Data;

    initData() {
        let str = StorageMgr.inst.getDate();
        if (str) {
            this.gameData = JSON.parse(str);
            this._addDataField();
            this._resetDataByNeed();
        } else {
            let now = Date.now();
            this.gameData = {
                aliveTime: now,
                isSign: false,
                isNewPlayer: true,
                coin: 0,
                secret: 0,
                musicOnOff: true,
                soundOnOff: true,
                guide: 0,
                luckDrawNum: 5,
                power: 10,
                unLockIndex: 1
            }
        }
    }

    /**清空数据 */
    clearData() {
        StorageMgr.inst.clearData();
        this.initData();
        Mvc.Send(Const.MVC_CASH_CHANGE);
    }

    get unLockIndex() {
        return this.gameData.unLockIndex;
    }

    set unLockIndex(index: number) {
        this.gameData.unLockIndex = index;
        this.saveData();
    }

    get isSign() {
        return this.gameData.isSign;
    }

    set isSign(sign: boolean) {
        this.gameData.isSign = sign;
        this.saveData();
    }

    get isNewPlayer() {
        return this.gameData.isNewPlayer;
    }

    set isNewPlayer(isNew: boolean) {
        this.gameData.isNewPlayer = isNew;
        this.saveData();
    }

    get Power() {
        return this.gameData.power;
    }

    set Power(p: number) {
        this.gameData.power = p;
        this.saveData();
        Mvc.Send(Const.MVC_POWER);
    }

    usePower() {
        if (this.gameData.power > 0) {
            this.gameData.power--;
            this.saveData();
            Mvc.Send(Const.MVC_POWER);
            return true;
        }
        return false;
    }

    get luckDrawNum(): number {
        return this.gameData.luckDrawNum;
    }

    set luckDrawNum(num: number) {
        this.gameData.luckDrawNum = num;
        this.saveData();
    }

    get guide(): number {
        return this.gameData.guide;
    }

    set guide(index: number) {
        this.gameData.guide = index;
        this.saveData();
    }

    get aliveTime(): number {
        return this.gameData.aliveTime;
    }

    get music() {
        return this.gameData.musicOnOff;
    }

    set music(on: boolean) {
        this.gameData.musicOnOff = on;
        this.saveData();
    }

    get sound() {
        return this.gameData.soundOnOff;
    }

    set sound(on: boolean) {
        this.gameData.soundOnOff = on;
        this.saveData();
    }

    /** 新加的字段,游戏上线后加的数据 */
    private _addDataField() {

    }

    /**根据需要重置数据 */
    protected _resetDataByNeed() {
        /** 每日重置的 */
        if (!TimeTools.isSameDay(dataMgr.gameData.aliveTime, TimeTools.getCrtTime())) {
            this.gameData.luckDrawNum = 5;
            this.gameData.power = 10;
            this.gameData.isSign = false;
        }
    }

    /**设置隐私政策 */
    setSecret() {
        this.gameData.secret = 1;
        this.saveData();
    }

    /**
     * 增加金币
     * @param coin 
     */
    set Coin(coin: number) {
        // console.log("addCoin:", coin);
        this.gameData.coin = coin;
        this.saveData();
        Mvc.Send(Const.MVC_CASH_CHANGE);
    }

    /**
     * 玩家的金币
     * @returns 
     */
    get Coin(): number {
        return this.gameData.coin;
    }

    /**
     * 使用金币
     * @param coin 
     */
    useCoin(coin: number): boolean {
        if (coin <= this.gameData.coin) {
            this.gameData.coin -= coin;
            this.saveData();
            Mvc.Send(Const.MVC_CASH_CHANGE);
            return true;
        }
        else {
            return false;
        }
    }



    /**隐私政策 */
    getSecret() {
        return this.gameData.secret;
    }

    /**
     * 保存数据
     */
    saveData() {
        dataMgr.gameData.aliveTime = TimeTools.getCrtTime();
        StorageMgr.inst.save(this.gameData);
    }
}

export var dataMgr = GameDataMgr.inst;