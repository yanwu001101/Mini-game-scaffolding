// import { TipsWin } from "../../script/TipsWin";
import { PlatMgr, PlatType } from "./PlatMgr";
import { recordMgr } from "./RecordMgr";

export class ShareUtil {

    public static shareList = [
        { uid: '001', title: '飞机世界！', imageUrl: '' },
    ]

    /**头条 录屏分享 */
    public static TtShareAppMessage(channel: string = "video", caller?: any, callback?: Function) {
        console.log("录屏分享");
        if (PlatMgr.PLATFORM != PlatType.TT || !PlatMgr.isMiniGame) {
            return;
        }
        let title: string = "";
        let videoPath = recordMgr.tempRecordUrl;
        console.log("录屏分享地址：", videoPath);
        let videoTopics = [];
        if (videoPath != "") {
            PlatMgr.platObj.shareAppMessage({
                channel: channel,
                desc: title,
                title: title,
                extra: {
                    videoPath: videoPath,
                    // videoTopics: videoTopics
                },

                success() {
                    // TipsWin.showTips("分享成功")
                    console.log("录屏分享成功");
                    if (caller && callback) {
                        callback.call(caller, { code: 0 });
                    }
                },

                fail(e) {
                    console.log("录屏分享失败：", JSON.stringify(e));
                    if (caller && callback) {
                        callback.call(caller, { code: -1 });
                    }
                }
            })
        } else {
            // TipsWin.showTips("录屏时长小于3秒，分享失败")
        }
    }

}