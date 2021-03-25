import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_PLAN,PROPS_LIKES,PROPS_SEARCH_PLAN} from "../types";
import { create } from "yup/lib/array";


const apiUrl = process.env.REACT_APP_DEV_API_URL;

  export const fetchAsyncGetPrefectures=createAsyncThunk("prefectures/get",async()=>{
    const res=await axios.get(`${apiUrl}api/prefectures/`,{
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

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
    const res = await axios.get(`${apiUrl}api/searchplan/${id}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });



  //2P以降
  export const fetchAsyncSearchPlansPage = createAsyncThunk("searchplansPage/get", 
  async (url:string) => {
    const res = await axios.get(`${url}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });
//検索
  export const fetchAsyncSearchPlans = createAsyncThunk("searchplans/get", 
  async (search:PROPS_SEARCH_PLAN) => {
    const res = await axios.get(`${apiUrl}api/searchplan/?destination=${search.destination}&date=${search.date}&prefecture=${search.prefecture}`, {
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
        planData.append("title",newPlan.title)
        planData.append("prefecture",newPlan.prefecture)
        planData.append("departure",newPlan.departure)
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

//いいね
export const fetchAsyncAddLikes = createAsyncThunk(
  "likes/post",
  async (likes: PROPS_LIKES) => {
    const res = await axios.post(`${apiUrl}api/likes/`, likes, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

//いいね取得
// export const fetchAsyncGetLikesCount = createAsyncThunk("likes/get", async (id:string) => {
//   const res = await axios.get(`${apiUrl}api/countlikes/`, {
//     headers: {
//       Authorization: `JWT ${localStorage.localJWT}`,
//     },
//     params:{
//       id:`${id}`,
//     },
//   })
//   return res.data;
// });



//言い値取り消し
export const fetchAsyncLikeDelete =createAsyncThunk("likes/delete",async (id:number) =>{
  await axios.delete(`${apiUrl}api/likes/${id}/`,{
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
        nextpage:"",
        timeline:[
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
              liked:[0],
              profile: {
                id: 0,
                nickName: "",
                text: "",
                userProfile: 0,
                created_on: "",
                img: "",
                base:""
              },
              likes:[
                {
                  id:0,
                  plan:0,
                  userLikes:0,
                  created_on:"",
                }
              ],
          },
      ],
        searchplans:[
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
              liked:[0],
              profile: {
                id: 0,
                nickName: "",
                text: "",
                userProfile: 0,
                created_on: "",
                img: "",
                base:""
                },
              likes:[
                {
                  id:0,
                  plan:0,
                  userLikes:0,
                  created_on:"",
                }
              ],
            },
        ],
        prefectures:[
          {
            id:0,
            name:"",
          }
        ],
        selectedPlan:{
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
            base:""
            },
          likes:[
            {
              id:0,
              plan:0,
              userLikes:0,
              created_on:"",
            }
          ],
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
        },
        setNextPagePlans(state,action){
          return {
            ...state,
            searchplans: [...state.searchplans,...action.payload],
        };
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
            state.searchplans=action.payload.results;
            state.nextpage=action.payload.next;
        });
        builder.addCase(fetchAsyncSearchPlansPage.fulfilled,(state,action)=>{
          state.nextpage=action.payload.next;
        });
        builder.addCase(fetchAsyncGetPrefectures.fulfilled,(state,action)=>{
            state.prefectures=action.payload;
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
    setNextPagePlans
}=planSlice.actions


export const selectOpenPlan=(state:RootState)=>state.plan.openNewPlan;
export const selectSearchPlans=(state:RootState)=>state.plan.searchplans;
export const selectSelectedPlan=(state:RootState)=>state.plan.selectedPlan;
export const selectTimeline=(state:RootState)=>state.plan.timeline;
export const selectLoadPlan=(state:RootState)=>state.plan.isLoadingPlan;
export const selectOpenImage=(state:RootState)=>state.plan.isOpenImage;
export const selectPlanImage=(state:RootState)=>state.plan.planImage;
export const selectPrefectures=(state:RootState)=>state.plan.prefectures;
export const selectNextPage=(state:RootState)=>state.plan.nextpage;
export default planSlice.reducer;