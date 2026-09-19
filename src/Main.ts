const { regClass, property } = Laya;

import { dataMgr } from "./GameData";
import { PlatMgr } from "./common/platform/PlatMgr";
import { BaseWin } from "./common/windows/BaseWin";
import { WindowsMgr } from "./common/windows/WindowsMgr";
import { recordMgr } from "./common/platform/RecordMgr";
import LoadingWnd from "./script/LoadingWnd";
import { TipsBar } from "./script/TipsBar";

/**
 * 3.x 引导脚本（挂场景运行）
 * 每个窗口页面是场景（assets/resources/ui/scene/*.ls），窗口类作为脚本组件挂在各自场景根节点，
 * WindowsMgr 打开窗口时加载场景并取出组件；脚本只负责框架启动与首屏（LoadingWnd 启动流程）。
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
     */
    private onFrameworkReady(): void {
        console.log("framework ready");
        //全局提示条（原 fgui tipsComp），挂 stage 顶层
        TipsBar.mount();
        //启动流程：加载页（进度条+预加载）→ 首启隐私协议 → 开始按钮 → 主页
        LoadingWnd.open();
    }
}
