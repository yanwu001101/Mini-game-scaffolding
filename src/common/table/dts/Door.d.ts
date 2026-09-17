
declare namespace shoot.data {
    
    export interface Door {
        
        /** 序号 */
        level: number;

        /** 名字 */
        name: string;

        /** 升级所需金币 */
        upC: number;

        /** 升级所需钻石 */
        upD: number;

        /** 生命 */
        HP: number;

        /** 说明 */
        info: string;

    }

}
