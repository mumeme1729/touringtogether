import React,{useEffect} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectNotifications,
        fetchAsyncUpdateStatus,
        fetchAsyncGetNotification,setCount, 
        setNextPageNotification,
        fetchAsyncNotificationPage,
        selectNotificationNextPage
    } from "../notification/notificationSlice";
import {Avatar} from "@material-ui/core";
import {Link} from 'react-router-dom';
import UseInfiniteScroll from '../home/UseInfiniteScroll';
import styles from "./Notification.module.css";
const apiUrl = process.env.REACT_APP_DEV_API_URL;
const Notification:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const notification=useSelector(selectNotifications);
    const nextpage=useSelector(selectNotificationNextPage);
    const [isFetching, setIsFetching] = UseInfiniteScroll(fetchMoreListItems);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                notification.map(async(n)=>{
                    if(n.status && n.id!==0){
                       await dispatch(fetchAsyncUpdateStatus(n));
                    }
                    window.scrollTo(0, 0);
                });
                await dispatch(fetchAsyncGetNotification());//通知を取得
                dispatch(setCount(0));
            };
        };
        fetchLoader();
    },[dispatch]);

    
    async function fetchMoreListItems() {
        if(nextpage!==null){
            const a=await dispatch(fetchAsyncNotificationPage(nextpage));
            dispatch(setNextPageNotification(a.payload.results));
        }
        setIsFetching(false)
  }
   
    return (
            <div className={styles.notification_container}>
                <div className={styles.notification_body}>
                <div className={styles.notification_title}>
                    <h2 className={styles.title_h2}>通知</h2>
                </div>
                <br/>  
                <br/>
                <div className={styles.notification_min}>
                {React.Children.toArray(
                notification.map((noti)=>(
                    noti.targetplan!==null?(
                        <>
                            <div  className={styles.notification_detail_container}>
                                <div className={styles.notification_detail_body}>
                                    <div className={styles.notification_profile_icon}>
                                        <Link to ={"/profile/"+noti.profile.userProfile} >
                                            <div className={styles.notification_profile}>
                                                {noti.profile.img!==null?
                                                    <Avatar alt="who?" src={apiUrl+noti.profile.img.substr(1)} style={{height:'50px',width:'50px'}}/> 
                                                :
                                                    <Avatar alt="who?" src={""} style={{height:'50px',width:'50px'}}/>
                                                }
                                            </div> 
                                        </Link> 
                                    </div>
                                    <div className={styles.notification_text_container}>
                                        <Link to={'/plandetail/'+noti.receive+'/'+noti.targetplan} className={styles.notification_link}> 
                                            <div className={styles.notification_text}>       
                                                <p className={styles.notification_text_p}>{noti.profile.nickName}</p> 
                                                <div className={styles.notification_text_comment}>
                                                    <p>さんがコメントしました。</p>
                                                </div>   
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    ):
                        <>
                            <div className={styles.notification_detail_container}>
                            <div className={styles.notification_detail_body}>
                                <Link to ={"/profile/"+noti.profile.userProfile} className={styles.notification_link}>
                                    <div className={styles.notification_body}>
                                        <div className={styles.notification_profile_icon}>
                                            {noti.profile.img!==null && noti.id!==0?
                                                <Avatar alt="who?" src={apiUrl+noti.profile.img.substr(1)} style={{height:'50px',width:'50px'}}/>
                                                :
                                                <Avatar alt="who?" src={""} style={{height:'50px',width:'50px'}}/>
                                                }     
                                        </div>
                                        <div className={styles.notification_text}>
                                            <div className={styles.notification_text_nickname}>
                                                <p className={styles.notification_text_p}>{noti.profile.nickName}</p>
                                            </div>
                                            <div className={styles.notification_text_text}>
                                                <p>さんにフォローされました。</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                </div>
                            </div>
                        </>
                )) )}
                </div>
                </div> 
            </div>
        )
}

export default Notification
