

/**录屏 */
export class RecordManger {
    private static instance: RecordManger = null;
    public static getInstance() {
        if (RecordManger.instance == null) {
            RecordManger.instance = new RecordManger();
        }
        return RecordManger.instance;
    }

    protected isRecording = false;
    protected _startRecordTime = -1;
    private GameRecorderManager = null;
    protected pauseing = false;
    tempRecordUrl: string = null;
    public static Stop_Recorder = "Stop_Recorder";

    protected _duration = 0;

    protected _stopRecordCallback: Function;
    protected _timeUpCallback: Function;
    protected _caller: any;

    public initManager() {
        if (!this.GameRecorderManager && window['tt']) {
            if (window['tt'].getSystemInfoSync().platform == 'devtools') return;// 开发者工具无法调试
            if (window["tt"].getGameRecorderManager) {
                this.GameRecorderManager = window["tt"].getGameRecorderManager();
                this.listenRecorderEvent();
            }
        }
    }

    public startGameRecorder(duration = 60, caller?: any, timeUpCallback?: Function) {
        if (this.GameRecorderManager) {
            this._caller = caller;
            this._timeUpCallback = timeUpCallback;
            this._duration = duration;
            this._startRecordTime = Date.now()
            this.isRecording = true;
            this.GameRecorderManager && this.GameRecorderManager.start({
                duration: duration
            });
            this.tempRecordUrl = null;
        }
    }

    get isRecord() {
        return this.isRecording;
    }

    get isPause() {
        return this.pauseing;
    }

    public pauseGameRecorder() {
        this.GameRecorderManager && this.GameRecorderManager.pause && this.GameRecorderManager.pause();
        this.isRecording = false;
        this.pauseing = true;
    }

    public resumeGameRecorder() {
        this.GameRecorderManager && this.GameRecorderManager.resume && this.GameRecorderManager.resume();
        this.isRecording = true;
        this.pauseing = false;
    }

    public stopGameRecorder(callback?: Function) {
        console.log('call stop 录屏');
        this.isRecording = false;
        this._stopRecordCallback = callback;

        this.GameRecorderManager && this.GameRecorderManager.stop();
    }

    public isSupportRecord() {
        let support = this.GameRecorderManager ? true : false;

        return support;
    }

    public getHasRecord() {
        console.log('this.tempRecordUrl', this.tempRecordUrl);

        let exist = this.tempRecordUrl ? true : false;
        return exist;
    }

    protected _timeUp() {
        this.stopGameRecorder();
    }

    protected _startRecordTimeListen() {
        let d = (this._duration * 1000) - (Date.now() - this._startRecordTime);
        if (d > 0) {
            Laya.timer.once(d, this, this._timeUp)
        }

    }

    private listenRecorderEvent() {
        if (!this.GameRecorderManager) {
            console.log("当前版本不支持录屏");
            return;
        }

        this.GameRecorderManager.onStart(() => {
            console.log("录屏开始");
            Laya.timer.clearAll(this);
            this._startRecordTimeListen()
        });

        this.GameRecorderManager.onPause(() => {
            console.log("录屏暂停");
            Laya.timer.clearAll(this);
        });

        this.GameRecorderManager.onResume(() => {
            console.log("录屏恢复");
            this._startRecordTimeListen()
        });

        this.GameRecorderManager.onStop(res => {
            console.log("录屏结束", res.videoPath);
            if (Date.now() - this._startRecordTime < 3000) {
                console.log('录屏时长低于3秒');
            }
            else {
                this.tempRecordUrl = res.videoPath;
            }
            Laya.timer.clearAll(this);

            if (!!this._stopRecordCallback) this._stopRecordCallback();
            // if (!!this._timeUpCallback) this._timeUpCallback();
            this._timeUpCallback.call(this._caller, { code: 0 });
        });

        this.GameRecorderManager.onError(err => {
            console.log("录屏异常", err);
            Laya.timer.clearAll(this);
        });

    }
}

export var recordMgr = RecordManger.getInstance();
