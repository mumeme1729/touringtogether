import React,{useEffect} from 'react'
import { Avatar,} from "@material-ui/core";
import { PROPS_PLANPROFILE } from '../types';
import styles from "./User.module.css";
import {Link,} from 'react-router-dom';
import { startLoad } from '../plan/planSlice';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { startProfileLoad,selectProfile} from "../auth/authSlice";
import {startLoadComment}from '../comment/commentSlice';

const apiUrl = process.env.REACT_APP_DEV_API_URL

const UserPlan:React.FC< PROPS_PLANPROFILE> = (plan) => {
    const profile=useSelector(selectProfile);
    let imgpath=""
    useEffect(()=>{
        console.log('プラン')
        const fetchLoader = async ()=>{
            let imgpath=""
            if((plan.profile.img)[0]!=='h'){
                imgpath=apiUrl+(plan.profile.img).substr(1);
            }else{
                imgpath=plan.profile.img;
            }
        };
        fetchLoader();
    },[profile]);

    const dispatch: AppDispatch = useDispatch();
    
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
                        dispatch(startLoad());
                        dispatch(startLoadComment());
                        }}> 
                        
                        {imgpath!==apiUrl?
                            <Avatar alt="who?" src={imgpath} style={{height:'70px',width:'70px'}}/>
                        :null}
                         
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

export default UserPlan