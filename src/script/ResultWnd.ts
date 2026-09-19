const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";

/**
 * 结算窗口（原 fgui 版 ResultWnd），场景脚本：挂载于 resources/ui/scene/ResultWnd.ls 根节点
 * 半透明黑底模态 + 胜负标题 + 确定按钮；胜/负文案由 uiOpenData.win 决定（原 result 控制器两页）。
 */
@regClass()
export default class ResultWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/ResultWnd.ls";

    constructor() {
        super();
        this.isModel = true;
        this.isCenter = true;
        this.clickModelClose = false;
    }

    protected onConstruct(): void {
        //胜负标题（原 result 控制器：页0胜利 / 页1失败）
        let win: boolean = this.uiOpenData ? !!this.uiOpenData.win : true;
        let resultLabel = <Laya.Label>this.view.getChildByName("resultLabel");
        resultLabel.text = win ? "胜利" : "失败";
        resultLabel.color = win ? "#73e741" : "#ff5555";

        let okBtn = <Laya.Button>this.view.getChildByName("okBtn");
        okBtn.on(Laya.Event.CLICK, this, () => {
            Mvc.Send(Const.MVC_ROUND_END, { win });
            this.close();
        });
    }

    /**入口：游戏结束时打开，uiOpenData: { win: boolean } */
    static open(win: boolean): ResultWnd {
        return <ResultWnd>WindowsMgr.Instance.openWindow(ResultWnd, { win });
    }
}
