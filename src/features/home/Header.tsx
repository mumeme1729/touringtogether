import React,{ useEffect,useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import {Avatar} from "@material-ui/core";

import {
    setOpenSignIn,
    resetOpenSignIn,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    selectProfile,
    selectUserProfile
} from "../auth/authSlice";
import {
    setOpenNewPlan,
    fetchAsyncGetPlans,
    selectPlans
}from "../plan/planSlice";

import {Link} from 'react-router-dom';


const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn());
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                  dispatch(setOpenSignIn());
                  return null;
                }
                //ログインしているユーザーデータをとる？
                await dispatch(fetchAsyncGetPlans()); 
                await dispatch(fetchAsyncGetProfs()); 
              }
            };
            fetchLoader();
    },[dispatch]);
 


    return (
        <div className={styles.home_header}>
        <button onClick={()=>{
            
        }}className={styles.homr_btnprofile}>
            <Link to ="/"><h1 >Home</h1></Link>
            
        </button>
        <div className={styles.home_header_right}>
            <div className={styles.header_nickname}>
                <p className={styles.nickname_p}>{profile.nickName}</p>  
            </div>
            <div className={styles.home_header_avater}>
                <Link to ={"/profile/"+profile.userProfile}>
                    <button className={styles.homr_btnprofile} onClick={()=>{
                        dispatch(selectUserProfile(profile)); 
                    }}>
                        <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>{" "}
                    </button>
                </Link>
            </div>
        </div>
    </div>
    )
}

export default Header
