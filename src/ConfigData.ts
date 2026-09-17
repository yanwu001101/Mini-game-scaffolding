import { httpMgr } from "./common/utils/HttpMgr";



export class ConfigData {

    /**是否线上模式 1*/
    public static allReportAd = false;
    public static verify: number = 0;
    public static Config: { status: number, open: Array<number> } = { status: 0, open: [30, 60, 120, 180, 210] };


    public static getPkgConfig(pkg: string) {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaagetHuaWeiConfig pkg:",pkg);
        httpMgr.post({ appId: pkg }, "http://116.62.217.68:12908/v1/jsonyc", this, (res) => {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaagetConfig:", JSON.stringify(res));
            ConfigData.Config = res;
            // ConfigData.Config.status = 1;//测试
            //http://116.62.217.68:12908/v1/jsonyc?appId=com.klt.tcjjr.huawei
        });
    }


    public static getConfigCPM(appId: string, caller?: any, callback?: Function) {
        httpMgr.post({ appId: appId }, "http://116.62.217.68:12906/v1/jsonCPM", this, (res) => {
            console.log("getConfig:", res);
            ConfigData.Config = res;
            // ConfigData.Config.status = 1;//测试
            if (caller && callback) {
                callback.apply(caller);
            }
        });
    }
}