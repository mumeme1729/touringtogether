import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_PLAN,PROPS_COMMENT,PROPS_SEARCH_PLAN} from "../types";


const apiUrl = process.env.REACT_APP_DEV_API_URL;


  //タイムライン
  export const fetchAsyncTimeline = createAsyncThunk("timeline/get", async () => {
    const res = await axios.get(`${apiUrl}api/timeline/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

  //プランを取得(リロード用)
  export const fetchAsyncGetSelectPlan = createAsyncThunk("selectplan/get", async (id:string) => {
    const res = await axios.get(`${apiUrl}api/plan/${id}`, {
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
        newPlan.img && planData.append("img", newPlan.img, newPlan.img.name);
        const res =await axios.post(
            `${apiUrl}api/plan/`,
            planData,
            {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                },
        });
        res.data.profile=newPlan.profile
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

  
export const planSlice =createSlice({
    name:"plan",
    initialState:{
        openNewPlan:false,
        isLoadingPlan:false,
        isOpenImage:false,
        planImage:"",
        timeline:[
          {
              id:0,
              destination:"",
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
                base:""
              }
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
                img:"",
                profile: {
                  id: 0,
                  nickName: "",
                  text: "",
                  userProfile: 0,
                  created_on: "",
                  img: "",
                  base:""
                }
            },
        ],
        selectedPlan:{
            id:0,
            destination:"",
            date:"",
            userPlan:0,
            created_on:"",
            text:"",
            img:""
        },
    },
    reducers:{
        setOpenNewPlan(state){
            state.openNewPlan=true;
        },
        resetOpenNewPlan(state){
            state.openNewPlan=false;
        },
        startLoad(state){
          state.isLoadingPlan=true;
        },
        endLoad(state){
          state.isLoadingPlan=false;
        },
        setOpenImage(state){
          state.isOpenImage=true;
        },
        resetOpenImage(state){
          state.isOpenImage=false;
        },
        setPlanImage(state,action){
          state.planImage=action.payload;
        }
 
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncNewPlan.fulfilled,(state,action)=>{
            return {
                ...state,
                searchplans: [ action.payload,...state.searchplans],
            };
        });
        builder.addCase(fetchAsyncTimeline.fulfilled,(state, action) => {
          state.timeline = action.payload;

      });
        builder.addCase(fetchAsyncGetSelectPlan.fulfilled,(state,action)=>{
            state.selectedPlan=action.payload;
        });
        builder.addCase(fetchAsyncSearchPlans.fulfilled,(state,action)=>{
            state.searchplans=action.payload;
        });
        builder.addCase(fetchAsyncPlanDelete.fulfilled,(state,action)=>{
          return{
            ...state,
            timeline:state.timeline.filter((t)=>t.id!==action.payload),
          };
        });
    },
});

export const{
    setOpenNewPlan,
    resetOpenNewPlan,
    startLoad,
    endLoad,
    setOpenImage,
    resetOpenImage,
    setPlanImage,
}=planSlice.actions


export const selectOpenPlan=(state:RootState)=>state.plan.openNewPlan;
export const selectSearchPlans=(state:RootState)=>state.plan.searchplans;
export const selectSelectedPlan=(state:RootState)=>state.plan.selectedPlan;
export const selectTimeline=(state:RootState)=>state.plan.timeline;
export const selectLoadPlan=(state:RootState)=>state.plan.isLoadingPlan;
export const selectOpenImage=(state:RootState)=>state.plan.isOpenImage;
export const selectPlanImage=(state:RootState)=>state.plan.planImage;
export default planSlice.reducer;