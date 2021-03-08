import React,{ useEffect,useState } from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import {Button} from "@material-ui/core";
import Plan from "../plan/Plan";
import Search from "./Search";
import {
    setOpenNewPlan,
    selectPlans
}from "../plan/planSlice";
import NewPlan from './NewPlan';
import { selectProfile,} from "../auth/authSlice";

import {selectFollowing,
    fetchAsyncFollowing,
    fetchAsyncFollower,
} from "../relationship/RelationshipSlice";


const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const allplans=useSelector(selectPlans);
    const following=useSelector(selectFollowing); 
    const profile=useSelector(selectProfile);
    const loginuser:string=String(profile.userProfile);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT){
                await dispatch(fetchAsyncFollowing(loginuser));
                await dispatch(fetchAsyncFollower(loginuser));
            };
        };
            fetchLoader();
    },[profile]);

    //フォローしている人の予定
    const following_plan =allplans.filter((f)=>{
          return  following.find((foll)=>{
           return ((foll.following===f.userPlan) && (foll.userFollow===profile.userProfile)) || (f.userPlan===profile.userProfile);
        })
    });
  
    return (
        <>
            <Auth />
            {/* メインコンテンツ */}            
            <div>
                <NewPlan/> 
                <br/>
                <br />
                <Button variant="outlined" color="primary"
                    onClick={() => {
                     dispatch(setOpenNewPlan());
                    }}
                >ツーリング予定を投稿する</Button>
            </div>
            <br/>
            <Search/>
             <br />
            {/* プランを表示 */}
             <div >
                {following_plan.map((plan)=>(
                    <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text}/>
                    
                ))}
            </div>  
        </>
    )
}

export default Home
