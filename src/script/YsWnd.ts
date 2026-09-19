const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import { dataMgr } from "../GameData";
import { Tips } from "../common/utils/Tips";

/**
 * 隐私政策弹窗（原 Loading 包 yinsi + YsWnd），场景脚本：挂载于 resources/ui/scene/YsWnd.ls 根节点
 * 九宫格底板 + 标题 + 可滚动协议正文 + 同意/不同意按钮。
 *
 * 两种模式（沿用原版）：
 * - 合规模式：uiOpenData 传入 Laya.Handler（首次启动），同意后回调并写存档；点模态不关闭
 * - 浏览模式：不传参（主页"隐私协议"按钮），不显示"不同意"，点模态可关闭
 */
@regClass()
export default class YsWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/YsWnd.ls";

    private content: Laya.Box;
    private contentLabel: Laya.Label;
    private scrollY: number = 0;
    private dragging: boolean = false;
    private lastY: number = 0;

    /**正文滚动区尺寸（原 ysComp 480x308） */
    private static CONTENT_W = 480;
    private static CONTENT_H = 308;

    constructor() {
        super();
        this.isModel = true;
        this.isCenter = true;
        this.clickModelClose = false;
    }

    protected onConstruct(): void {
        this.content = <Laya.Box>this.view.getChildByName("content");
        this.contentLabel = <Laya.Label>this.content.getChildByName("contentLabel");

        //触摸滚动
        this.content.on(Laya.Event.MOUSE_DOWN, this, this.onDown);
        this.content.on(Laya.Event.MOUSE_MOVE, this, this.onMove);
        this.content.on(Laya.Event.MOUSE_UP, this, this.onUp);
        this.content.on(Laya.Event.MOUSE_OUT, this, this.onUp);

        let okBtn = <Laya.Button>this.view.getChildByName("okBtn");
        okBtn.on(Laya.Event.CLICK, this, this.onOkClick);

        let noBtn = <Laya.Button>this.view.getChildByName("noBtn");
        noBtn.on(Laya.Event.CLICK, this, this.onNoClick);
    }

    onShow(): void {
        super.onShow();
        let noBtn = <Laya.Button>this.view.getChildByName("noBtn");
        if (this.uiOpenData) {
            //合规模式
            this.clickModelClose = false;
            noBtn.visible = true;
        } else {
            //浏览模式（原版：不显示不同意，点模态可关闭）
            this.clickModelClose = true;
            noBtn.visible = false;
        }
    }

    onHide(): void {
        super.onHide();
        this.uiOpenData = null;
    }

    private onDown(): void {
        this.dragging = true;
        this.lastY = Laya.stage.mouseY;
    }

    private onMove(): void {
        if (!this.dragging) return;
        let maxY = Math.max(0, this.contentLabel.height - YsWnd.CONTENT_H);
        this.scrollY = Math.max(0, Math.min(maxY, this.scrollY - (Laya.stage.mouseY - this.lastY)));
        this.lastY = Laya.stage.mouseY;
        this.content.scrollRect = new Laya.Rectangle(0, this.scrollY, YsWnd.CONTENT_W, YsWnd.CONTENT_H);
    }

    private onUp(): void {
        this.dragging = false;
    }

    private onOkClick(): void {
        if (this.uiOpenData) {
            this.uiOpenData.run();
        }
        dataMgr.setSecret();
        this.close();
    }

    private onNoClick(): void {
        //原版此处调用渠道 exitApplication 退出应用；脚手架在 PC/预览环境仅提示
        Tips.showTips("需同意隐私政策后才能开始游戏");
    }

    /**
     * 入口：首次启动（getSecret() != 1）在 LoadingWnd 中以合规模式弹出；
     * 主页"隐私协议"按钮以浏览模式打开。
     */
    static open(cb?: Laya.Handler): YsWnd {
        return <YsWnd>WindowsMgr.Instance.openWindow(YsWnd, cb);
    }
}
