import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_PLAN,PROPS_COMMENT,PROPS_SEARCH_PLAN} from "../types";


const apiUrl = process.env.REACT_APP_DEV_API_URL;

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
    async (plan:string) => {
      const res = await axios.get(`${apiUrl}api/getcomment/?plan=${plan}`, {
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

  export const fetchAsyncCommentProfile = createAsyncThunk("commentprofile/get", 
  async (id:number) => {
    const res = await axios.get(`${apiUrl}api/selectprofile/?userProfile=${id}`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data[0];
  });


export const commentSlice =createSlice({
    name:"comment",
    initialState:{
        comments: [
            {
              id: 0,
              text: "",
              userComment: 0,
              plan: 0,
            },
          ],
        commentprofiles:[{
          id: 0,
          nickName: "",
          text:"",
          userProfile: 0,
          created_on: "",
          img: "",
        },
      ],
    },
    reducers:{},
    extraReducers:(builder)=>{
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
        builder.addCase(fetchAsyncCommentProfile.fulfilled,(state,action)=>{
          return {
            ...state,
            commentprofiles: [...state.commentprofiles, action.payload],
          };
        });
    },
});

export const{
}=commentSlice.actions


export const selectComments = (state: RootState) => state.comment.comments;
export const selectCommentProfiles=(state:RootState)=>state.comment.commentprofiles;
export default commentSlice.reducer;