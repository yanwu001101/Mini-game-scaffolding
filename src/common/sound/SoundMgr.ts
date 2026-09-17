
/**播放音效
 * 文件名 不带后缀
 * 3.x 迁移版：去除 fairygui UIConfig 依赖
*/

import { dataMgr } from "../../GameData";
import { Native } from "../platform/Native";
import { PlatMgr } from "../platform/PlatMgr";

export class SoundMgr {
    static soundUrl: string = "resources/sound/"
    static type: string = "mp3"

    /**
     * 短震动
     */
    static vibrateShort() {
        if (SoundMgr.instance._shakeStatus) {
            if (PlatMgr.isNative) {
                Native.Vibrate(1);
            } else if (PlatMgr.PlatObj && PlatMgr.PlatObj.vibrateShort) {
                PlatMgr.PlatObj.vibrateShort({});
            }
        }
    }
    /**
     * 长震动
     */
    static vibrateLong() {
        if (SoundMgr.instance._shakeStatus) {
            if (PlatMgr.isNative) {
                Native.Vibrate(2);
            } else if (PlatMgr.PlatObj && PlatMgr.PlatObj.vibrateLong) {
                PlatMgr.PlatObj.vibrateLong({});
            }
        }
    }
    private _currentBg: string;
    private _musicStatus: boolean;
    private _soundStatus: boolean;
    private _shakeStatus: boolean;
    constructor() {

    }

    private static _instance: SoundMgr;
    public static get instance(): SoundMgr {
        if (!SoundMgr._instance) {
            SoundMgr._instance = new SoundMgr();
        }
        return SoundMgr._instance;
    }

    /**
     * 初始化
     * @param soundUrl 声音资源存放位置
     * @param type 声音格式扩展名
     * @param buttonName 按钮音效名称（无 GUI 框架后仅保留参数兼容）
     */
    public init(soundUrl: string = "resources/sound/", type: string = "mp3", buttonName: string = null) {
        console.log("sound init soundUrl", soundUrl);
        console.log("sound init type", type);

        SoundMgr.soundUrl = soundUrl;
        SoundMgr.type = type;
        if (dataMgr.sound) {
            this.resumeSound();
        }
        else {
            this.stopSound();
        }
    }

    /**
     * 播放背景音乐
     * @param url
     * @param loop
     */
    public playMusic(name: string, loop: number = 0): void {
        if (!dataMgr.music) return;
        this.stopMusic();
        if (name)
            this._currentBg = name;
        if (this._currentBg)
            Laya.SoundManager.playMusic(SoundMgr.soundUrl + this._currentBg + "." + SoundMgr.type, loop);
    }

    /**
     * 播放音效
     * @param name
     * @param loop
     */
    public playSound(name: string, loop: number = 1): void {
        if (!dataMgr.sound) return;
        let url = SoundMgr.soundUrl + name + "." + SoundMgr.type;
        Laya.SoundManager.playSound(url, loop);
    }

    public stopSound(name?: string) {
        if (name) {
            let url = SoundMgr.soundUrl + name + "." + SoundMgr.type;
            Laya.SoundManager.stopSound(url);
        } else {
            Laya.SoundManager.soundMuted = true;
        }
    }

    public resumeSound() {
        Laya.SoundManager.soundMuted = false;
    }

    public stopAllSound(): void {
        Laya.SoundManager.stopAllSound();
    }

    public stopMusic(): void {
        Laya.SoundManager.stopMusic();
    }

    public resumeMusic(): void {
        SoundMgr.instance.playMusic(null);
    }

    /**音效是否静音 */
    public set soundStatus(b: boolean) {
        this._soundStatus = b;
        Laya.SoundManager.soundMuted = b;
        Laya.LocalStorage.setItem('soundMuted', b ? '1' : '0');
        if (b) {
            Laya.SoundManager.stopAllSound();
        }
    }

    /**获取背景音乐是否静音状态 */
    public get musicStatus(): boolean {
        return this._musicStatus;
    }

    /**获取音效是否静音状态 */
    public get soundStatus(): boolean {
        return this._soundStatus;
    }
    public set shakeStatus(value) {
        this._shakeStatus = value;
        if (value)
            Laya.LocalStorage.setItem("Shake", "1");
        else
            Laya.LocalStorage.setItem("Shake", "0");
    }
    public get shakeStatus() {
        return this._shakeStatus;
    }

}

export var soundMgr = SoundMgr.instance;
