
declare namespace shoot.data {
    
    export interface Coin {
        
        /** 序号 */
        level: number;

        /** 名字 */
        name: string;

        /** 升级所需钻石 */
        upD: number;

        /** 每秒产出金币 */
        coin: number;

        /** 说明 */
        info: string;

    }

}
