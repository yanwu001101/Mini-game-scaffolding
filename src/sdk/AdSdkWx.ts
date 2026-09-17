import { soundMgr } from "../common/sound/SoundMgr";
import { Tips } from "../common/utils/Tips";
import AdSDK from "./AdSDK";


export default class AdSdkWx extends AdSDK {

    initPlatformSdk() {
    }
    onNativeError(err: any) {
        throw new Error("Method not implemented.");
    }
    loadRewardVideo() {
        throw new Error("Method not implemented.");
    }

    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.wx;
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
        console.log("wx广告参数：", + JSON.stringify(this.adData));
    }


    showSplash() {
        console.log("显示开屏:", this.m_splashId);
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

    showLoopNative() {
        
    }

    showBanner() {
        console.log("显示banner:", this.m_bannerId);
        if (!this.m_bannerId || !this.m_bannerId[this.m_bannerIndex]) return;
        this.hideBanner();
        let adParam = {
            adUnitId: this.m_bannerId[this.m_bannerIndex],
            style: {
                width: Laya.Browser.clientWidth,
                height: 100,
                top: 0,
                left: 0
            }
        };
        this.m_bannerAd = wx.createBannerAd(adParam);
        let self = this;
        let fun: Function = function (obj) {
            self.onBannerSize(obj);
            self.m_bannerAd.offResize(fun);
        }
        this.m_bannerAd.onResize(fun);
        this.m_bannerAd.onLoad(() => {
            console.log('banner 广告加载成功onLoad', JSON.stringify(this.m_bannerAd.style));
        });
        this.m_bannerAd.show().then(() => {
            console.log(' banner广告展示完成');
        }).catch((err) => {
            this.onBannerError(err);
        });
    }

    hideBanner() {
        if (this.m_bannerAd) {
            this.m_bannerAd.destroy();
            this.m_bannerAd = null;
        }
    }

    onBannerSize(obj: any) {
        console.log("obj", obj);
        this.m_bannerAd.style.top = Laya.Browser.clientWidth - obj.height;
        this.m_bannerAd.style.left = (Laya.Browser.clientHeight - obj.width) / 2;
    }

    onBannerError(error: any) {
        console.log("banner 错误：", error);
        if (this.m_bannerId.length > 1) {
            this.m_bannerIndex = (this.m_bannerIndex + 1) % this.m_bannerId.length;
        }
    }

    showNative() {
        console.log("显示wx原生:", this.m_nativeOtherIds);
    }

    showInsert() {
        console.log("显示wx插屏:", this.m_insertId);
        if (!wx.createInterstitialAd) {
            console.log("不存在插屏组件");
            return;
        }
        if (!this.m_insertId || this.m_insertId.length <= 0) {
            console.log("不存在插屏广告ID");
            return;
        }
        this.onInsertClose();
        let adUnitId = this.m_insertId[this.m_nativeIndex];
        let adParam = { adUnitId: adUnitId };
        this.m_insertAd = wx.createInterstitialAd(adParam);
        if (this.m_insertAd) {
            this.m_insertAd.show().catch((err) => {
                this.onInsertError(err);
            });
        }
    }

    onInsertClose() {
        if (this.m_insertAd) {
            this.m_insertAd.destroy();
            this.m_insertAd = null;
        }
    }
    onInsertError(err: any) {
        console.log("微信插屏错误：", err);
        this.onInsertClose();
        if (this.m_insertId.length > 1) {
            this.m_insertIndex = (this.m_insertIndex + 1) % this.m_insertId.length;
        }
    }

    createRewardVideo() {
        if (!wx.createRewardedVideoAd) {
            console.log("wx 没有激励视频广告组件");
            return;
        }
        if (!this.m_videoId || this.m_videoId.length <= 0) {
            console.log("wx 没有激励视频广告id");
            return;
        }
        console.log("创建激励视频:", this.m_videoId);
        let adParam = { adUnitId: this.m_videoId };
        this.m_rewardedVideoAd = wx.createRewardedVideoAd(adParam);
        this.m_rewardedVideoAd.onError(err => {
            console.log("tt 激励视频 广告加载失败" + JSON.stringify(err));
            this.m_loadRewardVideoAdSuccess = false;
            Laya.timer.clear(this, this.loadRewardVideo);
            Laya.timer.once(10000, this, this.loadRewardVideo);
        });
        this.m_rewardedVideoAd.onLoad(() => {
            console.log('tt 激励视频 广告加载成功');
            this.m_loadRewardVideoAdSuccess = true;
        });
        this.m_rewardedVideoAd.load();
    }

    showRewardVideo(caller?: any, callback?: Function, music?: boolean) {
        console.log("显示激励视频:", this.m_videoId);
        if (this.m_loadRewardVideoAdSuccess) {
            soundMgr.stopMusic();
            soundMgr.stopAllSound();
            let self = this;
            let fun: Function = function (res) {
                if (music)
                    soundMgr.resumeMusic();
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    console.log("wx 视频播放正常结束！！");
                    if (caller && callback)
                        callback.call(caller, { code: 0 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("wx 视频播放中途退出！！");
                    if (caller && callback)
                        callback.call(caller, { code: 1 });
                }
                self.loadRewardVideo();
                self.m_rewardedVideoAd.offClose(fun);
            }

            this.m_rewardedVideoAd.offError();
            this.m_rewardedVideoAd.onError(err => {
                console.log("激励视频 广告显示失败" + JSON.stringify(err));
                Tips.showTips("暂无视频，稍后再试！");
                if (music)
                    soundMgr.resumeMusic();
                this.loadRewardVideo();
                if (caller && callback)
                    callback.call(caller, { code: 2 });
            })
            console.log("ShowVideo show");
            this.m_rewardedVideoAd.show();
            this.m_rewardedVideoAd.onClose(fun);
        } else {
            Tips.showTips("暂无视频，稍后再试！");
            if (caller && callback)
                callback.call(caller, { code: 2 });
        }
    }
}