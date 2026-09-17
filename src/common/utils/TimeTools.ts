export class TimeTools {
    /**
     * 判断两个时间是不是同一天
     * @param time1
     * @param time2 
     */
    static isSameDay(time1: number, time2: number): boolean {
        var d = new Date(time1);
        d.setHours(0, 0, 0, 0);
        var zore1 = d.getTime();
        d.setTime(time2);
        d.setHours(0, 0, 0, 0);
        if (zore1 == d.getTime()) return true;
        return false;
    }

    /**获取当前的本机时间 */
    static getCrtTime(): number {
        let d = new Date();
        return d.getTime();
    }


    /**
     * 格式化时间
     * @param time 时间（秒）
     * @param style auto当时间不到h时，不出现h这段。h:m:s，不管是不是大于0都存在这个
     */
    static format(time: number, style: "auto" | "h:m:s" = "auto"): string {
        var s = time % 60;
        time = Math.floor(time / 60);
        var m = time % 60;
        var h = Math.floor(time / 60);
        if (style == "h:m:s") {
            return this.fullNumLen(h) + ":" + this.fullNumLen(m) + ":" + this.fullNumLen(s);
        }
        return (h > 0 ? (this.fullNumLen(h) + ":") : "") + this.fullNumLen(m) + ":" + this.fullNumLen(s);
    }

    static fullNumLen(num: number, len: number = 2): string {
        var numStr = num.toString();
        while (numStr.length < len) {
            numStr = "0" + numStr;
        }
        return numStr;
    }
}