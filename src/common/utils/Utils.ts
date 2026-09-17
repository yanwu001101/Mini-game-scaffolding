
/**
 * @author seacole 
 * 工具类
 */
export class Utils {

    public static isWorkDay() {
        let date = new Date();
        let wd = date.getDay();
        if (wd == 0 || wd == 6) {
            return false;
        }
        return true;
    }

    public static isWorkingHours() {
        let date = new Date();
        let h = date.getHours();//当天小时 0-23
        if (h > 8 && h < 18) {
            return true;
        }
        return false;
    }

    public static canPlay() {
        let date = new Date();
        let h = date.getHours();//当天小时 0-23
        let wd = date.getDay();//星期几 0-6
        let y = date.getFullYear();
        let m = date.getMonth();//0-11
        let d = date.getDate();//1-31
        console.log("y", y);
        console.log("h", h);
        console.log("m", m);
        console.log("d", d);
        console.log("wd", wd);
        if (h == 20) {
            if (wd == 0 || wd == 5 || wd == 6) {
                return true;
            }
            else if (m == 10 && d < 8) {
                return true;
            }
            else if (y == 2022) {
                if (m == 0) {
                    let dd = [1, 24, 25, 26, 27, 28, 29, 30];
                    if (dd.indexOf(d) > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public static FormatCoin(num: number): string {
        let str = "";
        if (num > 1000000000000000) {
            num = num / 1000000000000000;
            num = Utils.FomatFloat(num, 2);
            str = num + "aa";
        }
        else if (num > 1000000000000) {
            num = num / 1000000000000;
            num = Utils.FomatFloat(num, 2);
            str = num + "t";
        }
        else if (num > 1000000000) {
            num = num / 1000000000;
            num = Utils.FomatFloat(num, 2);
            str = num + "b";
        }
        else if (num > 1000000) {
            num = num / 1000000;
            num = Utils.FomatFloat(num, 2);
            str = num + "m";
        }
        else if (num > 1000) {
            num = num / 1000;
            num = Utils.FomatFloat(num, 2);
            str = num + "k";
        } else {
            str = "" + num;
        }

        return str;
    }

    /**
     * 保留小数位
     * @param src 
     * @param pos 
     * @returns 
     */
    public static FomatFloat(src, pos) {
        return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
    }

    /**点在正方形内 */
    public static pointInSquare(p: Laya.Point, s: Laya.Point, b: number) {
        return (p.x >= s.x && p.x <= s.x + b && p.y >= s.y && p.y <= s.y + b);
    }

    public static GetCross(p1: Laya.Vector2, p2: Laya.Vector2, p: Laya.Vector2) {
        return (p2.x - p1.x) * (p.y - p1.y) - (p.x - p1.x) * (p2.y - p1.y);
    }

    /**
     * 点在矩形内
     * @param p1 
     * @param p2 
     * @param p3 
     * @param p4 
     * @param p 
     * @returns 
     */
    public static IsPointInMatrix(p1: Laya.Vector2, p2: Laya.Vector2, p3: Laya.Vector2, p4: Laya.Vector2, p: Laya.Vector2) {
        let isPointIn = Utils.GetCross(p1, p2, p) * Utils.GetCross(p3, p4, p) >= 0 && Utils.GetCross(p2, p3, p) * Utils.GetCross(p4, p1, p) >= 0;
        return isPointIn;
    }

    /**
     * 计算一个点是否在多边形里,参数:点,多边形数组
     * @param pt 
     * @param poly 
     * @returns 
     */
    public static PointInPoly(pt: Laya.Vector2, poly: Laya.Vector2[]) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
        return c;
    }

    /**获取两点之间的夹角 目标点在前*/
    public static GetAngle(x1: number, x2: number, y1: number, y2: number): number {
        return Math.atan2(y1 - y2, x1 - x2);
    }

    /**获取两点之间距离 */
    public static GetDistance(x1: number, x2: number, y1: number, y2: number): number {
        var xd: number = x2 - x1;
        var yd: number = y2 - y1;
        return Math.pow(xd * xd + yd * yd, 0.5);
    }

    /**获取两点之间距离的平方 */
    public static GetDistanceSquare(x1: number, x2: number, y1: number, y2: number): number {
        var xd: number = x2 - x1;
        var yd: number = y2 - y1;
        return xd * xd + yd * yd;
    }

    /**是否是微信小游戏环境 */
    public static get isWXMiniGame(): boolean {
        return Laya.Browser.onMiniGame;
    }

    /**获取当前时间 */
    public static get Now(): number {
        return Laya.Browser.now();
    }

    /**是否是IOS */
    static get isIOS(): boolean {
        return Laya.Browser.onIOS;
    }

    /**是否是安卓 */
    static get isAndroid(): boolean {
        return Laya.Browser.onAndroid;
    }

    /**对象拷贝 */
    public static InjectProp(target: Object, data: Object = null, callback: Function = null, ignoreNull: boolean = true): boolean {
        if (!data) {
            return false;
        }

        let result = true;
        for (let key in data) {
            let value: any = data[key];
            if (typeof value != 'function' && (!ignoreNull || value != null)) {
                if (callback) {
                    callback(target, key, value);
                } else {
                    target[key] = value;
                }
            }
        }
        return result;
    }

    /**
         * 获取一个随机整数
         * @param max
         * @param min
         * @returns {number}
         */
    public static MakeRandomInt(max: number, min: number = 0): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
         * 打乱一个数组
         * @param arr
         * @returns {any}
         */
    public static MixArray(arr: any): Array<any> {
        for (var i: number = 0, len: number = Math.round(arr.length / 2); i < len; i++) {
            var a: number = this.MakeRandomInt(arr.length);
            var b: number = this.MakeRandomInt(arr.length);
            var temp = arr[a];
            arr[a] = arr[b];
            arr[b] = temp;
        }

        return arr;
    }

    private static _filters: any = {};
    public static getFilter(r: number, g: number, b: number): Laya.ColorFilter {
        //00db81
        var key: number = r * 256 * 256 + g * 256 + b;
        if (Utils._filters[key]) {
            return Utils._filters[key];
        }
        else {
            var matrix =
                [
                    r / 255, 0, 0, 0, 0, //R
                    0, g / 255, 0, 0, 0, //G
                    0, 0, b / 255, 0, 0, //B
                    0, 0, 0, 1, 0, //A
                ];
            var filter: Laya.ColorFilter = new Laya.ColorFilter(matrix);
            Utils._filters[key] = filter;
            return filter;
        }
    }

    /**是否是今天 */
    public static isToday(time: number, now: number = 0): boolean {
        now = now ? now : Utils.Now;
        var t: Date = new Date(time);
        var n: Date = new Date(now);
        if (t.getFullYear() == n.getFullYear() && t.getMonth() == n.getMonth() && t.getDate() == n.getDate())
            return true;
        else
            return false;
    }

    public static FormatAngle(angle: number, isRadian: boolean = false): number {
        if (isRadian) {
            while (angle <= -Math.PI) {
                angle += Math.PI * 2;
            }
            while (angle > Math.PI) {
                angle -= Math.PI * 2;
            }
        }
        else {
            while (angle <= -180) {
                angle += 360;
            }
            while (angle > 180) {
                angle -= 360;
            }
        }

        return angle;
    }

    public static formatTime(time: number) {
        let m = Math.floor(time / 60);
        let s = time % 60;
        let str_m = m + "";
        let str_s = s + "";
        if (str_m.length < 2) str_m = "0" + str_m;
        if (str_s.length < 2) str_s = "0" + str_s;
        return str_m + ":" + str_s;
    }


    public static getMfh5Msg(url: string, appId: string, caller: any, callback: any) {
        var httpRequest = new Laya.HttpRequest();
        httpRequest.on(Laya.Event.COMPLETE, this, this.OnGetShareGroupComplete, [httpRequest, caller, callback]);
        httpRequest.on(Laya.Event.ERROR, this, this.OnGetShareGroupError, [httpRequest, caller, callback]);

        var obj: any = {
            appId,
        }
        var data: string = JSON.stringify(obj);

        httpRequest.send(url, data, "post", "text", ["Content-Type", "application/x-www-form-urlencoded"]);
    }

    private static OnGetShareGroupComplete(httpRequest: Laya.HttpRequest, caller: any, callback: any): void {
        httpRequest.offAll(Laya.Event.COMPLETE);
        httpRequest.offAll(Laya.Event.ERROR);
        if (caller && callback)
            callback.apply(caller, [{ code: 0, data: httpRequest.data }]);
    }

    private static OnGetShareGroupError(httpRequest: Laya.HttpRequest, caller: any, callback: any): void {
        httpRequest.offAll(Laya.Event.COMPLETE);
        httpRequest.offAll(Laya.Event.ERROR);
        if (caller && callback)
            callback.apply(caller, [{ code: 1 }]);
    }

}