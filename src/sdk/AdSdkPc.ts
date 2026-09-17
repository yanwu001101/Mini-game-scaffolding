import AdSDK, { NativeType } from "./AdSDK";


export default class AdSdkPc extends AdSDK {
    showLoopBanner() {
        console.log("定时banner");
    }
    initPlatformSdk() {
        console.log("渠道sdk初始化");
    }
    hideBanner() {
        throw new Error("Method not implemented.");
    }
    onInsertClose() {
        throw new Error("Method not implemented.");
    }
    onInsertError(err: any) {
        throw new Error("Method not implemented.");
    }
    onNativeError(err: any) {
        throw new Error("Method not implemented.");
    }
    loadRewardVideo() {
        console.log("加载激励视频");
    }
    createRewardVideo() {
        console.log("创建激励视频");
    }
    onBannerSize(data: any) {
        throw new Error("Method not implemented.");
    }
    onBannerError(error: any) {
        throw new Error("Method not implemented.");
    }

    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.pc;
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
        console.log("cdn:", this.cdnUrl);
        console.log("pc广告参数：", JSON.stringify(this.adData));
    }


    showSplash() {
        console.log("显示开屏:", this.m_splashId);
    }

    showBanner() {
        console.log("显示banner:", this.m_bannerId);
    }
    showLoopNative() {

    }

    showNative(type: NativeType) {
        switch (type) {
            case NativeType.Other:
                console.log("其他原生");
                break;
            case NativeType.Pause:
                console.log("暂停原生");
                break;
            case NativeType.Result:
                console.log("结算原生");
                break;
        }
    }

    showRewardVideo(caller?: any, callback?: Function, music?: boolean) {
        console.log("显示激励视频:", this.m_videoId);
        if (caller && callback)
            callback.call(caller, { code: 0 });
    }

    showInsert() {
        console.log("显示插屏:", this.m_insertId);
    }
}