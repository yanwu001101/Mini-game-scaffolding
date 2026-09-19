/**
 * UI 行为小工具（对应原 fgui 组件交互的常用件）
 * 页面结构已在窗口场景（resources/ui/scene/*.ls）中搭建，代码只补充场景表达不了的行为。
 */
export class UiKit {

    /**
     * 给预制体里的按钮补充"按下 0.95 缩放"手感
     * （对应原 fgui simpleBtn 的 downEffect=scale, downEffectValue=.95）
     */
    static pressEffect(btn: Laya.Button): void {
        if (!btn) return;
        btn.on(Laya.Event.MOUSE_DOWN, null, () => {
            btn.pivotX = btn.width / 2;
            btn.pivotY = btn.height / 2;
            btn.scaleX = btn.scaleY = 0.95;
        });
        let up = () => { btn.scaleX = btn.scaleY = 1; };
        btn.on(Laya.Event.MOUSE_UP, null, up);
        btn.on(Laya.Event.MOUSE_OUT, null, up);
    }
}
