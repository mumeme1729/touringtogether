import React,{useEffect,useState} from 'react'
import { Avatar,Button,TextField} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_PROFILE,PROPS_ALL_USER, PROPS_PLANS } from '../types';
import styles from "./Plan.module.css";
import {selectProfiles,selectUserProfile,selectProfile} from "../auth/authSlice";
import {Link} from 'react-router-dom';
import {
    selectPlan,
    selectSelectedPlan,
    selectComments,
    fetchAsyncGetComments,
    fetchAsyncPostComment,
    fetchAsyncCommentDelete,
    fetchAsyncPlanDelete
} from "../plan/planSlice";
import DeleteIcon from '@material-ui/icons/Delete';


const PlanDetail:React.FC< PROPS_PLANS> = () => {
    const allprofiles = useSelector(selectProfiles);
    const plan=useSelector(selectSelectedPlan);
    const profile = useSelector(selectProfile);
    const comments=useSelector(selectComments);
    const dispatch: AppDispatch = useDispatch();
    const [text, setText] = useState("");

    //プランの投稿者のプロフィールを取得
    const prof=allprofiles.filter((p)=>{
        return plan.userPlan===p.userProfile;
    });

    //プランごとのコメントを分ける
    const commentsOnPlan = comments.filter((comment) => {
        return comment.plan === plan.id;
      });

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
                dispatch(fetchAsyncGetComments());
                //ログインしているユーザーデータをとる？ 
              }
            };
            fetchLoader();
    },[dispatch]);


    return (
        <>
        <div className={styles.plan_detail_container}>
            <div className={styles.plan_body}>
                        <button className={styles.plan_btnprofile} onClick={()=>{dispatch(selectUserProfile(prof[0]));}}>
                        <Link to ={"/profile/"+prof[0]?.userProfile}> 
                            <Avatar alt="who?" src={prof[0]?.img} style={{height:'70px',width:'70px'}}/>{" "}
                         </Link> 
                        </button>
                    
                    {prof[0]?.nickName}
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
                    {commentsOnPlan.map((comment) => (
                        <div key={comment.id} className={styles.post_comment}>
                             <Link to ={"/profile/"+allprofiles.find((prof) => prof.userProfile === comment.userComment)?.userProfile}>
                                <button className={styles.plan_btnprofile} onClick={()=>{dispatch(selectUserProfile(allprofiles.find((prof) => prof.userProfile === comment.userComment)));}}>
                                    <Avatar src={allprofiles.find((prof) => prof.userProfile === comment.userComment)?.img}/>
                                </button>
                             </Link>
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
                    ))}
            </div>
        </div>
    </>
    )
}

export default PlanDetail

