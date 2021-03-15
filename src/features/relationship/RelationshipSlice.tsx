import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { PROPS_RELATION,RELATION} from "../types";

//環境変数を読み込む
const apiUrl = process.env.REACT_APP_DEV_API_URL;


//新しくフォロー
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

//フォロー解除時のidを返す
export const fetchAsyncGetRelationId =createAsyncThunk("relationshipid/delete",async (relation:RELATION) =>{
  const res=await axios.get(`${apiUrl}api/relation/`,{
      headers:{
          "Content-Type":"application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        userFollow:`${relation.userFollow}`,
        following:`${relation.following}`
      },
  });
  return res.data[0];
});

//デリーーーと
export const fetchAsyncFollowingDelete =createAsyncThunk("relationships/delete",async (id:number) =>{
  await axios.delete(`${apiUrl}api/relationship/${id}/`,{
      headers:{
          "Content-Type":"application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
      },
  });
  return id;
});


//フォロー・フォロワーのプロフィール
export const fetchAsyncGetFollowingProfile = createAsyncThunk("followingprofile/get", 
  async (id:string) => {
    const res = await axios.get(`${apiUrl}api/following_profile/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
      },
    });
    return res.data;
  });

  export const fetchAsyncGetFollowerProfile = createAsyncThunk("followerprofile/get", 
  async (id:string) => {
    const res = await axios.get(`${apiUrl}api/follower_profile/`,{
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
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
    
    //新しいフォロー関係
    newRelationsip:{
      id:0,
      userFollow:0,
      following:0,
    },
    //フォロー解除用id
    deleteid:{
      id:0,
      userFollow:0,
      following:0,
    },
   
    follower:[
      {
        id:0,
        userFollow:0,
        following:0,
      }
    ],
    //各ユーザーのフォロー・フォロワープロフィールリスト
    followingprofile:[
      {
        id: 0,
        nickName: "",
        text:"",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    ],
    followerprofile:[
      {
        id: 0,
        nickName: "",
        text:"",
        userProfile: 0,
        created_on: "",
        img: "",
      },
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
      },
      //ロード
      setfollowerprofile(state,action){
        return{
          ...state,
          followerprofile: [ action.payload,...state.followerprofile],
        }
      },
      resetfollowerprofile(state,action){
        state.followerprofile.filter((t)=>t.userProfile!==action.payload.userProfile)
      },
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchAsyncAddFollowing.fulfilled,(state,action)=>{
      return{
        ...state,
        follower:[action.payload,...state.follower]
      }
  });
   
    builder.addCase(fetchAsyncGetFollowingProfile.fulfilled,(state,action)=>{
      state.followingprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetFollowerProfile.fulfilled,(state,action)=>{
      state.followerprofile=action.payload;
    })
    builder.addCase(fetchAsyncGetRelationId.fulfilled,(state,action)=>{
      state.deleteid=action.payload;
    })

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
    setfollowerprofile,
    resetfollowerprofile,
  } = RelationshipSlice.actions;


export const selectOpenRelationshipDetail=(state:RootState)=>state.relationship.openRelatinDetail;
export const selectOpenFollowing=(state:RootState)=>state.relationship.openFollowing;
export const selectOpenFollower=(state:RootState)=>state.relationship.openFollower;
export const selectAddRelationship=(state:RootState)=>state.relationship.newRelationsip;

export const selectFollower=(state:RootState)=>state.relationship.follower

export const selectFollowingProfile=(state:RootState)=>state.relationship.followingprofile;
export const selectFollowerProfile=(state:RootState)=>state.relationship.followerprofile;


export const selectDeleteId=(state:RootState)=>state.relationship.deleteid;

export default RelationshipSlice.reducer;