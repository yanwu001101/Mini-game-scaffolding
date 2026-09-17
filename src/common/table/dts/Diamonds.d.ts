
declare namespace shoot.data {
    
    export interface Diamonds {
        
        /** 序号 */
        level: number;

        /** 名字 */
        name: string;

        /** 升级所需金币 */
        upC: number;

        /** 每秒产出钻石 */
        diamonds: number;

        /** 拆除获得金币 */
        delCoin: any;

        /** 说明 */
        info: string;

    }

}
