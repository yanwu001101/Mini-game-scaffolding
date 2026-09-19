/**
 * 全局提示条（原 fgui tipsComp + TipsWin 的纯 Laya 重建）
 * 样式对应原 tipsComp.xml：全宽 40px 黑底 + 白色居中文字；
 * 展示逻辑对应原 TipsWin.showTips：屏幕中下方上飘 50px 并淡出。
 * 监听 MVC_SHOW_TIPS（由 common/utils/Tips.ts 广播），Main 启动时 mount 一次。
 */
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";

export class TipsBar {
    private static bar: Laya.Sprite;
    private static label: Laya.Label;

    /**挂在 stage 顶层（Main.initFramework 里调用） */
    static mount(): void {
        if (TipsBar.bar) return;
        let W = Laya.stage.designWidth;

        TipsBar.bar = new Laya.Sprite();
        TipsBar.bar.mouseEnabled = false;
        TipsBar.bar.graphics.drawRect(0, 0, W, 40, "#000000");
        TipsBar.bar.alpha = 0;
        Laya.stage.addChild(TipsBar.bar);
        TipsBar.bar.zOrder = 9999;

        TipsBar.label = new Laya.Label();
        TipsBar.label.fontSize = 24;
        TipsBar.label.color = "#ffffff";
        TipsBar.label.width = W;
        TipsBar.label.align = "center";
        TipsBar.label.valign = "middle";
        TipsBar.label.height = 40;
        TipsBar.bar.addChild(TipsBar.label);

        Mvc.On(Const.MVC_SHOW_TIPS, null, (data: any) => {
            if (data && data.msg) TipsBar.show(data.msg);
        });
    }

    static show(msg: string): void {
        let W = Laya.stage.designWidth;
        let H = Laya.stage.designHeight;
        TipsBar.bar.pos(0, H - 140);
        TipsBar.label.text = msg;
        TipsBar.bar.alpha = 1;
        Laya.Tween.clearAll(TipsBar.bar);
        Laya.Tween.to(TipsBar.bar, { y: H - 190, alpha: 0 }, 1600, null, Laya.Handler.create(null, () => {
            Laya.Tween.clearAll(TipsBar.bar);
            TipsBar.bar.alpha = 0;
        }));
    }
}
