
/**
 * @author stery
 * 原生广告逻辑
 * VIVO 每个广告只能产生1次有效点击收益，且必须先上报曝光才能上报点击
 * OPPO 每个原生广告组件对象只有一次有效曝光，一次有效点击.同一个 posId，如果已经创建，并且未 destroy，会复用之前的对象
 * 信息载体
 */
export class NativeAd {
    // private static OPPO_NATIVE_AD_ID: string = "169264";

    private static _instance: NativeAd;
    /**
     * 获取单例
     */
    public static get Instance(): NativeAd {
        if (!NativeAd._instance) {
            NativeAd._instance = new NativeAd();
        }
        return NativeAd._instance;
    }

    static nativeAd: any;
    private static _adList: AdData;
    private static _isLoadOk: boolean = false;
    public get isLoadOk() {
        return NativeAd._isLoadOk;
    }
    public get AdList() {
        return NativeAd._adList;
    }

    public CreateNativeAd(adId: string, caller?: any, callback?: Function) {
        this.nativeAdLastUpdateTime = Date.now();

        let nativeAdId = adId;
        if (!nativeAdId) return;
        console.log(nativeAdId + "创建原生广告");
        NativeAd._isLoadOk = false;
        let adParam = {
            adUnitId: nativeAdId,
            success: (code) => {
                console.log("loadNativeAd loadNativeAd : success");
            },
            fail: (data, code) => {
                console.log("loadNativeAd loadNativeAd fail: " + data + "," + code);
            },
            complete: () => {
                console.log("loadNativeAd loadNativeAd : complete");
            }
        };
        NativeAd.nativeAd = qg.createNativeAd(adParam);
        NativeAd._caller = caller;
        NativeAd._callback = callback;
        NativeAd.nativeAd.onLoad(this.onLoad);

        console.log(nativeAdId, "加载原生广告");
        NativeAd.nativeAd.load();

        NativeAd.nativeAd.onError((res) => {
            console.log("nativeAdId,原生广告加载失败", JSON.stringify(res));
            if (NativeAd._caller && NativeAd._callback)
                NativeAd._callback.call(NativeAd._caller, { code: 1 });
        });
    }

    private static _caller: any;
    private static _callback: Function;
    onLoad(res) {
        console.log("原生广告加载onLoad" + JSON.stringify(res));
        if (res && res.adList && res.adList.length > 0) {//OPPO 有时会传{"adList":[],"code":0,"msg":"ok"}
            let adList: AdData[];
            adList = res.adList;
            NativeAd._adList = adList.pop()
            NativeAd._isLoadOk = true;
            if (NativeAd._caller && NativeAd._callback)
                NativeAd._callback.call(NativeAd._caller, { code: 0 });
        }
    }

    private nativeAdLastUpdateTime: number = 0;
    /**上报广告点击 */
    public ReportAdClick() {
        if (!this.AdList) return;
        console.log("reportAdClick点击原生广告");
        if (NativeAd.nativeAd && this.AdList) {
            NativeAd.nativeAd.reportAdClick({ adId: this.AdList.adId.toString() });
            this.Destroy();
        }
    }

    /**上报广告曝光 */
    public ReportAdShow() {
        console.log("++++++++++++")
        if (!this.AdList) return;
        console.log("reportAdShow原生广告曝光");
        if (NativeAd.nativeAd && this.AdList) {
            NativeAd.nativeAd.reportAdShow({ adId: this.AdList.adId.toString() });
            // this._showTime++;
        }
    }

    /**界面关闭时调用 */
    public ReportAdClose() {
        if (!NativeAd.nativeAd) return;
        this.Destroy();
    }

    /**销毁广告组件
     * 释放资源(每个原生广告组件对象只有一次有效曝光，一次有效点击)
     * 同一个 posId，如果已经创建，并且未 destroy，会复用之前的对象
     */
    private Destroy() {
        console.log("reportAdShow原生广告destroy");
        Laya.timer.clear(this, this.Destroy);
        NativeAd.nativeAd.offLoad(this.onLoad);
        NativeAd.nativeAd.offError();
        if (NativeAd.nativeAd.destroy) {//OPPO 才有这个方法
            NativeAd.nativeAd.destroy();
        }
        NativeAd._adList = null;
    }
}

export class AdData {
    id: string;//广告位id，用来与NativeAd对应
    adId: string;//广告标识，用来上报曝光与点击
    title: string;//广告标题
    desc: string;//广告描述
    source: string;//广告来源
    icon: string;//推广应用的Icon图标 VIVO & OPPO
    iconUrlList: Array<string>;//推广应用的Icon图标 OPPO
    imgUrlList: Array<any>;//广告图片
    logoUrl: string;//广告标签图片
    clickBtnTxt: string;//点击按钮文本描述
    /**获取广告类型，取值说明：
     * 0：混合[VIVO];
     * 0:无 1:纯文字 2:图片 3:图文混合 4:视频[OPPO]
     */
    creativeType: number;
    /**获取广告点击之后的交互类型，取值说明：
     * 1：网址类 2：应用下载类 8：快应用生态应用[VIVO]; 
     * 0:无 1:浏览类 2:下载类 3:浏览器（下载中间页广告) 4:打开应用首页 5:打开应用详情页[OPPO]
     */
    interactionType: number;
}
