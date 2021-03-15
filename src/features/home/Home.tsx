import React,{ useEffect,} from 'react'
import Auth from "../auth/Auth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import TimeLine from "./TimeLine";
import Search from "./Search";
import {setOpenNewPlan,}from "../plan/planSlice";
import NewPlan from './NewPlan';
import {startLoad,endLoad,fetchAsyncTimeline,selectLoadPlan} from "../plan/planSlice";
import { Button,CircularProgress} from "@material-ui/core";
const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isloadplan=useSelector(selectLoadPlan);

    useEffect(()=>{
        console.log('timeline')
        const fetchLoader = async ()=>{
            dispatch(startLoad());
            await dispatch(fetchAsyncTimeline());//タイムラインの投稿を取得
            dispatch(endLoad());
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
                {isloadplan?
                    <> 
                        <CircularProgress />
                    </>
                :
                    <>
                        <TimeLine/>
                    </>
            }
            </div>  
        </>
    )
}

export default Home
