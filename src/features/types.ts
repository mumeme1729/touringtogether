export interface PROPS_AUTHEN {
    email: string;
    password: string;
  }

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    text:string;
    img: File | null;
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

