import { soundMgr } from "../common/sound/SoundMgr";
import { Tips } from "../common/utils/Tips";
import AdSDK, { NativeType } from "./AdSDK";


export default class AdSdkVivoRpk extends AdSDK {

    initPlatformSdk() {
    }

    onInsertClose() {
        throw new Error("Method not implemented.");
    }
    onInsertError(err: any) {
        throw new Error("Method not implemented.");
    }



    showSplash() {
        console.log("显示开屏:", this.m_splashId);
    }

    showInsert() {
        throw new Error("Method not implemented.");
    }


    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.vivoRpk;
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
        this.m_systemInfo = qg.getSystemInfoSync();
        console.log("vivoRpk广告参数：", + JSON.stringify(this.adData));
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
        if (!this.m_bannerId || !this.m_bannerId[this.m_bannerIndex]) return;
        this.hideBanner();
        let clientWidth: number = Laya.Browser.clientWidth;
        let clientHeight: number = Laya.Browser.clientHeight;
        let adParam = {
            posId: this.m_bannerId[this.m_bannerIndex],
            style: {
                left: (clientWidth - clientWidth / 2) / 2,
                top: clientHeight - 150
            }
        };
        console.log('vivoRpk banner vivo创建:', JSON.stringify(adParam));
        this.m_bannerAd = qg.createBannerAd(adParam);
        this.m_bannerAd.show().then(() => {
            console.log('vivoRpk banner广告展示完成');
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

    onBannerError(error: any) {
        console.log("vivoRpk banner error:", JSON.stringify(error));
        if (this.m_bannerId.length > 1) {
            this.m_bannerIndex = (this.m_bannerIndex + 1) % this.m_bannerId.length;
        }
    }

    onBannerSize(data: any) {
        console.log("vivoRpk banner size:", JSON.stringify(data));
    }

    createRewardVideo() {
        if (!qg.createRewardedVideoAd) {
            console.log("vivoRpk 没有激励视频广告组件");
            return;
        }
        if (!this.m_videoId || this.m_videoId.length <= 0) {
            console.log("vivoRpk 没有激励视频广告id");
            return;
        }

        let adParam;
        if (qg.getSystemInfoSync().platformVersion < 1051) {
            adParam = { posId: this.m_videoId };
        } else {
            adParam = { adUnitId: this.m_videoId };
        }
        this.m_rewardedVideoAd = qg.createRewardedVideoAd(adParam);
        this.m_rewardedVideoAd.onError(err => {
            console.log("vivoRpk 激励视频 广告加载失败" + JSON.stringify(err));
            this.m_loadRewardVideoAdSuccess = false;
            Laya.timer.clear(this, this.loadRewardVideo);
            Laya.timer.once(10000, this, this.loadRewardVideo);
        });
        this.m_rewardedVideoAd.onLoad(() => {
            console.log('vivoRpk 激励视频 广告加载成功');
            this.m_loadRewardVideoAdSuccess = true;
        });
    }

    loadRewardVideo() {
        this.m_rewardedVideoAd.offError();
        this.m_rewardedVideoAd.onError(err => {
            console.log("vivoRpk 激励视频 广告重新加载失败" + err.code + err.msg);
            this.m_loadRewardVideoAdSuccess = false;
            Laya.timer.clear(this, this.loadRewardVideo);
            Laya.timer.once(10000, this, this.loadRewardVideo);
        })
        this.m_rewardedVideoAd.load();
    }

    showRewardVideo(caller?: any, callback?: Function, music?: boolean) {
        if (this.m_loadRewardVideoAdSuccess) {
            soundMgr.stopMusic();
            soundMgr.stopAllSound();
            let self = this;
            let fun: Function = function (res) {
                if (music)
                    soundMgr.resumeMusic();
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    console.log("vivoRpk 视频播放正常结束！！");
                    if (caller && callback)
                        callback.call(caller, { code: 0 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("vivoRpk 视频播放中途退出！！");
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

    showNative(type: NativeType) {
        if (!qg.createCustomAd) return;
        switch (type) {
            case NativeType.Other:
                if (this.m_isLimitCity) return;
                let time = new Date().getTime();
                if (this.m_showTime > time) {
                    console.log("时间未到");
                    return;
                }
                this.showNativeAd(this.m_nativeOtherIds, 0);
                break;
            case NativeType.Pause:
                this.showNativeAd(this.m_nativePauseIds, 0);
                break;
            case NativeType.Result:
                this.showNativeAd(this.m_nativeResultIds, 0);
                break;
        }
    }

    showNativeAd(nativeIds: Array<string>, index: number) {
        if (!nativeIds || !nativeIds[index]) return;
        this.m_tempNativeIds = nativeIds;
        this.m_nativeIndex = index;
        if (this.m_nativeAd) {
            // this.m_nativeAd.offError(this.onNativeError);
            this.m_nativeAd.destroy();
            this.m_nativeAd = null;
        }
        let id = nativeIds[this.m_nativeIndex];
        console.log("当前原生id：", id);
        this.m_nativeAd = qg.createCustomAd({
            adUnitId: id
        });
        this.m_nativeAd.onError((er) => {
            this.onNativeError(er);
        });
        this.m_nativeAd.show().then(() => {
            console.log('原生模板广告展示完成');
        }).catch((err) => {
            this.onNativeError(err);
        })
    }

    onNativeError(err) {
        console.log("vivoRpk native error:", JSON.stringify(err));
        this.m_nativeIndex++;
        this.showNativeAd(this.m_tempNativeIds, this.m_nativeIndex);
    }

}