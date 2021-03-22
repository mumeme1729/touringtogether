import React,{useEffect,useState} from 'react'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { AppDispatch } from "../../app/store";
import { useDispatch,useSelector } from "react-redux";
import {fetchAsyncAddLikes,fetchAsyncGetLikesCount} from "./planSlice";
import {selectProfile}from '../auth/authSlice';
import {PROPS_LIKES} from '../types'

const Likes:React.FC<any> = (plan) => {
    const dispatch: AppDispatch = useDispatch();
    const loginUser=useSelector(selectProfile);
    const [count,setCount]=useState(0);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT && plan.id!==0) {
                const likescount=await dispatch(fetchAsyncGetLikesCount(plan.id));
                console.log(likescount.payload.length);
                setCount(likescount.payload.length);
              }
            };
            fetchLoader();
    },[plan]);

    const addLikes=async()=>{
        const packet={plan:plan.id,userLikes:loginUser.userProfile}
        const a=await dispatch(fetchAsyncAddLikes(packet)).catch();
        setCount(count+1);
    }

    return (
        <div>
            <button onClick={()=>addLikes()}>
                <StarBorderIcon/>
            </button>
            {count}
        </div>
    )
}

export default Likes
