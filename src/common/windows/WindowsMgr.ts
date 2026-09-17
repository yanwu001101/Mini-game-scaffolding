/**
 * 窗口管理类（3.x 适配版）
 * 去除 FairyGUI 包加载分支（FguiLoadMgr），资源预加载改用 3.x Promise loader；
 * 窗口栈/全屏场景/返回导航逻辑与 2.x 版一致。
 */
import { BaseWin } from "./BaseWin";
import { Native } from "../platform/Native";

export class WindowsMgr {
    private static _instance: WindowsMgr;
    public static get Instance(): WindowsMgr {
        if (!WindowsMgr._instance) {
            WindowsMgr._instance = new WindowsMgr();
        }
        return WindowsMgr._instance;
    }
    // /**已经打开的列表 */
    public openList: BaseWin[] = [];

    /**全屏显示列表 */
    public fullSceneList: BaseWin[] = [];

    /**不析构的窗口 */
    public noDisposeList: BaseWin[] = [];

    /**弹出窗口 */
    public currentFullScene: BaseWin;
    public openWindow(UIClass: any, uiOpenData: any = null, isback: boolean = false): BaseWin {
        var win: BaseWin = this.getWindow(UIClass);
        if (win) {
            win.uiOpenData = uiOpenData;
            if (win.isWindow)
                win.setTop();
            // win.onShow();
            return win;
        }
        for (var i = 0, len = this.noDisposeList.length; i < len; i++) {
            win = this.noDisposeList[i];
            if (win instanceof UIClass) {
                this.noDisposeList.splice(i, 1);
                win.uiOpenData = uiOpenData;
                if (win.isFullScene && this.currentFullScene && this.currentFullScene.view) {
                    this.currentFullScene.tweenRemove(Laya.Handler.create(this, this.addWin, [win, isback]));
                } else this.addWin(win, isback);
                // win.onShow();
                return win;
            }
        }
        if (this.loadwin != null && this.loadwin instanceof UIClass) {
            // win.onShow();
            return this.loadwin;
        }
        win = new UIClass();
        win.UIClass = UIClass;
        win.uiOpenData = uiOpenData;

        if (win.isFullScene && this.currentFullScene && this.currentFullScene && this.currentFullScene.view) {
            this.currentFullScene.tweenRemove(Laya.Handler.create(this, this.showwin, [win, isback]));
        } else this.showwin(win, isback);
        // win.onShow();
        return win;
    }
    private showwin(win: BaseWin, isback: boolean) {
        if (win.loaddata && win.loaddata.length > 0) {
            this.loadWinRes(win, isback);
        } else this.addWin(win, isback);
    }
    public getWindow(UIClass: any): BaseWin {
        for (var i: number = 0, len: number = this.openList.length; i < len; i++) {
            var win: BaseWin = this.openList[i];
            if (win instanceof UIClass) {
                return win;
            }
        }
        return null;
    }
    public hasWindow(UIClass: any): BaseWin {
        var win = this.getWindow(UIClass)
        if (win) return win;
        return this.getNotDisposeWindow(UIClass);
    }
    public setFullScreen(): void {
        for (var i = 0, len = this.openList.length; i < len; i++) {
            var win: BaseWin = this.openList[i];
            if (win.isFullScene || win.isFullWindow) {
                win.setSize();
            }
        }
    }
    private addWin(win: BaseWin, isback: boolean): void {
        if (this.openList.indexOf(win) == -1)
            this.openList.push(win);
        if (win.isFullScene) {
            if (this.currentFullScene && this.currentFullScene != win) {
                if (!isback) {
                    if (this.fullSceneList.indexOf(this.currentFullScene.UIClass) == -1)
                        this.fullSceneList.push(this.currentFullScene.UIClass);
                }
                this.closeWindow(this.currentFullScene, false);
            }
            this.currentFullScene = win;
        } else {

        }
        if (win.initialized) {
            if (win.view.parent == null)
                win.addParent();
            else
                win.tweenShow();
        } else win.createUI();
    }
    /**返回上一个场景 */
    public backWindow(): boolean {
        var UIClass = this.fullSceneList.pop();
        if (UIClass) {
            this.openWindow(UIClass, null, true);
            return true
        } return false;

    }
    /**关闭窗口 */
    public closeWindow(win: BaseWin, showEffect: boolean = true): void {
        var index: number = this.openList.indexOf(win);
        if (index != -1) this.openList.splice(index, 1);
        if (!win.closeDispose) {
            index = this.noDisposeList.indexOf(win);
            if (index == -1) this.noDisposeList.push(win);
        }
        win.removeParent(showEffect);
    }

    public getNotDisposeWindow(UIClass: any): BaseWin {
        for (var i: number = 0, len: number = this.noDisposeList.length; i < len; i++) {
            var win: BaseWin = this.noDisposeList[i];
            if (win instanceof UIClass) {
                return win;
            }
        }
        return null;
    }
    public removeNotDisposeWindow(UIClass: any) {
        for (var i = 0, len = this.noDisposeList.length; i < len; i++) {
            var win: BaseWin = this.noDisposeList[i];
            if (win instanceof UIClass) {
                this.noDisposeList.splice(i, 1);
                win.closeDispose = true;
                win.removeFromParent();
                return win;
            }
        }
    }
    /**关闭清理所有窗口 */
    public closeAllWindow(): void {
        try {
            for (var i = 0, len = this.openList.length; i < len; i++) {
                var win: BaseWin = this.openList[i];
                win.closeDispose = true;
                win.removeFromParent();
            }
            for (i = 0, len = this.noDisposeList.length; i < len; i++) {
                win = this.noDisposeList[i];
                win.closeDispose = true;
                win.removeFromParent();
            }
        } catch (e) {

        }
        this.currentFullScene = null;
        this.openList = [];
        this.noDisposeList = [];
        this.fullSceneList = [];
        this.loadwin = null;
        this.nextLoadWin = [];
    }
    public closeALLPopWindow(without: any[]): void {
        for (var i = this.openList.length - 1; i > -1; i--) {
            var win: BaseWin = this.openList[i];
            if (win.isWindow && (!without || this.Instanceof(win, without) == -1)) {
                this.closeWindow(win, false);
            }
        }
    }
    public hasPopWindow(without: any[] = null): boolean {
        for (var i = this.openList.length - 1; i > -1; i--) {
            var win: BaseWin = this.openList[i];
            if (win.isWindow && (!without || this.Instanceof(win, without) == -1)) {
                return true;
            }
        }
        return false;
    }
    private Instanceof(wind, list: any[]) {
        for (var i = 0; i < list.length; i++) {
            if (wind instanceof list[i]) {
                return i;
            }
        }
        return -1;
    }
    ////////////////////////////////////loadwin//////////////////////////////////////////
    private loadwin: BaseWin;
    private loadwinisback: boolean;
    /**加载队列 */
    private nextLoadWin = [];
    public loadWinRes(win: BaseWin, isback: boolean): void {
        if (this.loadwin) {
            this.nextLoadWin.push([win, isback]);
            return;
        }
        this.loadwin = win;
        this.loadwinisback = isback;
        if (win.loaddata) {
            Laya.loader.load(win.loaddata.concat()).then(() => {
                this.onResourceLoadComplete(null, null);
            }).catch((err) => {
                this.OnError(err);
            });
        } else
            this.onResourceLoadComplete(null, null);
    }

    private onResourceLoadComplete(url, data): void {
        if (this.loadwin) {
            this.addWin(this.loadwin, this.loadwinisback);
            this.loadwin = null;
        }
        if (this.nextLoadWin.length > 0) {
            var next = this.nextLoadWin.shift();
            this.loadWinRes(next[0], next[1]);
        }
    }
    private OnLoading(progress: number): void {
        console.log("加载进度: " + progress);
    }

    private OnError(err: any): void {
        console.log("加载失败: " + err);
        if (this.loadwin) {
            var clear = this.loadwin != this.currentFullScene;
            var add = this.currentFullScene && this.loadwin.isFullScene;
            if (clear) {
                this.loadwin.dispose();
                this.loadwin = null;
            }
            if (add) {
                this.addWin(this.currentFullScene, true);
            }
        }
    }
    public backTime = 0;
    public setAndroidBack(): void {
        var conch = (<any>Laya.Browser.window).conch;
        if (Native.isNative && conch && conch.setOnBackPressedFunction) {
            conch.setOnBackPressedFunction(() => {
                if (WindowsMgr.Instance.fullSceneList.length > 0) {
                    WindowsMgr.Instance.backWindow();
                } else {
                    var time = Laya.Browser.now();
                    if (time - WindowsMgr.Instance.backTime < 2000)
                        conch.exit();
                    else {
                    }
                    WindowsMgr.Instance.backTime = time;
                }
            });
        }
    }

}
