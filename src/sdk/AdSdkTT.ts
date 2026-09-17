import { soundMgr } from "../common/sound/SoundMgr";
import { Tips } from "../common/utils/Tips";
import AdSDK from "./AdSDK";


export default class AdSdkTT extends AdSDK {


    initPlatformSdk() {
    }

    private m_tt;

    onNativeError(err: any) {
        throw new Error("Method not implemented.");
    }
    loadRewardVideo() {
        throw new Error("Method not implemented.");
    }


    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.tt;
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
        this.m_tt = (<any>Laya.Browser.window).tt;
        console.log("抖音广告参数：", + JSON.stringify(this.adData));
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
        let clientWidth: number = Laya.Browser.clientWidth;
        let clientHeight: number = Laya.Browser.clientHeight;
        let adParam = {
            adUnitId: this.m_bannerId[this.m_bannerIndex],
            adIntervals: 60,
            style: {
                width: clientWidth,
                height: 57,
                top: clientHeight - 100,
                left: 0
            }
        };
        console.log('banner createBannerAd:', JSON.stringify(adParam));
        this.m_bannerAd = this.m_tt.createBannerAd(adParam);

        let self = this;
        let fun: Function = function (obj) {
            self.onBannerSize(obj);
            self.m_bannerAd.offResize(fun);
        }

        this.m_bannerAd.onResize(fun);
        this.m_bannerAd.onLoad(() => {
            console.log('banner 广告加载成功onLoad', JSON.stringify(this.m_bannerAd.style));
            this.m_bannerAd.show().then(() => {
                console.log(' banner广告展示完成');
            }).catch((err) => {
                this.onBannerError(err);
            });
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
        let clientWidth: number = Laya.Browser.clientWidth;
        let clientHeight: number = Laya.Browser.clientHeight;
        this.m_bannerAd.style.top = clientHeight - obj.height;
        this.m_bannerAd.style.left = (clientWidth - obj.width) / 2;
    }

    onBannerError(error: any) {
        console.log("tt banner error:", JSON.stringify(error));
        if (this.m_bannerId.length > 1) {
            this.m_bannerIndex = (this.m_bannerIndex + 1) % this.m_bannerId.length;
        }
    }

    showNative() {
        console.log("显示原生:", this.m_nativeOtherIds);
    }

    createRewardVideo() {
        if (!this.m_tt.createRewardedVideoAd) {
            console.log("tt 没有激励视频广告组件");
            return;
        }
        if (!this.m_videoId || this.m_videoId.length <= 0) {
            console.log("tt 没有激励视频广告id");
            return;
        }
        console.log("创建激励视频:", this.m_videoId);
        let adParam = { adUnitId: this.m_videoId };
        this.m_rewardedVideoAd = this.m_tt.createRewardedVideoAd(adParam);
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
                    console.log("tt 视频播放正常结束！！");
                    if (caller && callback)
                        callback.call(caller, { code: 0 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("tt 视频播放中途退出！！");
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

    showInsert() {
        if (this.m_isLimitCity) return;
        console.log("显示插屏:", this.m_insertId);
        if (!this.m_tt.createInsertAd && !this.m_tt.createInterstitialAd) { console.log("没有createInsertAd创建插屏方法"); return; }
        console.log("CreateInsertAd3");
        if (!this.m_insertId || this.m_insertId.length <= 0) { console.log("没有创建插屏adUnitId"); return; }
        this.onInsertClose();
        let adUnitId = this.m_insertId[this.m_nativeIndex];
        let adParam = { adUnitId: adUnitId };
        this.m_insertAd = this.m_tt.createInterstitialAd(adParam)

        if (this.m_insertAd) {
            console.log("插屏广告 has interstitialAd");
            this.m_insertAd.onClose(this.onInsertClose);
            this.m_insertAd.onError(this.onInsertError);
            this.m_insertAd.load().then(() => {
                console.log("加载插屏广告 tt");
                this.m_insertAd.show().then(() => {
                    console.log("展示插屏广告 tt");
                }).catch(this.onInsertError);
            }).catch(this.onInsertError);
        } else {
            console.warn("===m_insertAd undefind===")
        }
    }

    onInsertError(err: any) {
        console.log("抖音插屏错误：", err);
        this.onInsertClose();
        if (this.m_insertId.length > 1) {
            this.m_insertIndex = (this.m_insertIndex + 1) % this.m_insertId.length;
        }
    }

    onInsertClose() {
        if (this.m_insertAd) {
            this.m_insertAd.offError(this.onInsertError);
            this.m_insertAd.offClose(this.onInsertClose);
            this.m_insertAd.destroy();
            this.m_insertAd = null;
        }
    }
}