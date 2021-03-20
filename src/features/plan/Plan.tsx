import React from 'react'
import { Avatar,} from "@material-ui/core";
import { PROPS_PLANPROFILE } from '../types';
import styles from "./Plan.module.css";
import {Link,} from 'react-router-dom';
import {  useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { startProfileLoad} from "../auth/authSlice";
import {setOpenImage,selectOpenImage,setPlanImage} from '../plan/planSlice';


const apiUrl = process.env.REACT_APP_DEV_API_URL

const Plan:React.FC< PROPS_PLANPROFILE> = (plan) => {
    const dispatch: AppDispatch = useDispatch();
    const openImage=useSelector(selectOpenImage);;
    let imgpath=""
    if((plan.profile.img)[0]!=='h'){
        imgpath=apiUrl+(plan.profile.img).substr(1);
    }else{
        imgpath=plan.profile.img;
    }

    const setImage=(image:string)=>{
        dispatch(setPlanImage(image));
        dispatch(setOpenImage());
    }
    
    return (
        <>
            <div className={styles.plan_detail_container}>
                <div className={styles.plan_body}>
                    <Link to={'/plandetail/'+plan.userPlan+'/'+plan.id}  className={styles.plan_link}>
                            <Link to ={"/profile/"+plan.profile.userProfile} onClick={()=>dispatch(startProfileLoad())} className={styles.plan_btn}> 
                                    {imgpath!==apiUrl?
                                        <Avatar alt="who?" src={imgpath} style={{height:'70px',width:'70px'}}/>
                                        :null}
                                    {plan.profile.nickName}
                            </Link>  
                            <h2>目的地:{plan.destination}</h2>
                            <h3>出発予定日:{plan.date}</h3>
                            <p>{plan.text}</p>
                    </Link>
                    {plan.img!==null?
                            <img src={plan.img} className={styles.plan_img} alt=""  onClick={()=>{setImage(plan.img)}}/>     
                        :null}
                </div> 
            </div>
        </>
    )
}

export default Plan
