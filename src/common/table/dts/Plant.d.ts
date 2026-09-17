
declare namespace shoot.data {
    
    export interface Plant {
        
        /** 序号 */
        level: number;

        /** 名字 */
        name: string;

        /** 下一级升级所需金币 */
        upC: number;

        /** 下一级升级所需钻石 */
        upD: number;

        /** 下一级升级所需门的等级 */
        upM: number;

        /** 每秒产出金币 */
        coins: number;

        /** 说明 */
        info: string;

    }

}
