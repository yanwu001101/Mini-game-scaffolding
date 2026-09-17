
export class HttpMgr {
    private static _inst: HttpMgr;
    private httpRequest: Laya.HttpRequest;
    private m_caller: any;
    private m_callback: Function;


    static get inst(): HttpMgr {
        HttpMgr._inst = HttpMgr._inst || new HttpMgr();
        return HttpMgr._inst;
    }

    get<T>(data: T, url: string, caller?: any, callback?: Function) {
        this.m_caller = caller;
        this.m_callback = callback;
        this.httpRequest = new Laya.HttpRequest();
        this.httpRequest.on(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
        this.httpRequest.once(Laya.Event.COMPLETE, this, this.OnComplete);
        this.httpRequest.once(Laya.Event.ERROR, this, this.OnError);
        this.httpRequest.http.timeout = 5000;
        let param = "";
        for (var p in data) {
            param = param + p + "=" + data[p] + "&";
        }
        param = param.substring(0, param.length - 1);
        url = url + "?" + param;
        console.log("url:", url);
        this.httpRequest.send(url, null, "get", "text");
    }

    post<T>(data: T, url: string, caller?: any, callback?: Function) {
        this.m_caller = caller;
        this.m_callback = callback;
        this.httpRequest = new Laya.HttpRequest();
        this.httpRequest.on(Laya.Event.PROGRESS, this, this.onHttpRequestProgress);
        this.httpRequest.once(Laya.Event.COMPLETE, this, this.OnComplete);
        this.httpRequest.once(Laya.Event.ERROR, this, this.OnError);
        this.httpRequest.http.timeout = 20000;
        console.log("send data:", JSON.stringify(data));
        this.httpRequest.send(url, JSON.stringify(data), "post", "json", ["Content-Type", "application/json"]);
    }

    private onHttpRequestProgress(data) {
        console.log("http进度：", data);
    }

    private OnComplete(data) {
        // console.log("http返回:", this.httpRequest.data);
        if (this.m_caller && this.m_callback) {
            this.m_callback.apply(this.m_caller, [this.httpRequest.data]);
        }
    }

    private OnError(error) {
        console.log("http错误：", error);
        // if (this.m_caller && this.m_callback) {
        //     const data = this.httpRequest.data;
        //     this.m_callback.apply(this.m_caller, [{ state: -1, error: error, data: data }]);
        // }
    }
}

export var httpMgr = HttpMgr.inst;