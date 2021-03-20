import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectTimeline,fetchAsyncTimeline,startLoad,endLoad,selectLoadPlan,} from "../plan/planSlice";
import Plan from "../plan/Plan";
import { Avatar,Button,CircularProgress} from "@material-ui/core";
import { PROPS_PLANS } from '../types';
const TimeLine = () => {
    const dispatch: AppDispatch = useDispatch();
    const timeline=useSelector(selectTimeline);
   

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncTimeline());
            };
        };
            fetchLoader();
    },[dispatch]);

    return (
        <div>
            
                {timeline.map((plan)=>(
                    <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text} img={plan.img} profile={plan.profile}/> 
                ))}
                
                
            
        </div>
    )
}

export default TimeLine
