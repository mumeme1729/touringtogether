import React from 'react'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {NOTIFICATION,NOTIFICATION_GET,NOTIFICATION_DELETE} from "../types";
import axios from "axios";
import { RootState } from "../../app/store";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//通知を追加
export const fetchAsyncPostNotification = createAsyncThunk(
    "notification/post",
    async (notification: NOTIFICATION) => {
      const res = await axios.post(`${apiUrl}api/notification/`, notification, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }).catch((error)=>{
        console.log(error.response)
      })
      //return res.data;
    }
  );
//通知を取得
export const fetchAsyncGetNotification = createAsyncThunk("notification/get", async () => {
  const res = await axios.get(`${apiUrl}api/usernotification/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});

//通知を既読
export const fetchAsyncUpdateStatus = createAsyncThunk(
  "notification/put",
  async (notification:NOTIFICATION_DELETE) => {
    
    const uploadData={'status':false,'receive':notification.receive,'send':notification.send,'targetplan':notification.targetplan,'profile':notification.profile}
    //profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/notification/${notification.id}/`,
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


  export const notificationSlice =createSlice({
    name:"notification",
    initialState:{
        notificationCount:0,
        notifications: [
            {
                id:0,
                status:false,
                receive:0,
                send:0,
                targetplan:null,
                created_on:"",
                profile:{
                  id: 0,
                  nickName: "",
                  text:"",
                  userProfile: 0,
                  created_on: "",
                  img: "",
                  base:""
                }
              }
            
          ],
    },
    reducers:{
      setCount(state,action){
        state.notificationCount=action.payload;
      }

    },
    extraReducers:(builder)=>{
      builder.addCase(fetchAsyncGetNotification.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });
    },
});

export const {
  setCount
} = notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification.notifications; 
export default notificationSlice.reducer;
