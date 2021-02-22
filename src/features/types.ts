export interface PROPS_AUTHEN {
    email: string;
    password: string;
  }

export interface PROPS_PROFILE {
    id: number;
    nickName: string;
    img: File | null;
}

export interface PROPS_NICKNAME {
    nickName: string;
}

export interface PROPS_ALL_USER{
    id: number;
    nickName: string;
    text:string;
    userProfile: number;
    created_on: string;
    img: string;
}



