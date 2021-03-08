import React,{useEffect,useState} from 'react'
import { Avatar,Button,TextField} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_PLANS } from '../types';
import styles from "./Plan.module.css";
import Comment from "../comment/Comment";
import {selectProfile,fetchAsyncSelectProfile,selectSelectedProfile} from "../auth/authSlice";
import {Link,useLocation} from 'react-router-dom';
import {
    selectSelectedPlan,
    fetchAsyncPlanDelete,
    fetchAsyncGetSelectPlan,
} from "../plan/planSlice";

import {
    selectComments,
    fetchAsyncGetComments,
    fetchAsyncPostComment,
    fetchAsyncCommentDelete,
}from '../comment/commentSlice'
import DeleteIcon from '@material-ui/icons/Delete';


const PlanDetail:React.FC< PROPS_PLANS> = () => {
    const selectedProfile=useSelector(selectSelectedProfile);
    const plan=useSelector(selectSelectedPlan);
    const profile = useSelector(selectProfile);
    const comments=useSelector(selectComments);
    const dispatch: AppDispatch = useDispatch();
    const [text, setText] = useState("");
    const location = useLocation();
    const id=(location.pathname.split('/'));

    const postComment = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { text: text, plan: plan.id };
        await dispatch(fetchAsyncPostComment(packet));
        setText("");
      };

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetComments(id[3]));
                await dispatch(fetchAsyncSelectProfile(id[2]));
                await dispatch(fetchAsyncGetSelectPlan(id[3])); //投稿主のプロフィールを取得
              }
            };
            fetchLoader();
    },[dispatch]);


    return (
        <>
        <div className={styles.plan_detail_container}>
            <div className={styles.plan_body}>
                        <button className={styles.plan_btnprofile} onClick={()=>{}}>
                        <Link to ={"/profile/"+selectedProfile.userProfile}> 
                            <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>{" "}
                         </Link> 
                        </button>
                    
                    {selectedProfile.nickName}
                    <h2>目的地:{plan.destination}</h2>
                    <h3>出発予定日:{plan.date}</h3>
                    <p>{plan.text}</p>
                    
                    {plan.userPlan===profile.userProfile?
                                    <>
                                    <Link to ={"/"}> 
                                        <button onClick={()=>{dispatch(fetchAsyncPlanDelete(plan.id))}}>
                                            <DeleteIcon />
                                        </button>
                                    </Link> 
                                    </>
                                :null}
        
            </div>                
        </div>
        <div>
            <TextField
                placeholder="コメント"
                type="text"
                defaultValue={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                disabled={!text.length}
                className={styles.post_button}
                type="submit"
                onClick={postComment}
            >
                コメントを投稿
            </button>
            </div>  
            <br/>
            <div>
                <div className={styles.post_comments}>
                    {comments.map((comment) => (
                        <Comment key={comment.id} id={comment.id} text={comment.text} userComment={comment.userComment} plan={comment.plan}/>
                    ))}
            </div>
        </div>
    </>
    )
}

export default PlanDetail

