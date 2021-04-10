import React,{useEffect} from 'react'
import { Avatar,} from "@material-ui/core";
import { PROPS_PLANPROFILE } from '../types';
import styles from "./User.module.css";
import {Link,} from 'react-router-dom';
import {selectPrefectures,fetchAsyncSearchPlans,setPlanImage,setOpenImage,startLoad,} from '../plan/planSlice';
import Likes from '../plan/Likes';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { selectProfile} from "../auth/authSlice";
import PrintDate from '../plan/PrintDate';


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

    const likeProps={
        likes:plan.likes,
        planid:plan.id,
    }

    return (
        <>
            <div className={styles.plan_detail_container}>
                <div className={styles.plan_body}>
                    <div className={styles.plan_body_top}>
                        <div className={styles.plan_body_left}>
                            <Link to={'/plandetail/'+plan.userPlan+'/'+plan.id}  onClick={()=>dispatch(startLoad())} className={styles.plan_link}>
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
                        </div>
                        <div className={styles.plan_body_right}>
                            <div>
                                {plan.id!==0?
                                    <PrintDate created_on={plan.created_on}/>
                                :null} 
                            </div>
                            <div className={styles.plan_likes}>
                                <Likes {...likeProps} />
                            </div>
                            <div className={styles.plan_prefecture_container}>
                                <Link to ={'/search/'+'destination='+'/'+'date='+'/'+'prefecture='+String(prefecture[0]?.id)}>
                                    <div className={styles.plan_prefecture_div}>
                                        <p onClick={searchPlan} className={styles.plan_prefecture}>{prefecture[0]?.name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {plan.img!==null?
                        <img src={plan.img} className={styles.plan_img} alt=""  onClick={()=>{setImage(plan.img)}}/>     
                    :null}
                </div>  
            </div>
        </>
    )
}

export default UserPlan