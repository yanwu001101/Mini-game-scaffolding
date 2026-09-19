const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import { dataMgr } from "../GameData";
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";
import { Tips } from "../common/utils/Tips";
import { PlatMgr, PlatType } from "../common/platform/PlatMgr";
import { Native } from "../common/platform/Native";
import { UiKit } from "./UiKit";
import GameLoadingWnd from "./GameLoadingWnd";
import GameWnd from "./GameWnd";
import YsWnd from "./YsWnd";

/**
 * 主页窗口（原 fgui 版 HomeWnd），场景脚本：挂载于 resources/ui/scene/HomeWnd.ls 根节点
 * 页面结构在 IDE 场景中编辑，代码负责：按平台显隐圆钮（沿用 2.x 逻辑）、按钮事件、
 * 金币/体力演示刷新（MVC + 存档链路）。
 */
@regClass()
export default class HomeWnd extends BaseWin {
    /**窗口场景文件（WindowsMgr 据此加载场景并取出本组件） */
    static sceneURL: string = "resources/ui/scene/HomeWnd.ls";

    private coinLabel: Laya.Label;
    private powerLabel: Laya.Label;

    constructor() {
        super();
        this.isFullWindow = true;
        this.showEffect = false;
    }

    protected onConstruct(): void {
        //开始游戏 → 游戏加载页 →（回调）GameWnd；原流程为 VideoBox 宝箱可选观看后进游戏
        let startBtn = <Laya.Button>this.view.getChildByName("startBtn");
        UiKit.pressEffect(startBtn);
        startBtn.on(Laya.Event.CLICK, this, () => {
            WindowsMgr.Instance.openWindow(GameLoadingWnd, {
                handler: Laya.Handler.create(null, () => {
                    WindowsMgr.Instance.openWindow(GameWnd);
                })
            });
        });

        //隐私协议（原 ysBtn）
        let ysBtn = <Laya.Button>this.view.getChildByName("ysBtn");
        UiKit.pressEffect(ysBtn);
        ysBtn.on(Laya.Event.CLICK, this, () => {
            YsWnd.open();
        });

        //添加到桌面（原 tableBtn）/ 更多精彩（原 moreBtn）：同一位置按平台二选一
        let tableBtn = <Laya.Button>this.view.getChildByName("tableBtn");
        UiKit.pressEffect(tableBtn);
        tableBtn.visible = PlatMgr.PLATFORM == PlatType.OppoRpk || PlatMgr.PLATFORM == PlatType.VivoRpk;
        tableBtn.on(Laya.Event.CLICK, this, () => {
            PlatMgr.installShortcut();
        });

        let moreBtn = <Laya.Button>this.view.getChildByName("moreBtn");
        UiKit.pressEffect(moreBtn);
        moreBtn.visible = PlatMgr.PLATFORM == PlatType.OppoApk;
        moreBtn.on(Laya.Event.CLICK, this, () => {
            Native.jumpgamecenter();
        });

        //脚手架演示区：金币/体力随数据变化自动刷新（MVC + 存档链路）
        this.coinLabel = <Laya.Label>this.view.getChildByName("coinLabel");
        this.powerLabel = <Laya.Label>this.view.getChildByName("powerLabel");

        let addCoinBtn = <Laya.Button>this.view.getChildByName("addCoinBtn");
        addCoinBtn.on(Laya.Event.CLICK, this, () => {
            dataMgr.Coin = dataMgr.Coin + 100;
        });

        let usePowerBtn = <Laya.Button>this.view.getChildByName("usePowerBtn");
        usePowerBtn.on(Laya.Event.CLICK, this, () => {
            if (dataMgr.usePower()) {
                Tips.showTips("体力已消耗");
            } else {
                Tips.showTips("体力不足");
            }
        });

        let clearBtn = <Laya.Button>this.view.getChildByName("clearBtn");
        clearBtn.on(Laya.Event.CLICK, this, () => {
            dataMgr.clearData();
            Tips.showTips("存档已清空");
        });
    }

    onShow(): void {
        super.onShow();
        Mvc.On(Const.MVC_CASH_CHANGE, this, this.refresh);
        Mvc.On(Const.MVC_POWER, this, this.refresh);
        this.refresh();
        //渠道循环广告按需开启：PlatMgr.AdSdk.showLoopBanner();
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

    /**入口：LoadingWnd 开始按钮 */
    static open(): HomeWnd {
        return <HomeWnd>WindowsMgr.Instance.openWindow(HomeWnd);
    }
}
