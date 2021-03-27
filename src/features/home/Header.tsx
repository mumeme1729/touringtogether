import React,{ useEffect,useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import styles from "./Home.module.css";
import {Avatar,Badge,Button} from "@material-ui/core";
import NotificationsIcon from '@material-ui/icons/Notifications';
import HomeIcon from '@material-ui/icons/Home';
import TimelineIcon from '@material-ui/icons/Timeline';
import ImageModal from '../plan/ImageModal';
import NewPlan from '../home/NewPlan';
import {selectNotifications,selectNotificationCount,setCount} from "../notification/notificationSlice";
import {
    setOpenSignIn,
    resetOpenSignIn,
    fetchAsyncGetMyProf,
    selectProfile,
} from "../auth/authSlice";
import {setOpenNewPlan,fetchAsyncGetPrefectures} from "../plan/planSlice";
import {Link,useLocation} from 'react-router-dom';
import {HashLink} from 'react-router-hash-link';


const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const notification=useSelector(selectNotifications);
    const ncount=useSelector(selectNotificationCount);
    
    let count=0;
    const newnotification=notification.filter((n)=>{
        return n.status===true;
    });
    count=newnotification.length;
    

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(resetOpenSignIn());
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                await dispatch(fetchAsyncGetPrefectures());
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                  dispatch(setOpenSignIn());
                  return null;
                }
              }
            };
            fetchLoader();
    },[dispatch]);
 

    return (
        <>
            <div className={styles.home_header}>
                <ImageModal />
                <div className={styles.header_top}>
                    <div className={styles.header_con}>
                        
                        <Link to ="/" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_container}>
                                <div className={styles.home_header_contents}>  
                                    <HomeIcon style={{ fontSize: 40 }}/><p className={styles.header_p} >TOP</p>   
                                </div>
                            </div>
                        </Link>
                        
                
                        <Link to ="/notification" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_container}>
                                <div className={styles.home_header_contents}>
                                <Badge badgeContent={ncount} color="secondary">
                                    <NotificationsIcon style={{ fontSize: 40 }}/><p>通知</p>
                                </Badge>
                                </div>
                            </div>
                        </Link>

                        <Link to ="/timeline" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_container}>
                                <div className={styles.home_header_contents}> 
                                    <TimelineIcon style={{ fontSize: 40 }}/><p>プラン</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.home_newplan}>
                        <NewPlan/> 
                        <Button variant="outlined" color="primary"
                            onClick={() => {
                            dispatch(setOpenNewPlan());
                            }}
                        >プランを投稿する</Button>
                     </div>
                    <div className={styles.home_header_profile}>
                        <div className={styles.home_header_avater}>
                            <Link to ={"/profile/"+profile.userProfile}>
                                <button className={styles.homr_btnprofile} >
                                    <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                                </button>
                            </Link>
                        </div>
                        <div className={styles.header_nickname}>
                            <p className={styles.nickname_p}>{profile.nickName}</p>  
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
