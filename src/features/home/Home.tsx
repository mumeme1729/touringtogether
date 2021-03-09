import React,{ useEffect,} from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import {Button} from "@material-ui/core";
import Plan from "../plan/Plan";
import Search from "./Search";
import {
    setOpenNewPlan,
    fetchAsyncTimeline,
    selectTimeline,
}from "../plan/planSlice";
import NewPlan from './NewPlan';
import {selectFollowing,} from "../relationship/RelationshipSlice";
import {resetcomments} from "../comment/commentSlice";

const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const timeline=useSelector(selectTimeline);
    
    useEffect(()=>{
        console.log('---ホーム---')
        const fetchLoader = async ()=>{
            if (localStorage.localJWT){
                dispatch(fetchAsyncTimeline());
            };
            dispatch(resetcomments());//コメントをリセット
        };
        fetchLoader();
    },[dispatch]);
 
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
                {timeline.map((plan)=>(
                    <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text}/> 
                ))}
            </div>  
        </>
    )
}

export default Home
