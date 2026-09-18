import { httpMgr } from "../common/utils/HttpMgr";
import { Utils } from "../common/utils/Utils";


export enum NativeType {
    Other = 0,
    Pause,
    Result
}

export const CityUrl = "https://yxapi.tomatojoy.cn/getIp";
export const LimitCity = "石家庄 太原市 沈阳市 长春市 哈尔滨市 南京市 杭州市 合肥市 福州市 南昌市 济南市 郑州市  长沙市 武汉市 海口市 成都市 贵阳市 昆明市 西安市 兰州市 西宁市 北京市 天津市 上海市 重庆市 大连市 厦门市 青岛市 广东省"

export default abstract class AdSDK {
    protected m_adSdkData: any;
    protected adData: any;
    /**系统参数 */
    protected m_systemInfo: any;

    public AppId: string;
    public cdnUrl = "";
    /**地区屏蔽 */
    public m_isLimitCity = true;
    /**显示时间 */
    protected m_showTime: number;
    protected m_boxShowTime: number = Number.MAX_VALUE;
    protected m_splashId: string;
    protected m_bannerId: Array<string>;
    protected m_nativeOtherIds: Array<string>;
    protected m_nativePauseIds: Array<string>;
    protected m_nativeResultIds: Array<string>;
    protected m_nativeLoopIds: Array<string>;
    protected m_videoId: string;
    protected m_insertId: Array<string>;

    protected m_bannerIndex: number = 0;
    protected m_bannerAd: any;

    protected m_rewardedVideoAd: any;
    protected m_loadRewardVideoAdSuccess: boolean;

    /**原生 */
    protected m_nativeIndex: number = 0;
    protected m_nativeAd: any;

    /**插屏 */
    protected m_insertIndex: number = 0;
    protected m_insertAd: any;

    /**定时banner间隔 */
    protected m_bannerLoopTime: number = 60;

    /**著作权 */
    public author = "";
    public authorId = "";
    /**适龄 */
    public age = "";
    /**隐私壳子公司 */
    public company: string;

    /**广告数据加载完成 */
    abstract dataLoadComplete();
    /**显示开屏 */
    abstract showSplash();
    /**显示banner */
    abstract showBanner();
    /**定时显示banner */
    abstract showLoopBanner();
    /**隐藏banner */
    abstract hideBanner();
    abstract onBannerError(error);
    abstract onBannerSize(data);
    /**显示原生插屏 */
    // abstract showNative(closeW: number, closeH: number);
    abstract showNative(type: NativeType);
    abstract onNativeError(err);
    /**循环显示原生 */
    abstract showLoopNative();
    /**创建激励视频 */
    abstract createRewardVideo();
    /**显示激励视频 */
    abstract showRewardVideo(caller?: any, callback?: Function, music?: boolean);
    /**加载激励视频 */
    abstract loadRewardVideo();
    /**显示插屏 */
    abstract showInsert();
    abstract onInsertError(err);
    abstract onInsertClose();
    /**渠道sdk初始化 */
    abstract initPlatformSdk();

    constructor() {
        Laya.loader.load("resources/ad.json").then((data) => {
            //3.x 加载 json 返回 TextResource 壳，数据在其 .data 字段；兼容直接返回原始对象的情况
            let json = data && typeof data === "object" && data.data !== undefined && !(Array.isArray(data)) ? data.data : data;
            this.m_adSdkData = json;
            console.log("广告参数:" + JSON.stringify(this.m_adSdkData));
            this.dataLoadComplete();
            this.company = this.adData.company;
            if (this.adData.showBoxTime) {
                this.m_boxShowTime = new Date(this.adData.showBoxTime).getTime();
            }
        }).catch((e) => {
            //与 2.x 行为一致：配置缺失时不回调 dataLoadComplete，广告功能静默降级
            console.warn("resources/ad.json 未找到，广告功能不可用", e);
        });

        this.getLimitCity();
    }

    private getLimitCity() {
        httpMgr.get(null, CityUrl, this, (res) => {
            console.log(res);
            if (res) {
                let r = JSON.parse(res);
                if (r.data.city && LimitCity.indexOf(r.data.city) < 0) {
                    if (r.data.province && LimitCity.indexOf(r.data.province) < 0) {
                        this.m_isLimitCity = false;
                    }
                }
            }
        });
    }

    /**是否开宝箱 */
    public get isShowBox() {
        console.log("date:", new Date().getTime());
        console.log("m_boxShowTime:", this.m_boxShowTime);
        console.log("m_isLimitCity:", this.m_isLimitCity);
        if (this.m_isLimitCity) {
            return false;
        }
        if (new Date().getTime() > this.m_boxShowTime) {
            if (!Utils.isWorkDay()) {
                return true;
            } else if (!Utils.isWorkingHours()) {
                return true;
            }
        }
        return false;
    }

    /**广告屏蔽 */
    public get isShowAdTime() {
        if (this.m_isLimitCity) {
            return false;
        }
        let time = new Date().getTime();
        if (this.m_showTime > time) {
            console.log("pb 时间未到");
            return false;
        }
        return true;
    }
}