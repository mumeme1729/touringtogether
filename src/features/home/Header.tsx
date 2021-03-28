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
import {selectNotifications,selectNotificationCount} from "../notification/notificationSlice";
import {
    setOpenSignIn,
    resetOpenSignIn,
    fetchAsyncGetMyProf,
    selectProfile,
} from "../auth/authSlice";
import {setOpenNewPlan,fetchAsyncGetPrefectures} from "../plan/planSlice";
import {Link} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive'
import PostAddIcon from '@material-ui/icons/PostAdd';


const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    const notification=useSelector(selectNotifications);
    const ncount=useSelector(selectNotificationCount);
    const mediaquery = useMediaQuery({ query: '(max-width: 900px)' })
    const mediaquerymin = useMediaQuery({ query: '(max-width: 680px)' })
    const isBigScreen = useMediaQuery({ minDeviceWidth: 1224 })
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
            <div className={styles.header_container}>
                <ImageModal />
                <div className={styles.header_body}>
                    <div className={styles.header_contents_container}>
                        <Link to ="/" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_body}>
                                <div className={styles.home_header_contents}>  
                                    <HomeIcon style={{ fontSize: 40 }}/><p className={styles.header_p} >TOP</p>   
                                </div>
                            </div>
                        </Link>
                        <Link to ="/notification" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_body}>
                                <div className={styles.home_header_contents}>
                                <Badge badgeContent={ncount} color="secondary">
                                    <NotificationsIcon style={{ fontSize: 40 }}/><p className={styles.header_p}>通知</p>
                                </Badge>
                                </div>
                            </div>
                        </Link>
                        <Link to ="/timeline" className={styles.header_link} onClick={()=>{window.scrollTo(0, 0);}}>
                            <div className={styles.header_contents_body}>
                                <div className={styles.home_header_contents}> 
                                    <TimelineIcon style={{ fontSize: 40 }}/><p className={styles.header_p}>プラン</p>
                                </div>
                            </div>
                        </Link>
                        <div className={styles.header_contents_body}>
                            <div className={styles.home_header_contents}> 
                                <NewPlan/> 
                                <Button className={styles.header_new_plan_btn} variant="outlined" color="primary"
                                    onClick={() => {
                                    dispatch(setOpenNewPlan());
                                    }}
                                >
                                    {isBigScreen && <p className={styles.header_p}>プランを投稿する</p>}
                                    {mediaquery && <PostAddIcon/>}
                                </Button>
                            </div>
                        </div>
                        
                    </div>
                    
                    
                    <div className={styles.header_profile}>
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
                    {mediaquerymin && 
                        <div className={styles.header_profile_min}>
                        <div className={styles.home_header_avater}>
                            <Link to ={"/profile/"+profile.userProfile}>
                                <button className={styles.homr_btnprofile} >
                                    <Avatar alt="who?" src={profile.img} style={{height:'38px',width:'38px'}}/>
                                </button>
                            </Link>
                        </div>
                        <div className={styles.header_nickname_min}>
                            <p className={styles.nickname_p_min}>{profile.nickName}</p>  
                        </div> 
                    </div>}

                </div>
            </div>
        </>
    )
}

export default Header
