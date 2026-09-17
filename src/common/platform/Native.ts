

import { Tips } from "../utils/Tips";
import Mvc from "../mvc/Mvc";

export enum NativeCallType {
	ViewSize = 100,
	OpenWebview = 101,
	SdkId = 102,
	SplashAd = 10000,
	InterstitialAd = 10001,
	BannerAd = 10002,
	RewardAd = 10004,
	FullScreenAd = 10005,
	NativeIcon = 10006,
	Initname = 10007,
	HWSDKinit = 10008,
	/**原生插屏 */
	NativeInterstitialAd = 10009,
	/**华为登录 */
	HWlogin = 10010,
}
export enum ADStatus {
	ADStatusShowClicked = 93000,
	ADStatusShowClosed = 93001,
	ADStatusLoadFailed = 93002,
	ADStatusSkip = 93003,
	ADStatusLoadSuccess = 93004,
	ADStatusShowFinish = 93005,
	ADStatusShowRewardSuccess = 93006,
	ADStatusShowRewardFailed = 93007,
	ADStatusLoading = 93008,
	InitNameSuccess = 93009,
	HWloginsuccess = 94001,
	HWloginfail = 94002,
	HWSDKinitsuccess = 94003,
	HWSDKinitfail = 94004,
}
export class Native {
	public static Bridge: any;
	/**是否是native环境 */
	public static get isNative() {
		return (<any>Laya.Browser.window).conch != null;
	}
	/**
	 * 是否nativeAndroid环境
	 */
	public static isNativeAndroid: boolean;
	/**
	 * 是否nativeIOS环境
	 */
	public static isNativeIOS: boolean;

	public static nativeHeight: number;
	public static nativeWidth: number;
	public static naticeVideoCallback: Laya.Handler
	static Init() {
		var conchConfig = (<any>Laya.Browser.window).conchConfig;
		var os = conchConfig.getOS()
		if (os == "Conch-ios") {
			Native.isNativeIOS = true;
			Native.Bridge = (<any>Laya.Browser.window).PlatformClass.createClass("JSBridge");//创建脚本代理
			Native.Bridge.callWithBack(Native.NativeCallback, "NativeCallback:");//,JSON.stringify(obj)
		} else if (os == "Conch-android") {
			Native.isNativeAndroid = true;
			Native.Bridge = (<any>Laya.Browser.window).PlatformClass.createClass("demo.JSBridge");//创建脚本代理
			Native.Bridge.callWithBack(Native.NativeCallback, "NativeCallback");//,JSON.stringify(obj)
		}
		(<any>Laya.Browser.window).Native = Native;
	}

	//执行native方法
	public static bridgeCall(fun: string, arg: any): any {
		if (Native.Bridge) {
			console.log("执行Native方法" + fun);
			if (Native.isNativeIOS)
				fun += ":"
			if (arg == null || arg == undefined) {
				return Native.Bridge.call(fun, {});
			}
			else
				return Native.Bridge.call(fun, arg);
		}
	}
	//执行native 回调方法
	public static callWithBack(callbackfun: Function, fun: string, argArray: any): any {
		if (Native.Bridge) {
			// console.log("执行Native方法"+fun);
			if (Native.isNativeIOS)
				fun += ":"
			Native.Bridge.callWithBack(callbackfun, fun, argArray);
		}
	}
	public static NativeCallback(js: string) {
		console.log("NativeCallback:", js);
		var jsdata = JSON.parse(js);
		switch (jsdata.type) {
			case NativeCallType.HWlogin:
				if (jsdata.mess == ADStatus.HWloginsuccess) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 0 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.HWloginfail) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: -1 }])
						Native.naticeVideoCallback = null;
					}
				}
				break;
			case NativeCallType.HWSDKinit:
				console.log("NativeCallType.HWSDKinit:", jsdata.mess);
				if (jsdata.mess == ADStatus.HWSDKinitsuccess) {
					Mvc.Send(Mvc.HWSDKinitsuccess);
				} else if (jsdata.mess == ADStatus.HWSDKinitfail) {
					console.log("NativeCallType.HWSDKinit: false");
					Mvc.Send(Mvc.HWSDKinitfail);
				}
				break;
			case NativeCallType.NativeInterstitialAd:
				if (jsdata.mess == ADStatus.ADStatusLoadFailed) {
					// AdMgr.showInsertAd();
				}
				break;
			case NativeCallType.NativeIcon:
				if (jsdata.mess == ADStatus.ADStatusShowClosed) {
					Mvc.Send(Mvc.NATIVEICON_AD_CLOSE);
				}
				break;
			case NativeCallType.Initname:
				if (jsdata.mess == ADStatus.InitNameSuccess) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 0 }])
						Native.naticeVideoCallback = null;
					}
				}
				break;
			case NativeCallType.SdkId:
				let id = jsdata.data.ChannelID;
				if (Native.naticeVideoCallback) {
					Native.naticeVideoCallback.runWith([{ id: id }])
					Native.naticeVideoCallback = null;
				}
				break;
			case NativeCallType.ViewSize:
				Native.nativeWidth = jsdata.data.width;
				Native.nativeHeight = jsdata.data.height;
				break;
			case NativeCallType.InterstitialAd:

				if (jsdata.mess == ADStatus.ADStatusLoadSuccess) {
					Native.bridgeCall("showInterstitialAd", null);
				} else if (jsdata.mess == ADStatus.ADStatusShowClosed) {
					Native.bridgeCall("closeInterstitialAd", null);
				}
				break;
			case NativeCallType.BannerAd:
				if (jsdata.mess == ADStatus.ADStatusLoadSuccess) {
					Native.bridgeCall("showBannerAd", null);
				}
				break;
			case NativeCallType.RewardAd:
				if (jsdata.mess == ADStatus.ADStatusLoadSuccess) {
					Native.bridgeCall("showRewardvideoAd", null);
				} else if (jsdata.mess == ADStatus.ADStatusShowRewardSuccess) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 0 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.ADStatusSkip) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 1 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.ADStatusLoadFailed) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: -1 }])
						Native.naticeVideoCallback = null;
						Tips.showTips("暂无视频，稍后再试！");
					}
				} else if (jsdata.mess == ADStatus.ADStatusShowClosed) {
					Native.bridgeCall("closeRewardvideoAd", null);
				} else if (jsdata.mess == ADStatus.ADStatusShowRewardFailed) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 2 }])
						Native.naticeVideoCallback = null;
						Tips.showTips("暂无视频，稍后再试！");
					}
				}
				break;
			case NativeCallType.FullScreenAd:

				if (jsdata.mess == ADStatus.ADStatusLoadSuccess) {
					Native.bridgeCall("showFullScreenVideoAd", null);
				} else if (jsdata.mess == ADStatus.ADStatusShowFinish) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 0 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.ADStatusSkip) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: 1 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.ADStatusLoadFailed) {
					if (Native.naticeVideoCallback) {
						Native.naticeVideoCallback.runWith([{ code: -1 }])
						Native.naticeVideoCallback = null;
					}
				} else if (jsdata.mess == ADStatus.ADStatusShowClosed) {
					Native.bridgeCall("closeFullScreenvideoAd", null);
				}
				break;
			case NativeCallType.OpenWebview:
				(<any>Laya.Browser.window).conch.setExternalLinkEx(jsdata.data.url, 0, 0, window.innerWidth, window.innerHeight, true); // canclose设置为true
				break;
			// default:
			// 	break;
		}
	}
	/**初始化广告sdk */
	static initBUAdSDK(appid, mediaId = "", name = "") {
		console.log("ts initBUAdSDK = " + appid);

		Native.bridgeCall("initBUAdSDK", { id: appid, name: name, mediaId: mediaId, debug: false });
	}
	/**打开开屏广告 */
	static addSplashAD(adid) {
		Native.bridgeCall("addSplashAD", { id: adid });
	}
	/**振动  1短振 2长振*/
	static Vibrate(type) {
		Native.bridgeCall("vibrate", type);
	}
	/**显示banner */
	static showBannerAd(adid, offsetX: number = 0, offsetY: number = 0) {
		console.log("显示app banner", adid);
		var w = Math.min(Native.nativeWidth, Native.nativeHeight);
		let scale = Native.nativeWidth / Laya.stage.width;
		let h = 200;
		Native.bridgeCall("loadBannerAd", { id: adid, x: 0, y: (Laya.stage.height - h + offsetY) * scale, width: w, height: h * scale });
	}
	/**
	  * 隐藏banner
	  */
	public static hideBannerAd(): void {
		Native.bridgeCall("hideBannerAd", {});
	}
	/**显示插屏 */
	public static showInsertAd(adid) {
		var w = Math.min(Native.nativeWidth, Native.nativeHeight)
		Native.bridgeCall("loadInterstitialAd", { id: adid, width: w - 80, height: w - 80 });
	}
	/**手动激励视频广告 */
	public static ads(adid, caller, callback) {
		this.naticeVideoCallback = Laya.Handler.create(caller, callback);
		this.bridgeCall("loadRewardvideoAd", { id: adid, uid: "123" });
	}
	/**全屏视频广告 */
	public static showFullScreenAd(adid) {
		this.bridgeCall("loadFullScreenVideoAd", { id: adid });
	}
	/** 跳转应用商店*/
	public static openApp(appid, url = "") {
		this.bridgeCall("openAppStore", { id: appid, url: url });
	}

	/**获取sdk渠道id */
	public static getSdkChannelID(caller, callback) {
		this.naticeVideoCallback = Laya.Handler.create(caller, callback);
		Native.bridgeCall("getChannelID", {});
	}

	/**原生广告 */
	public static showNativeAD(nativeid) {
		this.bridgeCall("showNativeAD", { id: nativeid });
	}
	/**原生icon广告 */
	public static showNativeIcon(iconId) {
		this.bridgeCall("showIconAD", { id: iconId });
	}

	/**更多游戏 */
	public static jumpgamecenter() {
		this.bridgeCall("jumpgamecenter", {});
	}

	/**关闭游戏 */
	public static finishapp() {
		this.bridgeCall("finishapp", {});
	}

	/**sdk授权初始化 */
	public static initSDK(id) {
		this.bridgeCall("initSDK", { id: id });
	}

	/**实名认证，防沉迷验证 */
	public static Initname(caller: any, callback: Function) {
		this.naticeVideoCallback = Laya.Handler.create(caller, callback);
		this.bridgeCall("Initname", {});
	}

	/**华为登录 */
	public static hwLogin(caller: any, callback: Function) {
		this.naticeVideoCallback = Laya.Handler.create(caller, callback);
		this.bridgeCall("login", {});
	}
	/**打开隐私 */
	public static YSshow() {
		this.bridgeCall("YSshow", {});
	}
}
