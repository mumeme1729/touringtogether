import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from "../types";

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
    async (nickName: PROPS_NICKNAME) => {
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
    openSignIn: true,
    openSignUp: false,
    isLoadingAuth: false, //処理最中にtrue

    //ログインしている人のプロフィールを管理
    myprofile: {
      id: 0,
      nickName: "",
      userProfile: 0,
      created_on: "",
      img: "",
    },
    //プロフィールのリスト(全員)
    profiles: [
      {
        id: 0,
        nickName: "",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
        state.isLoadingAuth = true;
      },
      fetchCredEnd(state) {
        state.isLoadingAuth = false;
      },
      // ログイン用
      setOpenSignIn(state) {
        state.openSignIn = true;
      },
      resetOpenSignIn(state) {
        state.openSignIn = false;
      },
      //登録用
      setOpenSignUp(state) {
        state.openSignUp = true;
      },
      resetOpenSignUp(state) {
        state.openSignUp = false;
      },
     
      //ニックネームを編集するためのアクション
      editNickname(state, action) {
        state.myprofile.nickName = action.payload;
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
    fetchCredStart,
    fetchCredEnd,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    editNickname,
  } = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) =>state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;

export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;


export default authSlice.reducer;