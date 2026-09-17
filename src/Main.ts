const { regClass, property } = Laya;

import { dataMgr } from "./GameData";
import { PlatMgr } from "./common/platform/PlatMgr";
import { BaseWin } from "./common/windows/BaseWin";
import { WindowsMgr } from "./common/windows/WindowsMgr";
import { recordMgr } from "./common/platform/RecordMgr";
import Mvc from "./common/mvc/Mvc";

/**
 * 3.x 引导脚本（挂场景运行）
 * 迁移自 2.x 版 Main：去除 FairyGUI 初始化与 fgui 加载页，
 * 引擎初始化（Laya.init/场景加载）由 IDE 与启动场景完成，脚本只负责框架启动。
 *
 * 游戏入口：在 onFrameworkReady() 中打开自己的首个场景窗口，
 * 例如：WindowsMgr.Instance.openWindow(HomeWnd);
 */
@regClass()
export class Main extends Laya.Script {

    onStart() {
        this.initFramework();
    }

    private initFramework(): void {
        //窗口挂载层（全屏，覆盖在场景之上）
        let rootLayer = new Laya.Sprite();
        rootLayer.name = "rootLayer";
        rootLayer.size(Laya.stage.width, Laya.stage.height);
        Laya.stage.addChild(rootLayer);
        BaseWin.rootLayer = rootLayer;
        Laya.stage.on(Laya.Event.RESIZE, this, () => {
            rootLayer.size(Laya.stage.width, Laya.stage.height);
            WindowsMgr.Instance.setFullScreen();
        });

        //玩家数据
        dataMgr.initData();

        //平台与广告 SDK
        PlatMgr.init();

        //3.x 无分包/zip 热更，loadSubpackage 仅保留统一入口，直接回调
        PlatMgr.loadSubpackage(this, () => {
            //小游戏前后台切换
            PlatMgr.OnShow(this, null);
            PlatMgr.OnHide(this, null);
            //抖音录屏
            recordMgr.initManager();

            this.onFrameworkReady();
        });
    }

    /**
     * 框架就绪，游戏逻辑从这里开始。
     * 打开第一个全屏场景：WindowsMgr.Instance.openWindow(YourHomeWnd);
     */
    private onFrameworkReady(): void {
        console.log("framework ready");
        Mvc.Send("FRAMEWORK_READY");
    }
}
