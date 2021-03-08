import React,{useEffect}from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import {Link,useLocation} from 'react-router-dom';
import styles from "./Comment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { COMMENT } from '../types';
import { AppDispatch } from "../../app/store";
import {fetchAsyncCommentDelete,selectCommentProfiles,fetchAsyncCommentProfile}from '../comment/commentSlice'
import {selectProfile} from "../auth/authSlice";
import { Avatar,Button,TextField} from "@material-ui/core";

const Comment:React.FC<COMMENT> = (comment) => {
    const dispatch: AppDispatch = useDispatch();
    const commentprofs =useSelector(selectCommentProfiles);
    const profile = useSelector(selectProfile);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncCommentProfile(comment.userComment));
              }
            };
            fetchLoader();
    },[dispatch]);

    return (
        <>
          <div className={styles.post_comment}>
            <Link to ={"/profile/"+comment.userComment}>
                <button className={styles.plan_btnprofile} onClick={()=>{}}>
                    <Avatar src={commentprofs.find((prof) => prof.userProfile === comment.userComment)?.img}/>         
                </button>
            </Link>
            { commentprofs.find((prof) => (
                prof.userProfile === comment.userComment
            ))?.nickName}
            <br/>
            {comment.text}
            <div key={comment.id}>
                {comment.userComment===profile.userProfile?
                    <>
                        <button onClick={()=>{dispatch(fetchAsyncCommentDelete(comment.id))}}>
                        <DeleteIcon />
                        </button>
                    </>
                :null}
            </div>  
          </div>  
        </>
    )
}

export default Comment
