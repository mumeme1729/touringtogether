import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectTimeline,fetchAsyncTimeline} from "../plan/planSlice";
import Plan from "../plan/Plan";
import styles from "./Home.module.css";

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
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>タイムライン</h2>
            </div> 
            <br/>  
            <br/> 
                {timeline.map((plan)=>(
                     <Plan key={plan.id} 
                            id={plan.id} 
                            title={plan.title}
                            departure={plan.departure} 
                            prefecture={plan.departure} 
                            destination={plan.destination} 
                            date={plan.date} 
                            userPlan={plan.userPlan} 
                            created_on={plan.created_on} 
                            text={plan.text} 
                            img={plan.img} 
                            profile={plan.profile}
                            likes={plan.likes}
                    />
                ))}
        </div>
    )
}

export default TimeLine
