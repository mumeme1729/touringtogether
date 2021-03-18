import React from 'react'
import { Avatar,} from "@material-ui/core";
import { PROPS_PLANPROFILE } from '../types';
import styles from "./Plan.module.css";
import {Link,} from 'react-router-dom';
import {  useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { startProfileLoad} from "../auth/authSlice";


const apiUrl = process.env.REACT_APP_DEV_API_URL

const Plan:React.FC< PROPS_PLANPROFILE> = (plan) => {
    const dispatch: AppDispatch = useDispatch();
    let imgpath=""
    if((plan.profile.img)[0]!=='h'){
        imgpath=apiUrl+(plan.profile.img).substr(1);
    }else{
        imgpath=plan.profile.img;
    }
    return (
        <>
            
            <div className={styles.plan_detail_container}>
                <div className={styles.plan_body}>
                <Link to={'/plandetail/'+plan.userPlan+'/'+plan.id} >
                    <button className={styles.plan_btn} onClick={()=>{
                        }}> 
                        <Link to ={"/profile/"+plan.profile.userProfile}> 
                            <button className={styles.plan_btnprofile} onClick={()=>dispatch(startProfileLoad())}>
                                {imgpath!==apiUrl?
                                    <Avatar alt="who?" src={imgpath} style={{height:'70px',width:'70px'}}/>
                                    :null}
                            </button>
                        </Link>  
                        {plan.profile.nickName}
                        <h2>目的地:{plan.destination}</h2>
                        <h3>出発予定日:{plan.date}</h3>
                        <p>{plan.text}</p>
                    </button> 
                </Link>
                </div>  
            </div>
        </>
    )
}

export default Plan
