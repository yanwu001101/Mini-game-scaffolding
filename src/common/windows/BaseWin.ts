/**
 * 窗口基类（3.x 重写版）
 * 原 2.x 版本基于 FairyGUI GComponent，本次迁移去除 GUI 框架依赖，
 * 改用纯 Laya.Sprite 承载窗口，生命周期与窗口管理逻辑保持不变。
 * 子类在 onConstruct() 中用代码构建界面（或后续挂 IDE 预制体）。
 */

import { WindowsMgr } from "./WindowsMgr";
export enum WindowType {
	/**普通窗口 */
	Window,
	/**全屏窗口 */
	FullWindow,
	/**全屏场景 */
	FullScene
}
export class BaseWin {
	/**窗口根容器，由 Main 引导时指定；未指定时挂到 stage 上 */
	static rootLayer: Laya.Sprite;
	/**
	  * 生命周期结束
	  */
	public initialized: boolean = false;
	/**预加载资源（url 或 {url} 对象数组） */
	public loaddata: any[];
	// /**关闭是否清理 */
	public closeDispose: boolean;
	// /**关闭是否清理res */
	public closeDisposeRes: boolean;

	public windowType: WindowType = WindowType.Window;

	// 是否模态
	public isModel: boolean;

	public showLoadingbg: boolean;
	// 是否居中
	public isCenter: boolean = true;
	/** */
	public UIClass: any;
	/**开启该模块的时候传入的参数*/
	public uiOpenData: any = null;

	public view: Laya.Sprite;
	protected modelObj: Laya.Sprite;

	private _clickModelClose: boolean = true;
	public showEffect: boolean = true;
	/**点击模态关闭界面 */
	set clickModelClose(value: boolean) {
		this._clickModelClose = value;
		if (this.modelObj) {
			if (value)
				this.modelObj.on(Laya.Event.CLICK, this, this.clickModel);
			else
				this.modelObj.off(Laya.Event.CLICK, this, this.clickModel);
		}
	}
	get clickModelClose(): boolean {
		return this._clickModelClose;
	}

	/**是否全屏场景 */
	set isFullScene(value: boolean) {
		this.windowType = WindowType.FullScene;
	}
	get isFullScene(): boolean {
		return this.windowType == WindowType.FullScene;
	}
	/**是否全屏窗口 */
	set isFullWindow(value: boolean) {
		if (value) {
			this.windowType = WindowType.FullWindow;
		}
		else {
			this.windowType = WindowType.Window;
		}
	}
	get isFullWindow(): boolean {
		return this.windowType == WindowType.FullWindow;
	}
	/**是否普通窗口 */
	set isWindow(value: boolean) {
		this.windowType = WindowType.Window;
	}
	get isWindow(): boolean {
		return this.windowType == WindowType.Window;
	}

	/**该模块被创建完成后的回调函数*/
	public createUI(): void {
		this.view = new Laya.Sprite();
		if (this.isModel && this.parentDisplay) {
			this.modelObj = new Laya.Sprite();
			this.modelObj.size(this.parentDisplay.width + 2, this.parentDisplay.height + 2);
			this.modelObj.graphics.drawRect(0, 0, this.parentDisplay.width + 2, this.parentDisplay.height + 2, "rgba(0,0,0,0.5)");
		}
		this.onConstruct();
		this.initialized = true;
		this.addParent();
	}

	setSize() {
		if (this.view) {
			this.view.size(this.parentDisplay.width, this.parentDisplay.height);
			if (this.isCenter)
				this.centerView();
		}
	}

	/**视图在父容器中居中 */
	protected centerView(): void {
		if (this.view && this.view.parent) {
			this.view.x = (this.view.parent.width - this.view.width) / 2;
			this.view.y = (this.view.parent.height - this.view.height) / 2;
		}
	}

	/**初始化组件 第一次new的时候执行 子类覆盖次方法*/
	protected onConstruct(): void {

	}

	/**按名字查找子节点（等价原 fgui getChild 的常用场景） */
	getChild(name: string): Laya.Sprite {
		return this.view ? <Laya.Sprite>this.view.getChildByName(name) : null;
	}

	//该ui添加到显示对象
	public addParent(): void {
		var noparent = this.view.parent == null
		if (noparent) {
			if (this.modelObj && this.modelObj.parent == null) {
				this.parentDisplay.addChild(this.modelObj);
			}
			if (this.isFullScene)
				this.parentDisplay.addChildAt(this.view, 0);
			else {
				this.parentDisplay.addChild(this.view);
			}
		}
		if (this.isFullScene || this.isFullWindow) {//
			this.setSize();
			Laya.stage.on(Laya.Event.RESIZE, this, this.setSize);
		} else if (this.isCenter)
			this.centerView();
		if (noparent && this.initialized) this.onShow();
		this.tweenShow();
	}
	public setTop() {
		if (this.view && this.view.parent) {
			this.view.parent.setChildIndex(this.view, this.view.parent.numChildren - 1);
			if (this.modelObj && this.modelObj.parent) {
				this.modelObj.parent.setChildIndex(this.modelObj, this.modelObj.parent.numChildren - 2);
			}
		}
	}

	/*
	*打开界面时处理 每次打开显示执行 子类覆盖次方法
	*/
	onShow(): void {
		Laya.timer.frameLoop(1, this, this.update);
	}

	/**
	 * 关闭界面时回调
	 */
	onHide(): void {
		Laya.timer.clear(this, this.update);
	}

	onShowEnd(): void {

	}

	update(): void {

	}
	/**缓动显示 */
	public tweenShow(): void {
		this.view.mouseEnabled = false;

		if (!this.isFullScene) {
			if (this.showEffect) {
				this.view.pivotX = this.view.width / 2;
				this.view.pivotY = this.view.height / 2;
				this.view.scaleX = this.view.scaleY = 0.8;
				Laya.Tween.clearAll(this.view);
				Laya.Tween.to(this.view, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, this.tweenShowComp));
			} else
				this.tweenShowComp();
		} else {
			this.tweenShowComp();
		}
	}

	protected tweenShowComp() {
		this.view.mouseEnabled = true;
		this.view.alpha = 1;
		if (this.clickModelClose && this.modelObj) {
			this.modelObj.on(Laya.Event.CLICK, this, this.clickModel);
		}
		this.onShowEnd();
	}
	/**点击模态 */
	public clickModel() {
		this.close();
	}
	//从显示对象移除
	public removeParent(showEffect: boolean = true): void {
		Laya.stage.off(Laya.Event.RESIZE, this, this.setSize);
		if (showEffect)
			this.tweenRemove(null);
		else this.tweenRemoveComp();
	}
	/**缓动隐藏 */
	public tweenRemove(comp: Laya.Handler): void {
		if (this.showEffect && this.view) {
			this.view.mouseEnabled = false;
			if (comp == null)
				comp = Laya.Handler.create(this, this.tweenRemoveComp);
			if (!this.isFullScene) {
				this.view.alpha = 1;
				Laya.Tween.clearAll(this.view);
				Laya.Tween.to(this.view, { alpha: 0 }, 100, null, comp);
			} else {
				if (comp) {
					comp.run();
				} else this.tweenRemoveComp();
			}
		} else if (comp) {
			comp.run();
		} else this.tweenRemoveComp();

	}
	/**缓动隐藏结束动画 */
	protected tweenRemoveComp(): void {
		if (this.view) {
			this.view.alpha = 1;
			this.view.mouseEnabled = true;
		}
		this.onHide();
		this.removeFromParent();
	}
	public removeFromParent() {
		if (this.view)
			this.view.removeSelf();
		if (this.modelObj)
			this.modelObj.removeSelf();

		if (this.closeDispose)
			this.dispose();
	}
	//析构回调
	public dispose(): void {
		Laya.stage.off(Laya.Event.RESIZE, this, this.setSize);
		if (this.closeDisposeRes && this.loaddata) {
			for (var i: number = 0; i < this.loaddata.length; i++) {
				var url = typeof this.loaddata[i] == "string" ? this.loaddata[i] : this.loaddata[i].url;
				Laya.loader.clearTextureRes(url);
				Laya.loader.clearRes(url);
			}
		}

		this.UIClass = null;
		if (this.view) {
			Laya.Tween.clearAll(this.view);
			this.view.destroy();
			this.view = null;
		}
		if (this.modelObj) {
			Laya.Tween.clearAll(this.modelObj);
			this.modelObj.destroy();
			this.modelObj = null;
		}
	}
	/**窗口挂载的容器 */
	public get parentDisplay(): Laya.Sprite {
		return BaseWin.rootLayer ? BaseWin.rootLayer : <Laya.Sprite>(<any>Laya.stage);
	}
	/**关闭界面 */
	public close(): void {
		WindowsMgr.Instance.closeWindow(this);

	}
	/**后退上一个场景界面 */
	public back(): void {
		WindowsMgr.Instance.backWindow();
	}

}
