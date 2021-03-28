import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectTimeline,fetchAsyncTimeline,selectTimeLineNextPage,fetchAsyncTimeLinePage,setNextTimeLine} from "../plan/planSlice";
import UseInfiniteScroll from '../home/UseInfiniteScroll';
import Plan from "../plan/Plan";
import styles from "./Home.module.css";

const TimeLine = () => {
    const dispatch: AppDispatch = useDispatch();
    const timeline=useSelector(selectTimeline);
    const [isFetching, setIsFetching] = UseInfiniteScroll(fetchMoreListItems);
    const nextpage=useSelector(selectTimeLineNextPage);

    async function fetchMoreListItems() {
        if(nextpage!==null){
            const a=await dispatch(fetchAsyncTimeLinePage(nextpage));
            console.log(a)
            dispatch(setNextTimeLine(a.payload.results));
        }
        setIsFetching(false)
  }

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncTimeline());
                window.scrollTo(0, 0);
            };
        };
            fetchLoader();
    },[dispatch]);

    return (
        <div className={styles.home_container}>
            <div className={styles.home_body}> 
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>タイムライン</h2>
            </div> 
            <br/>  
            <br/> 
            <div className={styles.timeline_min}>
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
            </div>
        </div>
    )
}

export default TimeLine
