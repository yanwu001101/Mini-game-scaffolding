import Mvc from "../common/mvc/Mvc";
import { soundMgr } from "../common/sound/SoundMgr";
import { NativeAd } from "../nativeAd/NativeAd";
import { Tips } from "../common/utils/Tips";
import AdSDK, { NativeType } from "./AdSDK";
import Const from "../Const";


export default class AdSdkHwRpk extends AdSDK {

    initPlatformSdk() {

    }

    onInsertClose() {

    }
    onInsertError(err: any) {

    }

    showSplash() {
        console.log("显示开屏:", this.m_splashId);
    }

    showInsert() {

    }

    private m_tempNativeIds: Array<string>;

    dataLoadComplete() {
        this.adData = this.m_adSdkData.hwRpk;
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
        console.log("hwRpk广告参数：", + JSON.stringify(this.adData));
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
        if (!this.m_bannerId || this.m_bannerId.length <= 0) return;
        this.hideBanner();

        let top = this.m_systemInfo.safeArea.height - 57;
        let adParam = {
            adUnitId: this.m_bannerId[this.m_bannerIndex],
            adIntervals: 30,
            style: {
                top: top,
                left: 0,
                height: 57,
                width: 360
            }
        };

        console.log('hwRpk banner createBannerAd:', JSON.stringify(adParam));
        this.m_bannerAd = qg.createBannerAd(adParam);
        this.m_bannerAd.onLoad(() => {
            console.log('hwRpk banner 广告加载成功onLoad', JSON.stringify(this.m_bannerAd.style));
        });

        let self = this;
        let err: Function = function (er) {
            self.onBannerError(er);
            self.m_bannerAd.offError(err);
        }
        this.m_bannerAd.onError(err);
        this.m_bannerAd.show();
    }

    hideBanner() {
        if (this.m_bannerAd) {
            this.m_bannerAd.destroy();
            this.m_bannerAd = null;
        }
    }

    onBannerError(error: any) {
        console.log("hwRpk banner error:", JSON.stringify(error));
        if (this.m_bannerId.length > 1) {
            this.m_bannerIndex = (this.m_bannerIndex + 1) % this.m_bannerId.length;
        }
    }

    onBannerSize(data: any) {
        console.log("hwRpk banner size:", JSON.stringify(data));
    }

    createRewardVideo() {
        if (!qg.createRewardedVideoAd) {
            console.log("hwRpk 没有激励视频广告组件");
            return;
        }
        if (!this.m_videoId || this.m_videoId.length <= 0) {
            console.log("hwRpk 没有激励视频广告id");
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
            console.log("hwRpk 激励视频 广告加载失败" + JSON.stringify(err));
            this.m_loadRewardVideoAdSuccess = false;
            Laya.timer.clear(this, this.loadRewardVideo);
            Laya.timer.once(10000, this, this.loadRewardVideo);
        });
        this.m_rewardedVideoAd.onLoad(() => {
            console.log('hwRpk 激励视频 广告加载成功');
            this.m_loadRewardVideoAdSuccess = true;
        });
        this.m_rewardedVideoAd.load();
    }

    loadRewardVideo() {
        this.m_rewardedVideoAd.offError();
        this.m_rewardedVideoAd.onError(err => {
            console.log("hwRpk 激励视频 广告加载失败" + JSON.stringify(err));
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
            var fun: Function = function (res) {
                if (music)
                    soundMgr.resumeMusic();
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    console.log("hwRpk 视频播放正常结束！！");
                    if (caller && callback)
                        callback.call(caller, { code: 0 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log("hwRpk 视频播放中途退出！！");
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
        if (!qg.createNativeAd) return;
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
        NativeAd.Instance.CreateNativeAd(nativeIds[this.m_nativeIndex], this, (res) => {
            if (res.code == 0) {
                let adList = NativeAd.Instance.AdList;
                if (!adList) return;
                //3.x 无 FairyGUI：原生广告窗口改由 UI 层渲染（监听 Const.MVC_NATIVE_AD_SHOW），
                //UI 层关闭/点击时调用 NativeAd.Instance.ReportAdClose()/ReportAdClick()
                Mvc.Send(Const.MVC_NATIVE_AD_SHOW, { ad: adList });
                NativeAd.Instance.ReportAdShow();
            } else {
                this.onNativeError("");
            }
        });
    }

    onNativeError(err) {
        console.log("hwRpk native error:", JSON.stringify(err));
        this.m_nativeIndex++;
        this.showNativeAd(this.m_tempNativeIds, this.m_nativeIndex);
        // if (this.m_tempNativeIds.length > 1) {
        //     this.m_nativeIndex = (this.m_nativeIndex + 1) % this.m_tempNativeIds.length;
        // }
    }

}