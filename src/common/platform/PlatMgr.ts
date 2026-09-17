
import Mvc from "../mvc/Mvc";
import { Native } from "./Native";
import { soundMgr } from "../sound/SoundMgr";
import AdSDK from "../../sdk/AdSDK";
import AdSdkOppoRpk from "../../sdk/AdSdkOppoRpk";
import AdSdkVivoRpk from "../../sdk/AdSdkVivoRpk";
import AdSdkHwRpk from "../../sdk/AdSdkHwRpk";
import AdSdkTT from "../../sdk/AdSdkTT";
import AdSdkWx from "../../sdk/AdSdkWx";
import AdSdkPc from "../../sdk/AdSdkPc";
import AdSdkVivoApk from "../../sdk/AdSdkVivoApk";
import AdSdkOppoApk from "../../sdk/AdSdkOppoApk";
import AdSdkHwApk from "../../sdk/AdSdkHwApk";
import AdSdkXmApk from "../../sdk/AdSdkXmApk";
import AdSdkMmyApk from "../../sdk/AdSdkMmyApk";
import AdSdkRyApk from "../../sdk/AdSdkRyApk";
import AdSdk233Apk from "../../sdk/AdSdk233Apk";
import AdSdkTapApk from "../../sdk/AdSdkTapApk";
import AdSdkTopOnApk from "../../sdk/AdSdkTopOnApk";

export enum PlatType {
    /**白包 */
    PC = 0,
    VivoRpk = 1,
    OppoRpk = 2,
    HwRpk = 3,
    /**抖音 */
    TT = 4,
    /**微信 */
    WX = 5,
    VivoApk = 6,
    OppoApk = 7,
    HwApk = 8,
    /**小米 */
    XmApk = 9,
    GoogleApk = 10,
    /**摸摸鱼 */
    MMY = 11,
    /**荣耀 */
    RyRpk = 12,
    RyApk = 13,
    /**233 */
    Ch233Apk = 14,
    /**taptap */
    TapApk = 15,
    /**topOn */
    topOn = 16,
}

export class SystemInfo {
    brand: string;
    screenWidth: number;//屏幕宽度	>= 1.1.0
    screenHeight: number;//	屏幕高度	>= 1.1.0
    windowWidth: number;//可使用窗口宽度
    windowHeight: number;//	可使用窗口高度
    model: string;//手机型号 iPhoneX
    appName: string;//渠道平台
    platformVersion: number; // OPPO平台版本号
    platformVersionCode: number;//VIVO 最低平台版本号
    version: string;//版本号
    pixelRatio: number//设备像素比
    safeArea: any
}

export class PlatMgr {

    public static AdSdk: AdSDK;
    public static BasePath = "";
    public static platObj: any;
    public static PLATFORM: PlatType = <PlatType>PlatType.PC;

    private static _systemInfo: SystemInfo;
    public static get systemInfo(): SystemInfo {
        return PlatMgr._systemInfo;
    }

    public static get PlatObj(): any {
        return PlatMgr.platObj;
    }

    public static init() {
        if (PlatMgr.isNative) {
            console.log("app 端");
            Native.Init();
            PlatMgr.PLATFORM = PlatType.PC;
            PlatMgr.AdSdk = new AdSdkPc();
            soundMgr.init("resources/sound/", "ogg");
            Native.getSdkChannelID(this, (res) => {
                PlatMgr.PLATFORM = res.id;
                console.log("PlatMgr.PLATFORM:" + PlatMgr.PLATFORM);
                switch (PlatMgr.PLATFORM) {
                    case PlatType.VivoApk:
                        PlatMgr.AdSdk = new AdSdkVivoApk();
                        break;
                    case PlatType.OppoApk:
                        PlatMgr.AdSdk = new AdSdkOppoApk();
                        break;
                    case PlatType.HwApk:
                        PlatMgr.AdSdk = new AdSdkHwApk();
                        break;
                    case PlatType.XmApk:
                        PlatMgr.AdSdk = new AdSdkXmApk();
                        break;
                    case PlatType.GoogleApk:
                        break;
                    case PlatType.MMY:
                        PlatMgr.AdSdk = new AdSdkMmyApk();
                        break;
                    case PlatType.RyApk:
                        PlatMgr.AdSdk = new AdSdkRyApk();
                        break;
                    case PlatType.Ch233Apk:
                        PlatMgr.AdSdk = new AdSdk233Apk();
                        break;
                    case PlatType.TapApk:
                        PlatMgr.AdSdk = new AdSdkTapApk();
                        break;
                    case PlatType.topOn:
                        PlatMgr.AdSdk = new AdSdkTopOnApk();
                        break;
                }
            });
        } else {
            soundMgr.init("resources/sound/", "mp3");
            if (Laya.Browser.onQGMiniGame) {
                PlatMgr.PLATFORM = PlatType.OppoRpk;
                PlatMgr.platObj = (<any>Laya.Browser.window).qg;
                PlatMgr.AdSdk = new AdSdkOppoRpk();
            } else if (Laya.Browser.onVVMiniGame) {
                PlatMgr.platObj = (<any>Laya.Browser.window).qg;
                PlatMgr.PLATFORM = PlatType.VivoRpk;
                PlatMgr.AdSdk = new AdSdkVivoRpk();
            } else if (Laya.Browser.onHWMiniGame) {
                PlatMgr.PLATFORM = PlatType.HwRpk;
                PlatMgr.platObj = (<any>Laya.Browser.window).qg;
                PlatMgr.AdSdk = new AdSdkHwRpk();
            } else if ((<any>Laya.Browser.window).tt) {
                PlatMgr.platObj = (<any>Laya.Browser.window).tt;
                PlatMgr.PLATFORM = PlatType.TT;
                PlatMgr.AdSdk = new AdSdkTT();
            } else if (Laya.Browser.onMiniGame) {
                PlatMgr.platObj = (<any>Laya.Browser.window).wx;
                PlatMgr.PLATFORM = PlatType.WX;
                PlatMgr.AdSdk = new AdSdkWx();
            } else {
                PlatMgr.PLATFORM = PlatType.PC;
                PlatMgr.AdSdk = new AdSdkPc();
            }

            if (PlatMgr.PLATFORM != PlatType.PC) {
                PlatMgr._systemInfo = PlatMgr.PlatObj.getSystemInfoSync();
                console.log("PlatMgr._systemInfo:", JSON.stringify(PlatMgr._systemInfo));
            }
        }
    }

    /**是否是native环境 */
    public static get isNative() {
        return Native.isNative;
    }

    /**是否是小游戏环境 */
    public static get isMiniGame(): boolean {
        switch (PlatMgr.PLATFORM) {
            case PlatType.HwRpk:
                return Laya.Browser.onHWMiniGame;
            case PlatType.OppoRpk:
                return Laya.Browser.onQGMiniGame;
            case PlatType.VivoRpk:
                return Laya.Browser.onVVMiniGame;
            case PlatType.TT:
                return !!(<any>Laya.Browser.window).tt;
            case PlatType.WX:
                return !!(<any>Laya.Browser.window).wx;
        }
        return false;
    }

    /**
     * 3.x 迁移说明：不再有分包(subpack)与 zip 热更，
     * 3D 场景已由 IDE 静态打包进工程，此处仅保留统一入口直接回调。
     */
    public static loadSubpackage(caller: any, callback: Function) {
        if (caller && callback) {
            callback.call(caller, { code: 0 });
        }
    }

    public static get ttAppName(): string {
        if (PlatMgr.PLATFORM != PlatType.TT) return null;
        if (!PlatMgr.isMiniGame) return null;
        if (PlatMgr.PlatObj.getSystemInfoSync) {
            const info = PlatMgr.PlatObj.getSystemInfoSync();
            console.log(info.appName);
            if (info.appName) {
                return info.appName.toUpperCase()
            }
        }
        return null;
    }

    /**是否抖音 */
    public static get isDouYin(): boolean {
        if (PlatMgr.PLATFORM != PlatType.TT) return false;
        return this.ttAppName === "DOUYIN"
    }

    /**
      * 当返回焦点时回调
      * data{query{
          自定义key	string
        }}
      * @param caller
      * @param callback
      */
    public static OnShow(caller?: any, callback?: Function): void {
        if (PlatMgr.isMiniGame) {
            PlatMgr.PlatObj.onShow((response) => {
                if (caller && callback) {
                    callback.call(caller, { code: 0 });
                }
                Mvc.Send(Mvc.MINI_ONSHOW, response);
            })
        }
    }

    public static OnHide(caller?: any, callback?: Function): void {
        if (PlatMgr.isMiniGame) {
            PlatMgr.PlatObj.onHide((response) => {
                console.log("miniGame OnHide");
                if (caller && callback) {
                    callback.call(caller, { code: 0 });
                }
                Mvc.Send(Mvc.MINI_ONHIDE, response);
            })
        }
    }

    /**
     * 创建小游戏的桌面图标
     */
    public static installShortcut() {
        if (PlatMgr.platObj && PlatMgr.platObj.hasShortcutInstalled) {
            PlatMgr.platObj.hasShortcutInstalled({
                success: function (res) {
                    // 判断图标未存在时，创建图标
                    if (res == false) {
                        if (PlatMgr.platObj.installShortcut) {
                            PlatMgr.platObj.installShortcut({
                                success: function () {
                                    // 执行用户创建图标奖励
                                },
                                fail: function (err) { },
                                complete: function () { }
                            })
                        }

                    }
                },
                fail: function (err) { },
                complete: function () { }
            })
        }
    }


    /**
     * 华为登录
     * @param caller
     * @param callback 0：随便玩，1：未成年，2：失败不准玩
     */
    public static miniLogin(caller?: any, callback?: Function) {
        if (PlatMgr.PLATFORM == PlatType.HwRpk) {
            console.log("appId:", PlatMgr.AdSdk.AppId);
            PlatMgr.platObj.gameLoginWithReal({
                forceLogin: 1,
                appid: PlatMgr.AdSdk.AppId,
                success: function (data) {
                    console.log("Game login success:" + JSON.stringify(data));
                    if (PlatMgr.platObj.submitPlayerEvent) {
                        PlatMgr.platObj.submitPlayerEvent({
                            eventId: Date.now(),
                            eventType: "GAMEBEGIN",
                            success: function (res) {
                                console.log("Returned data:" + JSON.stringify(res));
                                let transactionId = res.transactionId;
                                PlatMgr.platObj.getPlayerExtraInfo({
                                    transactionId: transactionId,
                                    success: function (res) {
                                        console.log("get player ExtraInfo success");
                                        console.log(JSON.stringify(res));
                                        if (!res.isAdult && res.isRealName) {
                                            //事件上报成功，玩家未成年，根据要求，中国大陆的玩家只能在周五、周六、周日、节假日的20:00-21：00玩游戏。
                                            console.log("The player is not an adult ,and has passed identity verification.");
                                            callback.call(caller, { code: 1 });
                                        } else {
                                            callback.call(caller, { code: 0 });
                                        }
                                    },
                                    fail: function (data, code) {
                                        if (code == 7002 || code == 7006) {
                                            console.log("帐号不是在中国大陆注册，不需要做处理");
                                            callback.call(caller, { code: 0 });
                                        }
                                    }
                                });
                            },
                            fail: function (data, code) {
                                if (code == 7002 || code == 7006 || code == 7022) {
                                    console.log("不需要处理", code)
                                    callback.call(caller, { code: 0 });
                                }
                            }
                        });
                    }
                },
                fail: function (data, code) {
                    console.log("Game login fail:" + data + ", code:" + code);
                    callback.call(caller, { code: 2 });
                }
            })
        }
        else {
            callback.call(caller, { code: 0 });
        }
    }

    /**获取网络状态 */
    public static getNetworkType(caller: any, callback: Function) {
        if (PlatMgr.platObj.getNetworkType) {
            PlatMgr.platObj.getNetworkType({
                success: function (res) {
                    if (res.networkType != "none") {
                        callback.call(caller, { code: 0 });
                    }
                    else {
                        callback.call(caller, { code: 1 });
                    }
                    console.log("getNetworkType success networkType" + res.networkType);
                },
                fail: function () {
                    callback.call(caller, { code: 1 });
                    console.log("getNetworkType fail");
                },
                complete: function () {
                    console.log("getNetworkType complete");
                }
            });
        }
    }

}
