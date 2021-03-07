import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_PLAN,PROPS_COMMENT,PROPS_SEARCH_PLAN} from "../types";


const apiUrl = process.env.REACT_APP_DEV_API_URL;

//予定をすべて取得
  export const fetchAsyncGetPlans = createAsyncThunk("plans/get", async () => {
    const res = await axios.get(`${apiUrl}api/plan/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

//検索
  export const fetchAsyncSearchPlans = createAsyncThunk("searchplans/get", 
  async (search:PROPS_SEARCH_PLAN) => {
    const res = await axios.get(`${apiUrl}api/searchplan/?destination=${search.destination}&date=${search.date}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

//新規予定
export const fetchAsyncNewPlan = createAsyncThunk(
    "plan/post",
    async(newPlan:PROPS_PLAN)=>{
        const planData = new FormData();
        planData.append("destination",newPlan.destination)
        planData.append("date",newPlan.date)
        planData.append("text",newPlan.text)
        const res =await axios.post(
            `${apiUrl}api/plan/`,
            planData,
            {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                },
        });
        return res.data;
    });

//予定を削除
export const fetchAsyncPlanDelete =createAsyncThunk("plan/delete",async (id:number) =>{
    await axios.delete(`${apiUrl}api/plan/${id}/`,{
        headers:{
            "Content-Type":"application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return id;
  });

//コメントを投稿
export const fetchAsyncPostComment = createAsyncThunk(
    "comment/post",
    async (comment: PROPS_COMMENT) => {
      const res = await axios.post(`${apiUrl}api/comment/`, comment, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
  );

  //コメントを取得
  export const fetchAsyncGetComments = createAsyncThunk(
    "comment/get",
    async () => {
      const res = await axios.get(`${apiUrl}api/comment/`, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
  );
  
  //コメントを削除
  export const fetchAsyncCommentDelete =createAsyncThunk("comment/delete",async (id:number) =>{
    await axios.delete(`${apiUrl}api/comment/${id}/`,{
        headers:{
            "Content-Type":"application/json",
            Authorization: `JWT ${localStorage.localJWT}`,
        },
    });
    return id;
  });

  


export const planSlice =createSlice({
    name:"plan",
    initialState:{
        openNewPlan:false,
        plans:[
            {
                id:0,
                destination:"",
                date:"",
                userPlan:0,
                created_on:"",
                text:"",
            },
        ],
        searchplans:[
            {
                id:0,
                destination:"",
                date:"",
                userPlan:0,
                created_on:"",
                text:"",
            },
        ],
        selectedPlan:{
            id:0,
            destination:"",
            date:"",
            userPlan:0,
            created_on:"",
            text:"",
        },
        comments: [
            {
              id: 0,
              text: "",
              userComment: 0,
              plan: 0,
            },
          ],
    },
    reducers:{
        setOpenNewPlan(state){
            state.openNewPlan=true;
        },
        resetOpenNewPlan(state){
            state.openNewPlan=false;
        },
        selectPlan(state,action){
            state.selectedPlan=action.payload;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncNewPlan.fulfilled,(state,action)=>{
            return {
                ...state,
                plans: [ action.payload,...state.plans],
            };
        });
        builder.addCase(fetchAsyncGetPlans.fulfilled,(state, action) => {
            state.plans = action.payload;
        });
        builder.addCase(fetchAsyncSearchPlans.fulfilled,(state,action)=>{
            state.searchplans=action.payload;
        });
        builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
            return {
              ...state,
              comments: [...state.comments, action.payload],
            };
        });
        builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
            return {
              ...state,
              comments: action.payload,
            };
        });
        builder.addCase(fetchAsyncCommentDelete.fulfilled,(state,action)=>{
            return{
              ...state,
              comments:state.comments.filter((t)=>t.id!==action.payload),
            };
        });
        builder.addCase(fetchAsyncPlanDelete.fulfilled,(state,action)=>{
          return{
            ...state,
            plans:state.plans.filter((t)=>t.id!==action.payload),
          };
      });
    },
});

export const{
    setOpenNewPlan,
    resetOpenNewPlan,
    selectPlan
}=planSlice.actions


export const selectPlans=(state:RootState)=>state.plan.plans;
export const selectOpenPlan=(state:RootState)=>state.plan.openNewPlan;
export const selectSearchPlans=(state:RootState)=>state.plan.searchplans;
export const selectSelectedPlan=(state:RootState)=>state.plan.selectedPlan;
export const selectComments = (state: RootState) => state.plan.comments;
export default planSlice.reducer;