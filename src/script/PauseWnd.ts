const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";
import ResultWnd from "./ResultWnd";

/**
 * 暂停窗口（原 fgui 版 PauseWnd），场景脚本：挂载于 resources/ui/scene/PauseWnd.ls 根节点
 * 半透明黑底模态 + 三个按钮；通过 MVC 事件通知游戏暂停/恢复。
 */
@regClass()
export default class PauseWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/PauseWnd.ls";

    constructor() {
        super();
        this.isModel = true;
        this.isCenter = true;
        this.clickModelClose = false;
    }

    protected onConstruct(): void {
        let resumeBtn = <Laya.Button>this.view.getChildByName("resumeBtn");
        resumeBtn.on(Laya.Event.CLICK, this, () => {
            this.close();
        });

        let resultBtn = <Laya.Button>this.view.getChildByName("resultBtn");
        resultBtn.on(Laya.Event.CLICK, this, () => {
            ResultWnd.open(true);
            this.close();
        });

        let exitBtn = <Laya.Button>this.view.getChildByName("exitBtn");
        exitBtn.on(Laya.Event.CLICK, this, () => {
            //通知 GameWnd 关闭自己，露出下方主页
            Mvc.Send(Const.MVC_GO_HOME);
            this.close();
        });
    }

    onShow(): void {
        super.onShow();
        Mvc.Send(Const.MVC_GAME_PAUSE);
    }

    onHide(): void {
        super.onHide();
        Mvc.Send(Const.MVC_GAME_RESUME);
    }

    /**入口：GameWnd 暂停按钮 */
    static open(): PauseWnd {
        return <PauseWnd>WindowsMgr.Instance.openWindow(PauseWnd);
    }
}
