import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectTimeline,fetchAsyncTimeline,selectTimeLineNextPage,fetchAsyncTimeLinePage,setNextTimeLine, startLoad, endLoad,selectLoadPlan} from "../plan/planSlice";
import UseInfiniteScroll from '../home/UseInfiniteScroll';
import Plan from "../plan/Plan";
import styles from "./Home.module.css";
import {CircularProgress} from "@material-ui/core";
const TimeLine = () => {
    const dispatch: AppDispatch = useDispatch();
    const timeline=useSelector(selectTimeline);
    const [isFetching, setIsFetching] = UseInfiniteScroll(fetchMoreListItems);
    const nextpage=useSelector(selectTimeLineNextPage);
    const isloadplan=useSelector(selectLoadPlan);

    async function fetchMoreListItems() {
        if(nextpage!==null){
            const a=await dispatch(fetchAsyncTimeLinePage(nextpage));
            if(!fetchAsyncTimeLinePage.rejected.match(a)){
                dispatch(setNextTimeLine(a.payload.results));
            }
        }
        setIsFetching(false)
  }

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(startLoad());
                await dispatch(fetchAsyncTimeline());
                window.scrollTo(0, 0);
                dispatch(endLoad());
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
            {isloadplan?
                        <> 
                            <CircularProgress />
                        </>
                    :
                        <>
                            {timeline.map((plan)=>(
                                <Plan key={plan.id} 
                                        id={plan.id} 
                                        title={plan.title}
                                        departure={plan.departure} 
                                        prefecture={plan.prefecture} 
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
                        </>}
            </div>
            </div>
        </div>
    )
}

export default TimeLine
