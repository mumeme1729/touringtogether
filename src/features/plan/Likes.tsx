import React,{useEffect,useState} from 'react'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { AppDispatch } from "../../app/store";
import { useDispatch,useSelector } from "react-redux";
import {fetchAsyncAddLikes,fetchAsyncLikeDelete} from "./planSlice";
import {selectProfile}from '../auth/authSlice';
import { yellow } from '@material-ui/core/colors';
import {PLAN_LIKES} from '../types';
import styles from "./Plan.module.css";
import { NONAME } from 'node:dns';

const Likes:React.FC<PLAN_LIKES> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const loginUser=useSelector(selectProfile);
    const [count,setCount]=useState(props.likes.length);
    const [flag,setFlag]=useState(false);
    const [likesId,setId]=useState(0);

    useEffect(()=>{
        let unmounted = false;
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                const like=props.likes.filter((l)=>{
                    return l.userLikes===loginUser.userProfile
                });
                if(like.length!==0){
                    if(!unmounted){setFlag(true)};
                    if(!unmounted){setId(like[0].id)};
                }else{
                    if(!unmounted){setFlag(false)};
                };
            }
        };    
        fetchLoader();   
        return () => {
            unmounted=true;
        }
    },[dispatch]);
    

    const addLikes=async()=>{
        const packet={plan:props.planid,userLikes:loginUser.userProfile}
        const a=await dispatch(fetchAsyncAddLikes(packet));
        setFlag(true);
        setId(a.payload.id);
        setCount(count+1);
    }

    const deleteLikes=async()=>{
        console.log('クリック')
        console.log(props)
        console.log('デリート')
        await dispatch(fetchAsyncLikeDelete(likesId));
        setCount(count-1);
        setFlag(false);
        
    }

    return (
        <div>
            {!flag?
                <div>
                    <button className={styles.likes_btn} onClick={()=>addLikes() }>
                        <StarBorderIcon />
                    </button>
                {count}
                </div>
            :
                <div>
                    <button className={styles.likes_btn} onClick={()=>deleteLikes()}>
                        <StarIcon style={{ color: yellow[900],}}/>
                    </button>
                    {count}
                </div>
            }
        </div>
    )
}

export default Likes
