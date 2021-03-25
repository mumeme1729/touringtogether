import React,{useEffect} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {selectNotifications,fetchAsyncUpdateStatus,fetchAsyncGetNotification,setCount} from "../notification/notificationSlice";
import {Avatar} from "@material-ui/core";
import {Link} from 'react-router-dom';
import styles from "./Notification.module.css";
const apiUrl = process.env.REACT_APP_DEV_API_URL;
const Notification:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const notification=useSelector(selectNotifications);
    
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                notification.map(async(n)=>{
                    if(n.status && n.id!==0){
                       await dispatch(fetchAsyncUpdateStatus(n));
                    }
                });
                await dispatch(fetchAsyncGetNotification());//通知を取得
                dispatch(setCount(0));
            };
        };
        fetchLoader();
    },[dispatch]);
   
    return (
        <div>
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>通知</h2>
            </div>
            <br/>  
            <br/>
            {notification.map((noti)=>(
                noti.targetplan!==null?(
                    <>
                        <div key={noti.id} className={styles.notification_detail_container}>
                            <div className={styles.notification_body}>
                                <Link to={'/plandetail/'+noti.receive+'/'+noti.targetplan} >
                                    <Link to ={"/profile/"+noti.profile.userProfile}>
                                        <div className={styles.notification_profile}>
                                            {noti.profile.img!==null?
                                                <Avatar alt="who?" src={apiUrl+noti.profile.img.substr(1)} style={{height:'50px',width:'50px'}}/> 
                                            :
                                                <Avatar alt="who?" src={""} style={{height:'50px',width:'50px'}}/>
                                            }
                                            {noti.profile.nickName}
                                        </div> 
                                    </Link>        
                                        {noti.profile.nickName}さんがコメントしました。    
                                </Link>
                            </div>
                        </div>
                    </>
                ):
                    <>
                        <div key={noti.id+noti.profile.id}  className={styles.notification_detail_container}>
                            <div className={styles.notification_body}>
                                <Link to ={"/profile/"+noti.profile.userProfile}>
                                      {noti.profile.img!==null && noti.id!==0?
                                         <Avatar alt="who?" src={apiUrl+noti.profile.img.substr(1)} style={{height:'50px',width:'50px'}}/>
                                        :
                                        <Avatar alt="who?" src={""} style={{height:'50px',width:'50px'}}/>
                                        } 
                                        {noti.profile.nickName}さんにフォローされました。
                                </Link>
                            </div>
                         </div>
                    </>
            ))}  
        </div>
    )
}

export default Notification
