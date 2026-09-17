
declare namespace shoot.data {
    
    export interface Exam {
        
        /** 关卡 */
        Level: number;

        /** 名称 */
        Name: number;

        /** 题量 */
        Num: number;

        /** 学识奖励 */
        Reward: number;

        /** 首胜学识奖励 */
        WinReward: number;

        /** 解锁系统 */
        Unlock: string;

    }

}
