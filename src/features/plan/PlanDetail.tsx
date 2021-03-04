import React,{useState} from 'react'
import { Avatar,Button} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_PROFILE,PROPS_ALL_USER, PROPS_PLANS } from '../types';
import styles from "./Plan.module.css";
import {selectProfiles,selectUserProfile,selectProfile} from "../auth/authSlice";
import {Link} from 'react-router-dom';
import {selectPlan,selectSelectedPlan} from "../plan/planSlice";

const PlanDetail:React.FC< PROPS_PLANS> = () => {
    const allprofiles = useSelector(selectProfiles);
    const plan=useSelector(selectSelectedPlan);
    const profile = useSelector(selectProfile);
    const dispatch: AppDispatch = useDispatch();
    //投稿者のプロフィールを取得
    const prof=allprofiles.filter((p)=>{
        return plan.userPlan===p.userProfile;
    });
    return (
        <div className={styles.plan_detail_container}>
            <div className={styles.plan_body}>
                    <Link to ={"/profile/"+prof[0]?.userProfile}>
                        <button className={styles.plan_btnprofile} onClick={()=>{dispatch(selectUserProfile(prof[0]));}}>
                            <Avatar alt="who?" src={prof[0]?.img} style={{height:'70px',width:'70px'}}/>{" "}
                        </button>
                    </Link>
                    {prof[0]?.nickName}
                    <h2>目的地:{plan.destination}</h2>
                    <h3>出発予定日:{plan.date}</h3>
                    <p>{plan.text}</p>
            </div>  
        </div>
    )
}

export default PlanDetail
