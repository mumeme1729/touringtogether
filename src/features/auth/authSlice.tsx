import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME_TEXT,} from "../types";
import { number } from "yup/lib/locale";

//環境変数を読み込む
const apiUrl = process.env.REACT_APP_DEV_API_URL;

//新規ユーザ登録
export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    }
  );
//ログイン
export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    //コンポーネント側から(メアドとパスワード)をもらう
    async (authen: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
      //取得に成功したらローカルに保存
    }
  );

  //プロフィールの作成
  export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    async (nickName: PROPS_NICKNAME_TEXT) => {
      const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
  );
 //アップデート
  export const fetchAsyncUpdateProf = createAsyncThunk(
    "profile/put",
    async (profile: PROPS_PROFILE) => {
      const uploadData = new FormData();
      uploadData.append("nickName", profile.nickName);
      uploadData.append("text", profile.text);
      profile.img && uploadData.append("img", profile.img, profile.img.name);
      const res = await axios.put(
        `${apiUrl}api/profile/${profile.id}/`,
        uploadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    }
  );
  //自分のプロフィールを取得
  export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
    const res = await axios.get(`${apiUrl}api/myprofile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
    //filterを使うと配列で返ってくるため
  });

  //目的のプロフィールを取得
  export const fetchAsyncSelectProfile = createAsyncThunk("selectprofile/get", 
  async (id:string) => {
    const res = await axios.get(`${apiUrl}api/selectprofile/?userProfile=${id}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  });


  //すべてのプロフィール
  export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
    const res = await axios.get(`${apiUrl}api/profile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });


export const authSlice = createSlice({
  name: 'auth',
  initialState:{
    openSignInModal: true,
    openSignUpModal: false,
    failedSignIn: false,//ログインの成功・失敗
    openEditProfile:false,
    //ログインしている人のプロフィールを管理
    myprofile: {
      id: 0,
      nickName: "",
      text:"",
      userProfile: 0,
      created_on: "",
      img: "",
    },

    profiles: [
      {
        id: 0,
        nickName: "",
        text:"",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    ],
    //選択するユーザー
    selectedProfile:{
      id: 0,
      nickName: "",
      text:"",
      userProfile: 0,
      created_on: "",
      img: "",
    },
  },
  reducers: {
      // ログイン用
      setOpenSignIn(state) {
        state.openSignInModal = true;
      },
      resetOpenSignIn(state) {
        state.openSignInModal = false;
      },
      //ログイン失敗
      setFailedSignIn(state){
        state.failedSignIn=true;
      },
      resetFailedSignIn(state){
        state.failedSignIn=false;
      },

      //登録用
      setOpenSignUp(state) {
        state.openSignUpModal = true;
      },
      resetOpenSignUp(state) {
        state.openSignUpModal = false;
      },
     
      //ニックネームを編集するためのアクション
      editNickname(state, action) {
        state.myprofile.nickName = action.payload;
      },
      //紹介文の編集
      editProfileText(state,action){
        state.myprofile.text=action.payload;
      },
      
      //プロフィール編集画面のオンオフ
      setOpenEditProfile(state){
        state.openEditProfile=true;
      },
      resetOpenEditProfile(state){
        state.openEditProfile=false;
      },
      
  },
  extraReducers:(builder)=>{
    //ログインが成功したらjwtをローカルに保存
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
        localStorage.setItem("localJWT", action.payload.access);
      });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
        state.myprofile = action.payload;//(returnが返ってくる)
      });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
        state.myprofile = action.payload;
      });
    builder.addCase(fetchAsyncSelectProfile.fulfilled,(state,action)=>{
      state.selectedProfile=action.payload;
    });

    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });

    
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
        state.myprofile = action.payload;
        state.profiles = state.profiles.map((prof) =>
          prof.id === action.payload.id ? action.payload : prof
        );
      });      
  },
});

export const {
    setOpenSignIn,
    resetOpenSignIn,
    setFailedSignIn,
    resetFailedSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    editNickname,
    setOpenEditProfile,
    resetOpenEditProfile,
    editProfileText,
  } = authSlice.actions;

export const selectOpenSignIn = (state: RootState) => state.auth.openSignInModal;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUpModal;
export const selectFailedSignIn=(state:RootState) =>state.auth.failedSignIn;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;
export const selectSelectedProfile=(state:RootState)=>state.auth.selectedProfile;
export const selectOpenEditProfile =(state:RootState)=>state.auth.openEditProfile;

export default authSlice.reducer;