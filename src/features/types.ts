import { string } from "yup/lib/locale"

export interface PROPS_AUTHEN {
    email: string;
    password: string;
  }

  //img:File | null
export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    text:string;
    //img:File | null
}

export interface PROPS_NICKNAME_TEXT {
    nickName: string;
    text:string;
}

export interface PROPS_ALL_USER{
    id: number;
    nickName: string;
    text:string;
    userProfile: number;
    created_on: string;
    img: string;
}

export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
    
  }

export interface PROPS_RELATION{
    id:number;
    userFollow:number,
    following:number,
}

export interface RELATION{
    userFollow:number,
    following:string,
}
// プラン
export interface PROPS_PLAN{
    destination:string,
    date:string,
    text:string,
    profile: {
        id: number,
        nickName: string,
        text: string,
        userProfile: number,
        created_on: string,
        img: string,
    }

}
export interface USERPROFILE{
    userProfile:string;
}

export interface PROPS_PLANS{
    id:number,
    destination:string,
    date:string,
    userPlan:number,
    created_on:string,
    text:string,
}

export interface PROPS_PLANPROFILE{
    id:number,
    destination:string,
    date:string,
    userPlan:number,
    created_on:string,
    text:string,
    profile: {
        id: number,
        nickName: string,
        text: string,
        userProfile: number,
        created_on: string,
        img: string,
    }
}

export interface PROPS_SEARCH_PLAN{
    destination:string,
    date:string,
}

export interface PROPS_COMMENT {
    text: string;
    plan: number;
    profile: {
        id: number,
        nickName: string,
        text: string,
        userProfile: number,
        created_on: string,
        img: string,
    }
  }
export interface COMMENT{
    id: number;
    text: string;
    userComment: number;
    plan: number;
}

export interface COMMENT_PROFILE{
    id: number;
    text: string;
    userComment: number;
    plan: number;
    profile: {
        id: number,
        nickName: string,
        text: string,
        userProfile: number,
        created_on: string,
        img: string,
    }
}

//プロフィール画像
export interface PROFILE_IMAGE{
    id:number;
    nickName: string;
    text:string;
    img:File | null;
    name:string;
}