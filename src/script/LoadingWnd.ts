const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import { dataMgr } from "../GameData";
import HomeWnd from "./HomeWnd";
import GameLoadingWnd from "./GameLoadingWnd";
import GameWnd from "./GameWnd";
import PauseWnd from "./PauseWnd";
import ResultWnd from "./ResultWnd";
import YsWnd from "./YsWnd";

/**
 * 启动加载窗口（原 Loading 包 Loading 页 + StartGameWnd 的简化重建）
 * 场景脚本：挂载于 resources/ui/scene/LoadingWnd.ls 根节点。
 * 流程（对应原项目 Main.initFgui → Loading.load → StartGameWnd）：
 * 1) 进度条模式：边走进度边预加载后续所有窗口场景
 * 2) 完成后切开始模式：首次启动先弹隐私协议（原 StartGameWnd.onShow 逻辑），同意后显示开始按钮
 * 3) 点开始 → 打开主页（原项目此处还有 AdSdk.showSplash/createRewardVideo，按渠道接入）
 */
@regClass()
export default class LoadingWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/LoadingWnd.ls";

    /**后续窗口场景清单（进度条真实预加载的内容） */
    private static PRELOAD_SCENES: string[] = [
        HomeWnd.sceneURL,
        GameLoadingWnd.sceneURL,
        GameWnd.sceneURL,
        PauseWnd.sceneURL,
        ResultWnd.sceneURL,
        YsWnd.sceneURL
    ];

    private bar: Laya.ProgressBar;
    private tf: Laya.Label;
    private startBtn: Laya.Button;

    private progress: number = 0;
    private preloadDone: boolean = false;
    private enterStart: boolean = false;

    constructor() {
        super();
        this.isFullWindow = true;
        this.showEffect = false;
    }

    protected onConstruct(): void {
        this.bar = <Laya.ProgressBar>this.view.getChildByName("bar");
        this.tf = <Laya.Label>this.view.getChildByName("tf");
        this.startBtn = <Laya.Button>this.view.getChildByName("startBtn");
        this.startBtn.on(Laya.Event.CLICK, this, this.onStartClick);
    }

    onShow(): void {
        super.onShow();
        this.toProgressMode();
    }

    /**阶段一：进度条 + 预加载后续场景 */
    private toProgressMode(): void {
        this.progress = 0;
        this.preloadDone = false;
        this.enterStart = false;
        this.bar.visible = true;
        this.tf.visible = true;
        this.startBtn.visible = false;
        this.bar.value = 0;

        Laya.loader.load(LoadingWnd.PRELOAD_SCENES).then(() => {
            this.preloadDone = true;
        }).catch((err) => {
            console.error("[LoadingWnd] 预加载失败", err);
            this.preloadDone = true;
        });
        //进度演示：真实加载完成前最多走到 90%
        Laya.timer.loop(50, this, this.stepProgress);
    }

    private stepProgress(): void {
        if (!this.preloadDone && this.progress >= 90) return;
        this.progress += 3;
        this.bar.value = Math.min(this.progress, 100) / 100;
        if (this.progress >= 100 && this.preloadDone && !this.enterStart) {
            this.enterStart = true;
            Laya.timer.clear(this, this.stepProgress);
            this.toStartMode();
        }
    }

    /**阶段二：开始模式（原 StartGameWnd：首次启动先弹隐私，同意后显示开始按钮） */
    private toStartMode(): void {
        this.bar.visible = false;
        this.tf.visible = false;
        if (!dataMgr.getSecret()) {
            this.startBtn.visible = false;
            YsWnd.open(Laya.Handler.create(this, this.showStartBtn));
        } else {
            this.showStartBtn();
        }
    }

    private showStartBtn(): void {
        this.startBtn.visible = true;
    }

    private onStartClick(): void {
        //原项目此处按渠道执行 AdSdk.showSplash / createRewardVideo
        HomeWnd.open();
        this.close();
    }

    /**入口：Main.onFrameworkReady */
    static open(): LoadingWnd {
        return <LoadingWnd>WindowsMgr.Instance.openWindow(LoadingWnd);
    }
}
