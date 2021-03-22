import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_PLAN,PROPS_COMMENT,PROPS_SEARCH_PLAN} from "../types";


const apiUrl = process.env.REACT_APP_DEV_API_URL;

  //ユーザーごとの全プラン
  export const fetchAsyncGetUserPlan = createAsyncThunk("userplan/get", async (id:string) => {
    const res = await axios.get(`${apiUrl}api/userplan/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
      },
    });
    return res.data;
  });

  //コメントしたプラン
  export const fetchAsyncCommentPlan = createAsyncThunk("commentplan/get", async (id:string) => {
    const res = await axios.get(`${apiUrl}api/commentplan/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
      },
    });
    return res.data;
  });

  


export const userSlice =createSlice({
    name:"plan",
    initialState:{
        openNewPlan:false,
        isLoadingPlan:false,
        isOpenUserPlan:true,
        isOpenImageTrimming:false,
      userPlan:[
        {
          id:0,
          title:"",
          prefecture:"",
          destination:"",
          departure:"",
          date:"",
          userPlan:0,
          created_on:"",
          text:"",
          img:"",
        },
      ],
      commnetplan:[
        {
          id:0,
          title:"",
          prefecture:"",
          destination:"",
          departure:"",
          date:"",
          userPlan:0,
          created_on:"",
          text:"",
          img:"",
            profile: {
              id: 0,
              nickName: "",
              text: "",
              userProfile: 0,
              created_on: "",
              img: "",
              base:"",
            }
        },
    ],
    },
    reducers:{
      setCommentPlan(state){
        state.isOpenUserPlan=true;
      },
      resetCommentPlan(state){
        state.isOpenUserPlan=false;
      },
      setOpenImageTrimming(state){
        state.isOpenImageTrimming=true;
      },
      resetOpenImageTrimming(state){
        state.isOpenImageTrimming=false;
      }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncGetUserPlan.fulfilled,(state,action)=>{
          state.userPlan=action.payload;
        });
        builder.addCase(fetchAsyncCommentPlan.fulfilled,(state,action)=>{
          state.commnetplan=action.payload;
        });
    },

});

export const{
  setCommentPlan,
  resetCommentPlan,
  setOpenImageTrimming,
  resetOpenImageTrimming,
}=userSlice.actions


export const selectUserPlan=(state:RootState)=>state.user.userPlan;
export const selectIsOpenUserPlan=(state:RootState)=>state.user.isOpenUserPlan;
export const selectCommentPlan=(state:RootState)=>state.user.commnetplan;
export const selectIsOpenImageTrimming=(state:RootState)=>state.user.isOpenImageTrimming;

export default userSlice.reducer;