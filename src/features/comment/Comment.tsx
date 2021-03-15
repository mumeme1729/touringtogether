import React,{useEffect}from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import {Link,useLocation} from 'react-router-dom';
import styles from "./Comment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { COMMENT,COMMENT_PROFILE } from '../types';
import { AppDispatch } from "../../app/store";
import {fetchAsyncCommentDelete}from './commentSlice'
import {selectProfile} from "../auth/authSlice";
import { Avatar,Button,TextField} from "@material-ui/core";

const apiUrl = process.env.REACT_APP_DEV_API_URL

const Comment:React.FC<COMMENT_PROFILE> = (comment) => {
    const dispatch: AppDispatch = useDispatch();
    const profile = useSelector(selectProfile);
    let imgpath=""
    if((comment.profile.img)[0]!=='h'){
        imgpath=apiUrl+(comment.profile.img).substr(1);
    }else{
        imgpath=comment.profile.img;
    }
  
    return (
        <>
          <div className={styles.post_comment}>
            <Link to ={"/profile/"+comment.userComment}>
                <button className={styles.plan_btnprofile} onClick={()=>{}}>
                    {imgpath!==apiUrl?
                        <Avatar alt="who?" src={imgpath} style={{height:'50px',width:'50px'}}/>
                    :null}         
                </button>
            </Link>
            { comment.profile.nickName}
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
