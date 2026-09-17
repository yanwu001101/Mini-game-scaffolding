export default class CameraMoveScript extends Laya.Script {

    /** @private */
    protected _tempVector3: Laya.Vector3 = new Laya.Vector3();
    protected lastMouseX: number;
    protected lastMouseY: number;
    protected yawPitchRoll: Laya.Vector3 = new Laya.Vector3();
    protected resultRotation: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationZ: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationX: Laya.Quaternion = new Laya.Quaternion();
    protected tempRotationY: Laya.Quaternion = new Laya.Quaternion();
    protected isMouseDown: Boolean;
    protected rotaionSpeed: number = 0.00006;
    protected camera: Laya.BaseCamera;
    protected scene: Laya.Scene3D;

    constructor() {
        super();
    }

    /**
     * @private
     */
    protected _updateRotation(): void {
        if (Math.abs(this.yawPitchRoll.y) < 1.50) {
            Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
            this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
            this.camera.transform.localRotation = this.camera.transform.localRotation;
        }
    }

    /**
     * @inheritDoc
     */
    public onAwake(): void {
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        Laya.stage.on(Laya.Event.MOUSE_WHEEL, this, this.mousWheel);
        //Laya.stage.on(Event.RIGHT_MOUSE_OUT, this, mouseOut);
        this.camera = this.owner as Laya.BaseCamera;
    }

    /**
     * @inheritDoc
     */
    public onUpdate(): void {
        var elapsedTime: number = Laya.timer.delta;
        //3.x：KeyBoardManager 已合并进 InputManager
        if (Laya.InputManager.hasKeyDown(Laya.Keyboard.CONTROL)) {
            Laya.InputManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);//W
            Laya.InputManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);//S
            Laya.InputManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);//A
            Laya.InputManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);//D
            Laya.InputManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);//Q
            Laya.InputManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);//E
        }
        if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
            var offsetX: number = Laya.stage.mouseX - this.lastMouseX;
            var offsetY: number = Laya.stage.mouseY - this.lastMouseY;

            var yprElem: Laya.Vector3 = this.yawPitchRoll;
            yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
            yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
            this._updateRotation();
        }
        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
    }

    /**
     * @inheritDoc
     */
    public onDestroy(): void {
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
    }

    protected mouseDown(e: Laya.Event): void {
        this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);

        this.lastMouseX = Laya.stage.mouseX;
        this.lastMouseY = Laya.stage.mouseY;
        this.isMouseDown = true;
    }

    protected mouseUp(e: Laya.Event): void {
        this.isMouseDown = false;
    }

    protected mouseOut(e: Laya.Event): void {
        this.isMouseDown = false;
    }
    protected mousWheel(e: Laya.Event) {
        if (Laya.InputManager.hasKeyDown(Laya.Keyboard.CONTROL))
            this.moveForward((<any>e).delta * 0.5);
    }
    /**
     * 向前移动。
     * @param distance 移动距离。
     */
    public moveForward(distance: number): void {
        this._tempVector3.x = this._tempVector3.y = 0;
        this._tempVector3.z = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    /**
     * 向右移动。
     * @param distance 移动距离。
     */
    public moveRight(distance: number): void {
        this._tempVector3.y = this._tempVector3.z = 0;
        this._tempVector3.x = distance;
        this.camera.transform.translate(this._tempVector3);
    }

    /**
     * 向上移动。
     * @param distance 移动距离。
     */
    public moveVertical(distance: number): void {
        this._tempVector3.x = this._tempVector3.z = 0;
        this._tempVector3.y = distance;
        this.camera.transform.translate(this._tempVector3, false);
    }

}
