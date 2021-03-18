import React,{ useEffect,} from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import TimeLine from "./TimeLine";
import Search from "./Search";
import {setOpenNewPlan,}from "../plan/planSlice";
import NewPlan from './NewPlan';
import {startLoad,endLoad,fetchAsyncTimeline,selectLoadPlan,fetchAsyncSearchPlans} from "../plan/planSlice";
import { Button,CircularProgress} from "@material-ui/core";
import {fetchAsyncGetNotification,} from "../notification/notificationSlice";
import SearchList from "./SearchList";
const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isloadplan=useSelector(selectLoadPlan);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                dispatch(startLoad());
                //await dispatch(fetchAsyncTimeline());//タイムラインの投稿を取得
                const packet = { destination: "", date: ""};
                await dispatch(fetchAsyncSearchPlans(packet));
                await dispatch(fetchAsyncGetNotification());//通知を取得
                dispatch(endLoad());
            }
        };
        fetchLoader();
    },[dispatch]);
 
    return (
        <>
            <Auth />
            {/* メインコンテンツ */}       
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>ホーム</h2>
            </div> 
            <br/>  
            <br/>
            <br/>  
            <div className={styles.home_newplan}>
                <NewPlan/> 
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
                {isloadplan?
                    <> 
                        <CircularProgress />
                    </>
                :
                    <>
                        <SearchList/>
                    </>
            }
            </div>  
        </>
    )
}

export default Home
