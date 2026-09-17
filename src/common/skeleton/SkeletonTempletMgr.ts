

export class SkeletonTempletMgr {
    /**骨骼文件路径 */
    private filePath = "resources/sk/";
    constructor() {

    }

    private static _instance: SkeletonTempletMgr;
    public static get instance(): SkeletonTempletMgr {
        if (!SkeletonTempletMgr._instance) {
            SkeletonTempletMgr._instance = new SkeletonTempletMgr();
        }
        return SkeletonTempletMgr._instance;
    }

    /**3.x：Templet.loadAni 移除，统一走 loader 返回 Promise */
    public loadTemplet(name: string, complete?: Laya.Handler) {
        let path = this.filePath + name + ".sk";
        Laya.loader.load(path).then((templet: Laya.Templet) => {
            if (complete) {
                complete.runWith(templet);
                complete.recover();
            }
        }).catch((e) => {
            console.error("骨骼模板加载失败:", path, e);
        });
    }
}

export var skeletonTempletMgr = SkeletonTempletMgr.instance;
