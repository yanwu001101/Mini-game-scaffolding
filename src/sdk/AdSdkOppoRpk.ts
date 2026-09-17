import { soundMgr } from "../common/sound/SoundMgr";
import { Tips } from "../common/utils/Tips";
import AdSDK, { NativeType } from "./AdSDK";


export default class AdSdkOppoRpk extends AdSDK {


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
        this.adData = this.m_adSdkData.oppoRpk;
        this.AppId = this.adData.appId;
        this.m_showTime = new Date(this.adData.showTime).getTime();
        this.m_splashId = this.adData.splash;
        this.m_bannerId = this.adData.banner;
        this.m_videoId = this.adData.video;
        this.m_nativeLoopIds = this.adData.nativeLoop;
        this.m_nativeOtherIds = this.adData.nativeOther;
        this.m_nativePauseIds = this.adData.nativePause;
        this.m_nativeResultIds = this.adData.nativeResult;
        this.m_insertId = this.adData.insert;
        this.cdnUrl = this.adData.cdn || "";
        this.author = this.adData.author;
        this.authorId = this.adData.authorId;
        this.m_bannerLoopTime = this.adData.bannerLoopTime;
        this.age = this.adData.age;
        this.m_systemInfo = qg.getSystemInfoSync();
        console.log("oppoRpk广告参数：", + JSON.stringify(this.adData));
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
        if (this.m_nativeLoopIds && this.m_nativeLoopIds.length > 0) {
            Laya.timer.loop(30000, this, ()=>{
                this.showNativeAd(this.m_nativeLoopIds, 0);
            });
        }
    }

    showBanner() {
        if (!this.m_bannerId || !this.m_bannerId[this.m_bannerIndex]) return;
        this.hideBanner();
        let adParam;
        if (qg.getSystemInfoSync().platformVersion < 1051) {
            adParam = { posId: this.m_bannerId[this.m_bannerIndex] };
        } else {
            adParam = { adUnitId: this.m_bannerId[this.m_bannerIndex] };
        }
        console.log('oppoRpk banner 创建:', JSON.stringify(adParam));
        this.m_bannerAd = qg.createBannerAd(adParam);
        this.m_bannerAd.show().then(() => {
            console.log('oppoRpk banner广告展示完成');
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
        console.log("oppoRpk banner error:", JSON.stringify(error));
        if (this.m_bannerId.length > 1) {
            this.m_bannerIndex = (this.m_bannerIndex + 1) % this.m_bannerId.length;
        }
    }

    onBannerSize(data: any) {
        console.log("oppoRpk banner size:", JSON.stringify(data));
    }

    createRewardVideo() {
        if (!qg.createRewardedVideoAd) {
            console.log("oppoRpk 没有激励视频广告组件");
            return;
        }
        if (!this.m_videoId || this.m_videoId.length <= 0) {
            console.log("oppoRpk 没有激励视频广告id");
            return;
        }
        console.log("创建激励视频:", this.m_videoId);
        let adParam;
        if (qg.getSystemInfoSync().platformVersion < 1051) {
            adParam = { posId: this.m_videoId };
        } else {
            adParam = { adUnitId: this.m_videoId };
        }
        this.m_rewardedVideoAd = qg.createRewardedVideoAd(adParam);
        this.m_rewardedVideoAd.onError(err => {
            console.log("oppoRpk 激励视频 广告加载失败" + JSON.stringify(err));
            this.m_loadRewardVideoAdSuccess = false;
            Laya.timer.clear(this, this.loadRewardVideo);
            Laya.timer.once(10000, this, this.loadRewardVideo);
        });
        this.m_rewardedVideoAd.onLoad(() => {
            console.log('oppoRpk 激励视频 广告加载成功');
            this.m_loadRewardVideoAdSuccess = true;
        });
        this.m_rewardedVideoAd.load();
    }

    loadRewardVideo() {
        this.m_rewardedVideoAd.offError();
        this.m_rewardedVideoAd.onError(err => {
            console.log("oppoRpk 激励视频 广告重新加载失败" + err.code + err.msg);
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
                    console.log("oppoRpk 视频播放正常结束！！");
                    if (caller && callback)
                        callback.call(caller, { code: 0 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("oppoRpk 视频播放中途退出！！");
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
            this.m_nativeAd.destroy();
            this.m_nativeAd = null;
        }
        let id = nativeIds[this.m_nativeIndex];
        console.log("当前原生id：", id);
        this.m_nativeAd = qg.createCustomAd({
            adUnitId: id
        });
        this.m_nativeAd.show().then(() => {
            console.log('原生模板广告展示完成');
        }).catch((err) => {
            this.onNativeError(err);
        })
    }

    onNativeError(err) {
        console.log("oppoRpk 原生错误:", JSON.stringify(err));
        this.m_nativeIndex++;
        this.showNativeAd(this.m_tempNativeIds, this.m_nativeIndex);
    }

}