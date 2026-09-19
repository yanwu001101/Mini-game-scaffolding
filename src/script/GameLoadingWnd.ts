const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";

/**
 * 游戏加载窗口（原 fgui 版 GameLoadingWnd），场景脚本：挂载于 resources/ui/scene/GameLoadingWnd.ls 根节点
 * 背景 + 进度条 + 提示文字。脚手架用模拟进度演示流程；
 * 原项目此处加载 3D 场景资源（Const.resource），实际项目在 onShow 里替换为真实加载并更新 bar.value。
 */
@regClass()
export default class GameLoadingWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/GameLoadingWnd.ls";

    private bar: Laya.ProgressBar;
    private progress: number = 0;
    private finished: boolean = false;

    constructor() {
        super();
        this.isFullWindow = true;
        this.showEffect = false;
    }

    protected onConstruct(): void {
        this.bar = <Laya.ProgressBar>this.view.getChildByName("bar");
    }

    onShow(): void {
        super.onShow();
        this.progress = 0;
        this.finished = false;
        this.bar.value = 0;
        //演示：模拟加载进度；实际项目改为真实资源加载的进度回调
        Laya.timer.loop(50, this, this.stepProgress);
    }

    private stepProgress(): void {
        this.progress += 4;
        this.bar.value = Math.min(this.progress, 100) / 100;
        if (this.progress >= 100 && !this.finished) {
            this.finished = true;
            Laya.timer.clear(this, this.stepProgress);
            if (this.uiOpenData && this.uiOpenData.handler) {
                this.uiOpenData.handler.run();
            }
            this.close();
        }
    }

    onHide(): void {
        super.onHide();
        Laya.timer.clear(this, this.stepProgress);
    }
}
