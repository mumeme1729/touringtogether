import React,{useEffect} from 'react'
import { Avatar,} from "@material-ui/core";
import { PROPS_PLANPROFILE } from '../types';
import styles from "./User.module.css";
import {Link,} from 'react-router-dom';
import { startLoad,selectPrefectures,fetchAsyncSearchPlans,setPlanImage,setOpenImage } from '../plan/planSlice';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { startProfileLoad,selectProfile} from "../auth/authSlice";
import {startLoadComment}from '../comment/commentSlice';

const apiUrl = process.env.REACT_APP_DEV_API_URL

const UserPlan:React.FC< PROPS_PLANPROFILE> = (plan) => {
    const profile=useSelector(selectProfile);
    const prefectures=useSelector(selectPrefectures);
    let imgpath=""
    useEffect(()=>{
        const fetchLoader = async ()=>{
            let imgpath=""
            if(plan.profile.img!==null){
                if((plan.profile.img)[0]!=='h'){
                    imgpath=apiUrl+(plan.profile.img).substr(1);
                }else{
                    imgpath=plan.profile.img;
                }
            };
        };
        fetchLoader();
    },[profile]);

    const dispatch: AppDispatch = useDispatch();
    if(plan.profile.img!==null){
        if((plan.profile.img)[0]!=='h'){
            imgpath=apiUrl+(plan.profile.img).substr(1);
        }else{
            imgpath=plan.profile.img;
        }
    }

    const setImage=(image:string)=>{
        dispatch(setPlanImage(image));
        dispatch(setOpenImage());
    }

    const prefecture=prefectures.filter((p)=>{
        return p.id===Number(plan.prefecture);
    })

    const searchPlan =async()=>{
        const packet = { destination: "", date: "",prefecture:String(plan.prefecture)};
        await dispatch(fetchAsyncSearchPlans(packet));
    }
    return (
        <>
            <div className={styles.plan_detail_container}>
                <div className={styles.plan_body}>
                    <Link to={'/plandetail/'+plan.userPlan+'/'+plan.id} className={styles.plan_link}>
                        <div className={styles.plan_profile}>
                            
                                {imgpath!==apiUrl?
                                    <Avatar alt="who?" src={imgpath} style={{height:'50px',width:'50px'}}/>
                                :null}
                                <div className={styles.plan_profile_nickname}>
                                    {plan.profile.nickName}
                                    <div className={styles.plan_title}>
                                        <h2 className={styles.plan_h2}>{plan.title}</h2>
                                    </div>
                                </div> 
                        </div>
                        <div className={styles.plan_description}>
                            <br/>
                            <p className={styles.plan_description_p}>目的地    : {plan.destination}</p>
                            <p className={styles.plan_description_p}>出発予定日: {plan.date}</p>
                            <p className={styles.plan_description_p}>出発地    : {plan.departure}</p>
                            <p className={styles.plan_description_p}>{plan.text}</p>
                        </div>
                    </Link>
                    {plan.img!==null?
                        <img src={plan.img} className={styles.plan_img} alt=""  onClick={()=>{setImage(plan.img)}}/>     
                    :null}
                    <Link to ="/search">
                        <div className={styles.plan_prefecture_div}>
                            <p onClick={searchPlan} className={styles.plan_prefecture}>{prefecture[0]?.name}</p>
                        </div>
                    </Link>
                </div>  
            </div>
        </>
    )
}

export default UserPlan