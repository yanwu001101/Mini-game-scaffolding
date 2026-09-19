const { regClass } = Laya;

import { BaseWin } from "../common/windows/BaseWin";
import { WindowsMgr } from "../common/windows/WindowsMgr";
import Mvc from "../common/mvc/Mvc";
import Const from "../Const";
import { UiKit } from "./UiKit";
import PauseWnd from "./PauseWnd";

/**演示用移动速度（像素/帧，摇杆满杆时） */
const DEMO_MOVE_SPEED = 6;
/**摇杆有效半径 */
const JOY_RADIUS = 90;
/**摇杆中心（joyBox 尺寸 250x250） */
const JOY_CENTER = 125;

/**
 * 游戏窗口（原 fgui 版 GameWnd + GameUI），场景脚本：挂载于 resources/ui/scene/GameWnd.ls 根节点
 * 页面：飞机（演示对象）、范围圈、左下角虚拟摇杆（joyBox/joyThumb）、左上角暂停按钮。
 * 摇杆输出通过 MVC_JOYSTICK_MOVE 广播；正式玩法在 view 底层自行扩展（原 3D 容器位）。
 */
@regClass()
export default class GameWnd extends BaseWin {
    /**窗口场景文件 */
    static sceneURL: string = "resources/ui/scene/GameWnd.ls";

    private plane: Laya.Image;
    private joyBox: Laya.Box;
    private joyThumb: Laya.Image;
    private joyDragging: boolean = false;
    private joyVec: { x: number, y: number } = { x: 0, y: 0 };
    private paused: boolean = false;

    constructor() {
        super();
        this.isFullWindow = true;
        this.showEffect = false;
    }

    protected onConstruct(): void {
        this.plane = <Laya.Image>this.view.getChildByName("plane");
        this.joyBox = <Laya.Box>this.view.getChildByName("joyBox");
        this.joyThumb = <Laya.Image>this.joyBox.getChildByName("joyThumb");

        //按下在摇杆上，移动/抬起监听在 stage（避免滑到子元素上触发 MOUSE_OUT 打断拖动）
        this.joyBox.on(Laya.Event.MOUSE_DOWN, this, this.onJoyDown);

        let pauseBtn = <Laya.Button>this.view.getChildByName("pauseBtn");
        UiKit.pressEffect(pauseBtn);
        pauseBtn.on(Laya.Event.CLICK, this, () => {
            PauseWnd.open();
        });
    }

    private onJoyDown(): void {
        this.joyDragging = true;
        this.onJoyMove();
    }

    private onJoyMove(): void {
        if (!this.joyDragging) return;
        let lp = this.joyBox.globalToLocal(new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY));
        let dx = lp.x - JOY_CENTER;
        let dy = lp.y - JOY_CENTER;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > JOY_RADIUS) {
            dx = dx / dist * JOY_RADIUS;
            dy = dy / dist * JOY_RADIUS;
        }
        this.joyThumb.pos(JOY_CENTER + dx - 22, JOY_CENTER + dy - 22);
        this.joyVec.x = dx / JOY_RADIUS;
        this.joyVec.y = dy / JOY_RADIUS;
        Mvc.Send(Const.MVC_JOYSTICK_MOVE, { x: this.joyVec.x, y: this.joyVec.y });
    }

    private onJoyUp(): void {
        if (!this.joyDragging) return;
        this.joyDragging = false;
        this.joyThumb.pos(JOY_CENTER - 22, JOY_CENTER - 22);
        this.joyVec.x = 0;
        this.joyVec.y = 0;
        Mvc.Send(Const.MVC_JOYSTICK_MOVE, { x: 0, y: 0 });
    }

    onShow(): void {
        super.onShow();
        Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onJoyMove);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onJoyUp);
        Mvc.On(Const.MVC_GAME_PAUSE, this, this.onPause);
        Mvc.On(Const.MVC_GAME_RESUME, this, this.onResume);
        Mvc.On(Const.MVC_GO_HOME, this, this.onGoHome);
        this.paused = false;
    }

    onHide(): void {
        super.onHide();
        Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onJoyMove);
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.onJoyUp);
        Mvc.Off(Const.MVC_GAME_PAUSE, this, this.onPause);
        Mvc.Off(Const.MVC_GAME_RESUME, this, this.onResume);
        Mvc.Off(Const.MVC_GO_HOME, this, this.onGoHome);
    }

    private onPause(): void { this.paused = true; }
    private onResume(): void { this.paused = false; }

    private onGoHome(): void {
        //主页窗口在下方层叠着，关闭自己即可露出
        this.close();
    }

    update(): void {
        if (this.paused) return;
        let W = Laya.stage.designWidth;
        let H = Laya.stage.designHeight;
        this.plane.x += this.joyVec.x * DEMO_MOVE_SPEED;
        this.plane.y += this.joyVec.y * DEMO_MOVE_SPEED;
        this.plane.x = Math.max(0, Math.min(W, this.plane.x));
        this.plane.y = Math.max(0, Math.min(H, this.plane.y));
    }

    /**入口：GameLoadingWnd 完成后打开 */
    static open(): GameWnd {
        return <GameWnd>WindowsMgr.Instance.openWindow(GameWnd);
    }
}
