
declare namespace shoot.data {
    
    export interface Const {
        
        /** 常量表id */
        id: string;

        /** 常量值 */
        value: any;

        /** 备注 */
        dialog: string;

    }

}

declare namespace sConst {
    
    /** undefined */
    export const BaseSpeed: shoot.data.Const;

    /** undefined */
    export const RapidSpeed: shoot.data.Const;

    /** undefined */
    export const skillAtkDis: shoot.data.Const;

    /** undefined */
    export const AtkDis1004: shoot.data.Const;

    /** undefined */
    export const skill2002Dis: shoot.data.Const;

    /** undefined */
    export const skill2004Dis: shoot.data.Const;

    /** undefined */
    export const VideoCoin: shoot.data.Const;

    /** undefined */
    export const VideoPower: shoot.data.Const;

    /** undefined */
    export const StartTreasure: shoot.data.Const;

    /** undefined */
    export const StartSkill: shoot.data.Const;

}
