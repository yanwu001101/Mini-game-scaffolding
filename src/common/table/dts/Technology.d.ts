
declare namespace shoot.data {
    
    export interface Technology {
        
        /** 序号 */
        id: number;

        /** 名字 */
        name: string;

        /** 下一级升级所需金币 */
        upC: number;

        /** 下一级升级所需钻石 */
        upD: number;

        /** 参数 */
        para: number;

        /** 说明 */
        info: string;

    }

}
