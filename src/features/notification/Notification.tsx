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
                console.log('通知既読')
                notification.map(async(n)=>{
                    if(n.status && n.id!==0){
                       await dispatch(fetchAsyncUpdateStatus(n));
                    }
                });
                console.log('取得')
                await dispatch(fetchAsyncGetNotification());//通知を取得
        
                dispatch(setCount(0));
            };
        };
        fetchLoader();
    },[dispatch]);
   
    return (
        <div>
            {notification.map((noti)=>(
                noti.targetplan!==null?(
                    <>
                        <div className={styles.notification_detail_container}>
                            <div className={styles.notification_body}>
                                <Link to={'/plandetail/'+noti.receive+'/'+noti.targetplan} >
                                {noti.profile.img!==null?
                                    
                                    <Avatar alt="who?" src={apiUrl+noti.profile.img.substr(1)} style={{height:'50px',width:'50px'}}/> 
                                :
                                    <Avatar alt="who?" src={""} style={{height:'50px',width:'50px'}}/>
                                }         
                                    {noti.profile.nickName}さんがコメントしました。
                                    
                                </Link>
                            </div>
                        </div>
                    </>
                ):
                    <>
                        <div className={styles.notification_detail_container}>
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
