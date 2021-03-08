import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME_TEXT,  PROPS_RELATION,PROPS_ALL_USER } from "../types";
import { number } from "yup/lib/locale";

//環境変数を読み込む
const apiUrl = process.env.REACT_APP_DEV_API_URL;


//フォロー
export const fetchAsyncAddFollowing = createAsyncThunk(
  "relationships/post",
  async (following: PROPS_RELATION) => {
    const res = await axios.post(`${apiUrl}api/relationship/`, following, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

//フォロー解除
export const fetchAsyncFollowingDelete =createAsyncThunk("relationships/delete",async (id:number) =>{
  await console.log(id)
  await axios.delete(`${apiUrl}api/relationship/${id}/`,{
      headers:{
          "Content-Type":"application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
      },
  });
  return id;
});

//フォロー中のユーザーを取得
export const fetchAsyncFollowing = createAsyncThunk("following/get", 
  async (following:string) => {
    const res = await axios.get(`${apiUrl}api/following/?userFollow=${following}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });
//フォロワーを取得
export const fetchAsyncFollower = createAsyncThunk("follower/get", 
  async (following:string) => {
    const res = await axios.get(`${apiUrl}api/follower/?following=${following}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

export const RelationshipSlice = createSlice({
  name: 'relationship',
  initialState:{
    openRelatinDetail:false,//フォロー関係モーダルのオンオフ
    openFollowing:false,
    openFollower:false,
    //プロフィールのリスト(全員)

    //新しいフォロー関係
    newRelationsip:{
      id:0,
      userFollow:0,
      following:0,
    },
    following:[
      {
        id:0,
        userFollow:0,
        following:0,
      },
    ],
    follower:[
      {
        id:0,
        userFollow:0,
        following:0,
      }
    ],
  },
  reducers: {
      
      //フォロー関係のオンオフ
      setOpenRelationshipDetail(state){
        state.openRelatinDetail=true;
      },
      resetOpenRelationshipDetail(state){
        state.openRelatinDetail=false;
      },
      //フォロー
      setOpenFollowing(state){
        state.openFollowing=true;
      },
      resetOpenFollowing(state){
        state.openFollowing=false;
      },
      setOpenFollower(state){
        state.openFollower=true;
      },
      resetOpenFollower(state){
        state.openFollower=false;
      },
      addRelation(state,action){
        state.newRelationsip=action.payload;
      }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchAsyncAddFollowing.fulfilled,(state,action)=>{
      return{
        ...state,
        follower:[action.payload,...state.follower]
      }
  });
   
    builder.addCase(fetchAsyncFollowing.fulfilled,(state,action)=>{
      state.following = action.payload;
    });
    builder.addCase(fetchAsyncFollower.fulfilled,(state,action)=>{
      state.follower=action.payload;
  });
    builder.addCase(fetchAsyncFollowingDelete.fulfilled,(state,action)=>{
        return{
          ...state,
          follower:state.follower.filter((t)=>t.id!==action.payload),
          // newRelationsip:{id:0,userFollow:0,following:0,},
        };
    });
    
      
  },
});

export const {
    setOpenRelationshipDetail,
    resetOpenRelationshipDetail,
    setOpenFollowing,
    resetOpenFollowing,
    setOpenFollower,
    resetOpenFollower,
    addRelation,
  } = RelationshipSlice.actions;


export const selectOpenRelationshipDetail=(state:RootState)=>state.relationship.openRelatinDetail;
export const selectOpenFollowing=(state:RootState)=>state.relationship.openFollowing;
export const selectOpenFollower=(state:RootState)=>state.relationship.openFollower;
export const selectAddRelationship=(state:RootState)=>state.relationship.newRelationsip;

export const selectFollowing=(state:RootState)=>state.relationship.following;
export const selectFollower=(state:RootState)=>state.relationship.follower

export default RelationshipSlice.reducer;