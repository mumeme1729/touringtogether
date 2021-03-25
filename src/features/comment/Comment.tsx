import React,{useEffect}from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import {Link,useLocation} from 'react-router-dom';
import styles from "./Comment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { COMMENT,COMMENT_PROFILE } from '../types';
import { AppDispatch } from "../../app/store";
import {fetchAsyncCommentDelete}from './commentSlice'
import {selectProfile,startProfileLoad} from "../auth/authSlice";
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
            <div className={styles.comment_container_back}>
                <div className={styles.comment_container}>
                    <div className={styles.comment_left}>
                        <Link to ={"/profile/"+comment.userComment}>
                            <button className={styles.comment_avatar_btn} onClick={()=>{dispatch(startProfileLoad());}}>
                                {imgpath!==apiUrl?
                                    <Avatar alt="who?" src={imgpath} style={{height:'50px',width:'50px'}}/>
                                :null} 
                            </button>
                        </Link>
                    </div>
                    <div className={styles.comment_right}>
                        <div className={styles.comment_nickname}>
                            { comment.profile.nickName}
                            {comment.userComment===profile.userProfile?
                                <div className={styles.comment_delete_icon}>
                                    <button className={styles.comment_avatar_btn} onClick={()=>{dispatch(fetchAsyncCommentDelete(comment.id))}}>
                                        <DeleteIcon style={{ fontSize: 20 }}/>
                                    </button>
                                </div>
                            :null}
                        </div>
                        <p className={styles.comment_text_p}>{comment.text}</p>
                    </div>  
                </div>  
            </div>
        </>
    )
}

export default Comment
