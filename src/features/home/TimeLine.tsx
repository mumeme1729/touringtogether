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
    
    return (
        <div>
            
            {timeline.map((plan)=>(
                <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text} profile={plan.profile}/> 
            ))}
                
            
        </div>
    )
}

export default TimeLine
