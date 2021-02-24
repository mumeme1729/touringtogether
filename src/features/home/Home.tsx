import React,{ useEffect,useState } from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import {
    Avatar,
    CircularProgress,
  } from "@material-ui/core";
import User from "./User";

import {
    selectProfile,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    selectProfiles,
    selectOpenProfile,
    setOpenProfile,
    resetOpenProfile,
    selectUserProfile,
    fetchAsyncRelations,
} from "../auth/authSlice";
import classes from './Home.module.css';
import { PROPS_PROFILE,PROPS_ALL_USER } from '../types';
import UserProfile from './UserProfile';


const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);//ログインしているユーザーのプロフィール
    const allprofiles = useSelector(selectProfiles);//他のユーザー
    const openprofile = useSelector(selectOpenProfile);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn());//opensignInをoffにする
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                 
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                  dispatch(setOpenSignIn());
                
                  return null;
                }
                await dispatch(fetchAsyncGetProfs()); 
               // await dispatch(fetchAsyncRelations());       
              }
            };
            fetchLoader();
    },[dispatch]);


    return (
        <div>
            <Auth />
            {/* ヘッダー */}
            <div className={styles.home_header}>
                <button onClick={()=>{
                    dispatch(resetOpenProfile());
                }}className={styles.homr_btnprofile}>
                    <h1 >Home</h1>
                </button>
                <div className={styles.home_header_right}>
                    <div className={styles.header_nickname}>
                        <p className={styles.nickname_p}>{profile.nickName}</p>  
                    </div>
                    <div className={styles.home_header_avater}>
                        <button className={styles.homr_btnprofile} onClick={()=>{
                            dispatch(setOpenProfile());
                            dispatch(selectUserProfile(profile));
                        }}>
                            <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>{" "}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* メインコンテンツ */}
            <div className={styles.body_container}>
                    {allprofiles.map((p)=>(
                        <User  key={p.id} id={p.id} nickName={p.nickName} text={p.text} userProfile={p.userProfile} created_on={p.created_on} img={p.img} />
                    ))} 
            </div>
            <div className={styles.body_content}>
                <br />
                {openprofile ?(
                    <div>
                        <UserProfile/>
                    </div>
                ):null}
            </div>
        </div>
    )
}

export default Home
