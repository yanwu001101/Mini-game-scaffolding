
declare namespace shoot.data {
    
    export interface Artillery {
        
        /** 序号 */
        level: number;

        /** 名字 */
        name: string;

        /** 升级所需金币 */
        upC: number;

        /** 升级所需钻石 */
        upD: number;

        /** 升级所需钻石花等级 */
        upDlevel: number;

        /** 攻击距离 */
        distances: number;

        /** 攻击 */
        atk: number;

        /** 拆除获得金币 */
        delCoin: number;

        /** 说明 */
        info: string;

    }

}
