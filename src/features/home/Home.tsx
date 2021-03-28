import React,{ useEffect,} from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import Search from "./Search";
import {startLoad,endLoad,selectLoadPlan,fetchAsyncSearchPlans,} from "../plan/planSlice";
import {CircularProgress} from "@material-ui/core";
import {fetchAsyncGetNotification,selectNotifications,setCount} from "../notification/notificationSlice";
import SearchList from "./SearchList";
const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isloadplan=useSelector(selectLoadPlan);
    const notification=useSelector(selectNotifications);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                dispatch(startLoad());
                const packet = { destination: "", date: "",prefecture:""};
                await dispatch(fetchAsyncSearchPlans(packet));
                const result = await dispatch(fetchAsyncGetNotification());//通知を取得
                if(fetchAsyncGetNotification.fulfilled.match(result)){
                    const notifi=result.payload.results
                    const newnotification=notifi.filter((n: { status: boolean; })=>{
                        return n.status===true;
                    });
                    dispatch(setCount(newnotification.length));
                }
                dispatch(endLoad());
            }
        };
        fetchLoader();
    },[dispatch]);
 
    return (
        <div className={styles.home_container}>
            <Auth />  
            {/* メインコンテンツ */}
            <div className={styles.home_body}>     
                <div id="top" className={styles.home_title}>
                    <h2 className={styles.title_h2}>新着プラン</h2>
                </div> 
                <br/>  
                <br/> 
                <Search/>
                {/* プランを表示 */}
                <div>
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
            </div>  
        </div>
    )
}

export default Home
