
declare namespace shoot.data {
    
    export interface Airplane {
        
        /** 序号 */
        ID: number;

        /** 名字 */
        Name: string;

        /** 类别 */
        Category: string;

        /** 推力(KN) */
        Push: number;

        /** 速度（KM/H） */
        Speed: number;

        /** 机动性(°/S) */
        Maneuverability: number;

        /** 制动（KN） */
        Braking: number;

        /** 金币兑换量 */
        Price: number;

        /** 广告兑换量 */
        Advertising: number;

        /** 速度（M/S） */
        Speed2: number;

        /** 空气阻力系数 */
        AirFriction: number;

        /** 空重（KG） */
        AirWeight: number;

        /** 推重比 */
         ThrustWeightRatio: number;

    }

}
