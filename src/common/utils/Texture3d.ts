
/**
 * 3d刷贴图工具
 */
export class Texture3d {
    private static _instance: Texture3d;
    public static get Instance(): Texture3d {
        if (!Texture3d._instance) {
            Texture3d._instance = new Texture3d();
        }
        return Texture3d._instance;
    }

    private m_camera: Laya.Camera;
    private m_data: Array<{ sprite: Laya.MeshSprite3D, oldTexPath: string, newTexPath: string }>;
    private m_possList;
    private m_IndicesList;
    private m_uvsList;
    private m_oldPixel: Array<Uint8Array | Uint16Array | Float32Array>;
    private m_newPixel: Array<Uint8Array | Uint16Array | Float32Array>;
    private m_clearPixel: Uint8Array | Uint16Array | Float32Array;
    private m_clearW: number;
    private m_clearH: number;
    private m_maxNum: number;
    private m_clearNum: number;

    private m_targetSprite3D: Laya.MeshSprite3D;
    private m_ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());

    private m_indexArray: Array<number> = [];
    private m_checkPoint: Array<number> = [];

    private m_oldTexLoadIndex = 0;
    private m_newTexLoadIndex = 0;

    private m_isLoadEnd = false;

    /**
     * 设置初始化数据 图片分辨率不要超512*512
     * @param camera 摄像机
     * @param dataList 要刷Texture的精灵数组，oldTexPath初始贴图路径，newTexPath刷后的贴图路径
     */
    public setData(camera: Laya.Camera, dataList: Array<{ sprite: Laya.MeshSprite3D, oldTexPath: string, newTexPath: string }>) {
        this.clearData();
        this.m_camera = camera;
        this.m_data = dataList;
        this.m_clearNum = 0;
        this.m_maxNum = 0;
        for (let i = 0; i < this.m_data.length; i++) {
            let data = this.m_data[i];
            let poss = [];
            data.sprite.meshFilter.sharedMesh.getPositions(poss);
            this.m_possList.push(poss);

            let indices = this.m_data[i].sprite.meshFilter.sharedMesh.getIndices();
            this.m_IndicesList.push(indices);

            let uvs = [];
            data.sprite.meshFilter.sharedMesh.getUVs(uvs);
            this.m_uvsList.push(uvs);

            Laya.loader.fetch(data.oldTexPath, "TEXTURE2D" as any).then((texture: Laya.Texture2D) => {
                let mater = new Laya.BlinnPhongMaterial();
                mater.albedoTexture = texture;
                data.sprite.meshRenderer.material = mater;

                this.m_oldPixel[i] = texture.getPixels();
                this.m_oldTexLoadIndex++;
                this.m_maxNum += this.m_oldPixel[i].length / 4;
            });

            // Laya.Texture2D.load(data.oldTexPath, Laya.Handler.create(this, (texture: Laya.Texture2D) => {
            //     let mater = new Laya.BlinnPhongMaterial();
            //     mater.albedoTexture = texture;
            //     data.sprite.meshRenderer.material = mater;

            //     this.m_oldPixel[i] = texture.getPixels();
            //     this.m_oldTexLoadIndex++;
            //     this.m_maxNum += this.m_oldPixel[i].length / 4;
            // }));

            Laya.loader.fetch(data.newTexPath, "TEXTURE2D" as any).then((texture: Laya.Texture2D) => {
                this.m_newPixel[i] = texture.getPixels();
                this.m_newTexLoadIndex++;
            });
        }
    }

    /**
     * 
     * @param path 
     */
    public setClearPath(path: string) {
        Laya.loader.fetch(path, "TEXTURE2D" as any).then((tex: Laya.Texture2D) => {
            this.m_clearPixel = tex.getPixels();
            this.m_clearW = tex.width;
            this.m_clearH = tex.height;
        });
    }

    /**清除数据，退出游戏场景必须调用，否则下次开始游戏开始会出错 */
    public clearData() {
        this.m_data = null;
        this.m_possList = [];
        this.m_IndicesList = [];
        this.m_uvsList = [];
        this.m_oldPixel = [];
        this.m_newPixel = [];
        this.m_oldTexLoadIndex = 0;
        this.m_newTexLoadIndex = 0;
        this.m_isLoadEnd = false;

        this.m_clearPixel = null;
        this.m_clearW = 0;
        this.m_clearH = 0;
        this.m_clearNum = 0;
    }

    /**判断刷图 */
    public screenPoint(x: number, y: number) {
        if (!this.loadEnd()) {
            console.log("Texture3d 资源未加载");
            return;
        }
        let pointPos = null;
        this.m_camera.viewportPointToRay(new Laya.Vector2(x, y), this.m_ray);
        for (let j = 0; j < this.m_data.length; j++) {
            this.m_targetSprite3D = this.m_data[j].sprite;
            let poss = this.m_possList[j];
            let data = this.m_IndicesList[j];
            let uvs = this.m_uvsList[j];
            let v0 = new Laya.Vector3();
            let v1 = new Laya.Vector3();
            let v2 = new Laya.Vector3();
            this.m_indexArray = [];
            this.m_checkPoint = [];
            for (let i = 0; i < data.length; i += 3) {
                Laya.Vector3.add(this.TransformQuat(poss[data[i]], this.m_targetSprite3D.transform.rotation), this.m_targetSprite3D.transform.position, v0);
                Laya.Vector3.add(this.TransformQuat(poss[data[i + 1]], this.m_targetSprite3D.transform.rotation), this.m_targetSprite3D.transform.position, v1);
                Laya.Vector3.add(this.TransformQuat(poss[data[i + 2]], this.m_targetSprite3D.transform.rotation), this.m_targetSprite3D.transform.position, v2);
                let d = this.IsRayIntersectTriangle(this.m_ray.origin, this.m_ray.direction, v0, v1, v2);
                if (d >= 0) {
                    this.m_indexArray.push(i);
                    this.m_checkPoint.push(d);
                }
            }

            if (this.m_indexArray.length == 0)
                continue;
            let minT = 99999;
            let index = -1;
            for (let i = 0; i < this.m_checkPoint.length; i++) {
                if (this.m_checkPoint[i] < minT) {
                    minT = this.m_checkPoint[i];
                    index = this.m_indexArray[i];
                }
            }

            // console.log("碰撞网格索引:", index);
            //碰撞的点
            pointPos = this.v3Add(this.m_ray.origin, this.v3Mul(this.m_ray.direction, minT));
            // console.log("碰撞的点:", pointPos);
            let invert = new Laya.Quaternion();
            this.m_targetSprite3D.transform.rotation.invert(invert);
            let c0 = poss[data[index]];
            let c1 = poss[data[index + 1]];
            let c2 = poss[data[index + 2]];
            let childPos = this.TransformQuat(this.v3Sub(pointPos, this.m_targetSprite3D.transform.position), invert);
            let s0 = this.v3Sub(c1, c0);
            let s1 = this.v3Sub(c2, c0);
            let angle = this.getV3AngleIsPositive(s0, s1);
            let angle2 = this.getV3AngleIsPositive(this.v3Sub(c1, c0), this.v3Sub(childPos, c0));
            let distance = Laya.Vector3.distance(childPos, poss[data[index]]) / Laya.Vector3.distance(poss[data[index + 1]], poss[data[index]]);
            let u0 = uvs[data[index]];
            let u1 = uvs[data[index + 1]];
            // let u2 = uvs[data[index + 2]];
            if (angle2 > angle) {
                angle2 = angle;
            }
            let newVec2 = this.getPointByRadian(u1.x - u0.x, u1.y - u0.y, angle2);
            newVec2 = this.v2Mul(newVec2, distance);
            newVec2 = this.v2Add(u0, newVec2);
            let res = (this.m_targetSprite3D.meshRenderer.material as Laya.BlinnPhongMaterial).albedoTexture as Laya.Texture2D;
            let array1 = res.getPixels();

            let pixeIUVx = newVec2.x;
            let pixeIUVy = newVec2.y;
            pixeIUVx *= res.width;
            pixeIUVy *= res.height;
            pixeIUVx = Math.floor(pixeIUVx);
            pixeIUVy = Math.floor(pixeIUVy);

            let array2 = this.m_newPixel[j];
            // console.log("2d纹理坐标:", pixeIUVx, pixeIUVy);
            for (let i = -this.m_clearW / 2; i < this.m_clearW / 2; i++) {
                for (let j = -this.m_clearH / 2; j < this.m_clearH / 2; j++) {
                    let c = i + this.m_clearW / 2 + (j + this.m_clearH / 2) * this.m_clearW;
                    let cc = this.m_clearPixel[c * 4 + 3];
                    if (cc != 0) {
                        let e = pixeIUVx + i + (pixeIUVy + j) * res.width;
                        array1[e * 4] = array2[e * 4];
                        array1[e * 4 + 1] = array2[e * 4 + 1];
                        array1[e * 4 + 2] = array2[e * 4 + 2];

                        if (array1[e * 4 + 3] != 254) {
                            this.m_clearNum++;
                        }
                        array1[e * 4 + 3] = 254;
                    }
                }
            }
            res.setPixelsData(array1, false, false);
        }
        return pointPos;
    }

    /**获取替换比例 */
    public getClearRate() {
        return this.m_clearNum / this.m_maxNum;
    }

    private loadEnd() {
        if (this.m_isLoadEnd) return this.m_isLoadEnd;
        if (!this.m_data) return false;
        this.m_isLoadEnd = this.m_oldTexLoadIndex >= this.m_data.length && this.m_newTexLoadIndex >= this.m_data.length ? true : false;
        return this.m_isLoadEnd;
    }


    /**三维差 */
    private v3Sub(v0: Laya.Vector3, v1: Laya.Vector3) {
        let vec3 = new Laya.Vector3();
        Laya.Vector3.subtract(v0, v1, vec3);
        return vec3;
    }
    /**三维加 */
    private v3Add(v0: Laya.Vector3, v1: Laya.Vector3) {
        let vec3 = new Laya.Vector3();
        Laya.Vector3.add(v0, v1, vec3);
        return vec3;
    }

    /**三维乘 */
    private v3Mul(v0: Laya.Vector3, s: number) {
        let vec3 = new Laya.Vector3();
        Laya.Vector3.scale(v0, s, vec3);
        return vec3;
    }

    /**二维乘 */
    private v2Mul(v0: Laya.Vector2, s: number) {
        let vec2 = new Laya.Vector2();
        Laya.Vector2.scale(v0, s, vec2);
        return vec2;
    }
    /**二维加 */
    private v2Add(v0: Laya.Vector2, v1: Laya.Vector2) {
        let vec2 = new Laya.Vector2();
        vec2.x = v0.x + v1.x;
        vec2.y = v0.y + v1.y;
        return vec2;
    }

    private v3(x?: number, y?: number, z?: number) {
        return new Laya.Vector3(x, y, z);
    }


    /** 三角面碰撞算法（Möller–Trumbore），返回沿射线的距离 t，无交返回 -1 */
    private IsRayIntersectTriangle(orig: Laya.Vector3, dir: Laya.Vector3, v0: Laya.Vector3, v1: Laya.Vector3, v2: Laya.Vector3): number {
        let t = -1;
        let u = -1;
        let v = -1;
        let E1 = this.v3Sub(v1, v0);
        let E2 = this.v3Sub(v2, v0);
        let P = new Laya.Vector3(0, 0, 0);//fl.v3(0, 0, 0);
        Laya.Vector3.cross(dir, E2, P);
        let det = Laya.Vector3.dot(E1, P);
        let T = new Laya.Vector3(0, 0, 0);//fl.v3(0, 0, 0);
        if (det > 0) {
            T = this.v3Sub(orig, v0);
        } else {
            T = this.v3Sub(v0, orig);
            det = -det;
        }

        let espX = 0.00001;
        if (det < espX)
            return -1;
        u = Laya.Vector3.dot(T, P);
        if (u < -espX || u > det)
            return -1;
        let Q = new Laya.Vector3(0, 0, 0);//fl.v3(0, 0, 0);
        Laya.Vector3.cross(T, E1, Q);
        v = Laya.Vector3.dot(dir, Q);
        if (v < -espX || u + v > det + espX)
            return -1;
        t = Laya.Vector3.dot(E2, Q);
        let fInvDet = 1.0 / det;
        t *= fInvDet;
        u *= fInvDet;
        v *= fInvDet;
        return t >= 0 ? t : -1;
    }

    /**夹角计算 */
    private getV3AngleIsPositive(up: Laya.Vector3, startUp: Laya.Vector3, startForward = this.v3(), isPositive: boolean = true): number {
        Laya.Vector3.normalize(up, up);
        Laya.Vector3.normalize(startUp, startUp);
        let angle = Math.acos(Laya.Vector3.dot(up, startUp)) * (180 / Math.PI);
        if (startForward != this.v3()) {
            let dotValue = Laya.Vector3.dot(up, startForward);
            if (isPositive) {
                angle = dotValue >= 0 ? angle : 360 - angle;
            }
            else {
                angle = dotValue >= 0 ? angle : -angle;
            }
        }
        if (Number.isNaN(angle)) angle = 0;
        return angle;
    }
    /**uv旋转 */
    private getPointByRadian(x: number, y: number, angle: number): Laya.Vector2 {
        let newPoint: Laya.Vector2 = new Laya.Vector2();
        let radian: number = Laya.Utils.toRadian(angle);
        newPoint.x = x * Math.cos(radian) - y * Math.sin(radian);
        newPoint.y = x * Math.sin(radian) + y * Math.cos(radian);
        return newPoint;
    }

    /**向量旋转 */
    private TransformQuat(source: Laya.Vector3, rotation: Laya.Quaternion) {
        let x = source.x;
        let y = source.y;
        let z = source.z;
        let qx = rotation.x;
        let qy = rotation.y;
        let qz = rotation.z;
        let qw = rotation.w;

        let ix = qw * x + qy * z - qz * y;
        let iy = qw * y + qz * x - qx * z;
        let iz = qw * z + qx * y - qy * x;
        let iw = -qx * x - qy * y - qz * z;

        return new Laya.Vector3(ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx);
    }
}