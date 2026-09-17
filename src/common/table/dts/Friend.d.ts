
declare namespace shoot.data {
    
    export interface Friend {
        
        /** id */
        ID: number;

        /** 名字 */
        Name: number;

        /** 解锁条件,年级 */
        NeedLevel: number;

        /** 每次点击获得魅力值 */
        AddCharm: number;

        /** 约会间隔(分钟) */
        AppointmentTime: number;

    }

}
