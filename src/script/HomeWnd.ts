/**
 * 示例主页窗口（替代原 fgui HomeWnd）
 * 用纯 Laya UI 组件构建，演示 BaseWin 窗口系统 + MVC 事件 + 存档链路。
 * 项目已启用 laya.ui 模块（PlayerSettings.modules.laya.ui），可直接用 Label/Button。
 */
import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import { dataMgr } from "../GameData";
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";
import { Tips } from "../common/utils/Tips";

export default class HomeWnd extends BaseWin {
    private coinLabel: Laya.Label;
    private powerLabel: Laya.Label;

    constructor() {
        super();
        this.isFullScene = true;
        this.showEffect = false;
    }

    protected onConstruct(): void {
        //背景
        let bg = new Laya.Sprite();
        bg.graphics.drawRect(0, 0, Laya.stage.designWidth, Laya.stage.designHeight, "#2b7ce9");
        this.view.addChild(bg);

        //标题
        let title = new Laya.Label("Mini-game Scaffolding");
        title.fontSize = 48;
        title.color = "#ffffff";
        title.bold = true;
        title.centerX = 0;
        title.y = 160;
        this.view.addChild(title);

        //金币 / 体力（随数据变化自动刷新）
        this.coinLabel = this.createInfoLabel(280);
        this.powerLabel = this.createInfoLabel(340);

        //加金币按钮
        let addCoinBtn = this.createButton("金币 +100", 420);
        addCoinBtn.on(Laya.Event.CLICK, this, () => {
            dataMgr.Coin = dataMgr.Coin + 100;
        });

        //用体力按钮
        let usePowerBtn = this.createButton("消耗体力", 520);
        usePowerBtn.on(Laya.Event.CLICK, this, () => {
            if (dataMgr.usePower()) {
                Tips.showTips("体力已消耗");
            } else {
                Tips.showTips("体力不足");
            }
        });

        //清档按钮
        let clearBtn = this.createButton("清空存档", 620);
        clearBtn.on(Laya.Event.CLICK, this, () => {
            dataMgr.clearData();
            Tips.showTips("存档已清空");
        });
    }

    private createInfoLabel(y: number): Laya.Label {
        let label = new Laya.Label();
        label.fontSize = 32;
        label.color = "#ffec8b";
        label.centerX = 0;
        label.y = y;
        this.view.addChild(label);
        return label;
    }

    private createButton(text: string, y: number): Laya.Button {
        let btn = new Laya.Button("resources/layaAir.png", text);
        btn.labelColors = "#ffffff";
        btn.labelSize = 28;
        btn.sizeGrid = "10,10,10,10";
        btn.size(240, 70);
        btn.centerX = 0;
        btn.y = y;
        btn.labelBold = true;
        this.view.addChild(btn);
        return btn;
    }

    onShow(): void {
        super.onShow();
        Mvc.On(Const.MVC_CASH_CHANGE, this, this.refresh);
        Mvc.On(Const.MVC_POWER, this, this.refresh);
        this.refresh();
    }

    onHide(): void {
        super.onHide();
        Mvc.Off(Const.MVC_CASH_CHANGE, this, this.refresh);
        Mvc.Off(Const.MVC_POWER, this, this.refresh);
    }

    private refresh(): void {
        this.coinLabel.text = "金币: " + dataMgr.Coin;
        this.powerLabel.text = "体力: " + dataMgr.Power;
    }

    /**入口：Main.onFrameworkReady 里调用 WindowsMgr.Instance.openWindow(HomeWnd); */
    static open(): HomeWnd {
        return <HomeWnd>WindowsMgr.Instance.openWindow(HomeWnd);
    }
}
