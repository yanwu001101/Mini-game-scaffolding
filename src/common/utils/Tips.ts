
import Mvc from "../mvc/Mvc";
import Const from "../../Const";

/**
 * 全局轻提示（替代原 fgui TipsWin）
 * 框架层不持有任何 UI，只广播 MVC_SHOW_TIPS 事件，
 * 由 UI 层（或调试用 console）决定如何展示。
 */
export class Tips {
    /**是否同时输出到控制台 */
    static logEnabled: boolean = true;

    static showTips(msg: string): void {
        if (Tips.logEnabled) console.log("[Tips]", msg);
        Mvc.Send(Const.MVC_SHOW_TIPS, { msg });
    }
}
