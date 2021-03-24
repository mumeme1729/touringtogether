import React,{useEffect,useState} from 'react'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import { AppDispatch } from "../../app/store";
import { useDispatch,useSelector } from "react-redux";
import {fetchAsyncAddLikes,fetchAsyncGetLikesCount,fetchAsyncLikeDelete} from "./planSlice";
import {selectProfile}from '../auth/authSlice';
import { yellow } from '@material-ui/core/colors';


const Likes:React.FC<any> = (plan) => {
    const dispatch: AppDispatch = useDispatch();
    const loginUser=useSelector(selectProfile);
    const [count,setCount]=useState(0);
    const [flag,setFlag]=useState(false);
    const [likesId,setId]=useState(0);

    useEffect(()=>{
        let unmounted = false;
        const fetchLoader = async ()=>{
            if (localStorage.localJWT && plan.id!==0) {
                const likescount=await dispatch(fetchAsyncGetLikesCount(plan.id));
                if(!unmounted){setCount(likescount.payload.length)};
                const f=likescount.payload.filter((like:any)=>{
                    return  (like.plan===plan.id) && (loginUser.userProfile===like.userLikes)
                });
                if(f.length!==0){
                    if(!unmounted){setFlag(true)};
                    if(!unmounted){setId(f[0].id)};
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
        const packet={plan:plan.id,userLikes:loginUser.userProfile}
        const a=await dispatch(fetchAsyncAddLikes(packet));
        setId(a.payload.id);
        setFlag(true);
        setCount(count+1);
    }

    const deleteLikes=async()=>{
        await dispatch(fetchAsyncLikeDelete(likesId));
        setCount(count-1);
        setFlag(false);
    }

    return (
        <div>
            {!flag?
                <div>
                    <button onClick={()=>addLikes()}>
                        <StarBorderIcon />
                    </button>
                {count}
                </div>
            :
                <div>
                    <button onClick={()=>deleteLikes()}>
                        <StarIcon style={{ color: yellow[900], }}/>
                    </button>
                    {count}
                </div>
            }
        </div>
    )
}

export default Likes
