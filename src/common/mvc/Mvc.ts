export default class Mvc {
	public static MINI_ONSHOW = "MINI_ONSHOW";
	public static MINI_ONHIDE = "MINI_ONHIDE";
	/**原生广告刷新 */
	public static NATIVE_AD_REFRESH = "NATIVE_AD_REFRESH";
	/**vivo 原生icon关闭 */
	public static NATIVEICON_AD_CLOSE = "NATIVEICON_AD_CLOSE";

	/**华为登录成功 */
	public static HWSDKinitsuccess = "HWSDKinitsuccess";
	public static HWSDKinitfail = "HWSDKinitfail";

	/**
	   * 发布一个事件，会同时响应：所有MVC.on监听的事件
	   * 自定义的函数响应，使用on注册，使用off关闭
	   * @param eventName 事件名
	   * @param params 事件参数
	   * @param type 兼容已有的mvc参数，将自动合并到params中，命名为mvctype，非移植项目不需要
	   */
	public static Send(eventName: string, params: any = null, type?: string): void {
		if (type === undefined) {
			params ? eventDispatcher.event(eventName, params) : eventDispatcher.event(eventName);
		} else {
			params ? (params.mvctype = type) : (params = { mvctype: type });
			eventDispatcher.event(eventName, params);
		}
	}
	public static HasListener(type: string): boolean {
		return eventDispatcher.hasListener(type)
	}
	public static DumpEvent() {
		console.log(Object.getOwnPropertyNames(eventDispatcher))
	}
	public static On(eventName: string, thisObj: any, callback: Function, args?: Array<any>): void {
		if (args) {
			eventDispatcher.on(eventName, thisObj, callback, args);
		} else {
			eventDispatcher.on(eventName, thisObj, callback);
		}
	}

	public static Off(eventName: string, thisObj: any, callback: Function): void {
		eventDispatcher.off(eventName, thisObj, callback);
	}
	public static OffAll(type?: string): void {
		eventDispatcher.offAll(type);
	}

}

const eventDispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();
