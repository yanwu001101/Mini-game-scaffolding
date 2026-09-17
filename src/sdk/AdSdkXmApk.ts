import { Native } from "../common/platform/Native";
import AdSDK, { NativeType } from "./AdSDK";


export default class AdSdkXmApk extends AdSDK {
    showLoopNative() {
    }

    onInsertClose() {
    }
    onInsertError(err: any) {
    }
    onNativeError(err: any) {
    }
    loadRewardVideo() {
    }
    createRewardVideo() {
    }
    onBannerSize(data: any) {
    }
    onBannerError(error: any) {
    }

    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.xmApk;
        this.AppId = this.adData.appId;
        this.m_showTime = new Date(this.adData.showTime).getTime();
        this.m_splashId = this.adData.splash;
        this.m_bannerId = this.adData.banner;
        this.m_videoId = this.adData.video;
        this.m_nativeOtherIds = this.adData.nativeOther;
        this.m_nativePauseIds = this.adData.nativePause;
        this.m_nativeResultIds = this.adData.nativeResult;
        this.m_insertId = this.adData.insert;
        this.cdnUrl = this.adData.cdn || "";
        this.author = this.adData.author;
        this.authorId = this.adData.authorId;
        this.age = this.adData.age;
        this.m_bannerLoopTime = this.adData.bannerLoopTime;
        console.log("xmApk广告参数：" + + JSON.stringify(this.adData));
        this.initPlatformSdk();
    }


    initPlatformSdk() {
        Native.initBUAdSDK(this.AppId);
    }

    showSplash() {
        console.log("显示开屏:" + this.m_splashId);
        if (this.m_splashId)
            Native.bridgeCall("addSplashAD", { id: this.m_splashId });
    }

    showLoopBanner() {
        if (!this.m_bannerLoopTime) return;
        if (this.m_isLimitCity) return;
        let time = new Date().getTime();
        if (this.m_showTime > time) {
            console.log("时间未到");
            return;
        }
        this.showBanner();
        Laya.timer.loop(this.m_bannerLoopTime * 1000, this, this.showBanner);
    }

    showBanner() {
        console.log("显示banner:" + this.m_bannerId);
        if (this.m_bannerId && this.m_bannerId[this.m_bannerIndex])
            Native.showBannerAd(this.m_bannerId[this.m_bannerIndex]);
    }

    hideBanner() {
        Native.hideBannerAd();
    }

    showNative(type: NativeType) {
        switch (type) {
            case NativeType.Other:
                if (this.m_isLimitCity) return;
                let time = new Date().getTime();
                if (this.m_showTime > time) {
                    console.log("时间未到");
                    return;
                }
                this.m_tempNativeIds = this.m_nativeOtherIds;
                break;
            case NativeType.Pause:
                this.m_tempNativeIds = this.m_nativePauseIds;
                break;
            case NativeType.Result:
                this.m_tempNativeIds = this.m_nativeResultIds;
                break;
        }
        console.log("显示原生:" + this.m_tempNativeIds);
        console.log("原生m_insertIndex:", this.m_insertIndex);
        if (this.m_tempNativeIds && this.m_tempNativeIds[this.m_insertIndex])
            Native.showNativeAD(this.m_tempNativeIds[this.m_insertIndex]);
    }

    showRewardVideo(caller?: any, callback?: Function, music?: boolean) {
        console.log("显示激励视频:" + this.m_videoId);
        if (this.m_videoId)
            Native.ads(this.m_videoId, caller, callback);
        else if (caller && callback)
            callback.call(caller, { code: 0 });
    }

    showInsert() {
        console.log("显示插屏:" + this.m_insertId);
        console.log("插屏:m_insertIndex" + this.m_insertIndex);
        if (this.m_insertId && this.m_insertId[this.m_insertIndex])
            Native.showInsertAd(this.m_insertId[this.m_insertIndex]);
    }
}