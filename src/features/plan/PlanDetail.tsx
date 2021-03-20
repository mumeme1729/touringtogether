import React,{useEffect,useState} from 'react'
import { Avatar,Button,TextField,CircularProgress} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_PLANS } from '../types';
import styles from "./Plan.module.css";
import Comment from "../comment/Comment";
import {selectProfile,fetchAsyncSelectProfile,selectSelectedProfile,startProfileLoad} from "../auth/authSlice";
import {Link,useLocation} from 'react-router-dom';
import {
    selectSelectedPlan,
    fetchAsyncPlanDelete,
    fetchAsyncGetSelectPlan,
    startLoad,
    endLoad,
    selectLoadPlan
} from "../plan/planSlice";

  
import {
    selectComments,
    fetchAsyncGetComments,
    fetchAsyncPostComment,
    startLoadComment,
    endLoadComment,
    selectIsLoadComment,
}from '../comment/commentSlice';
import DeleteIcon from '@material-ui/icons/Delete';
import {fetchAsyncPostNotification} from '../notification/notificationSlice';

const PlanDetail:React.FC< PROPS_PLANS> = () => {
    const selectedProfile=useSelector(selectSelectedProfile);
    const plan=useSelector(selectSelectedPlan);
    const myprofile = useSelector(selectProfile);
    const comments=useSelector(selectComments);
    const dispatch: AppDispatch = useDispatch();
    const [text, setText] = useState("");
    const location = useLocation();
    const id=(location.pathname.split('/'));
    const isloadcomment=useSelector(selectIsLoadComment);
    const isloadplan=useSelector(selectLoadPlan);

    const postComment = async () => {
        const packet = { text: text, plan: plan.id,profile:myprofile };
        await dispatch(fetchAsyncPostComment(packet));
        setText("");
      };

    //通知
    const addNotification=async()=>{
        const packet={status:true,receive:plan.userPlan,send:myprofile.userProfile,targetplan:plan.id}
        await dispatch(fetchAsyncPostNotification(packet));
    }

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                dispatch(startLoad());
                await dispatch(fetchAsyncGetSelectPlan(id[3])); 
                await dispatch(fetchAsyncSelectProfile(id[2]));
                dispatch(endLoad());
                dispatch(startLoadComment());
                await dispatch(fetchAsyncGetComments(id[3]));
                dispatch(endLoadComment());
                
            }
            };
            fetchLoader();
    },[dispatch]);


    return (
        <>
        <div className={styles.plandetail_title}>
                <h2 className={styles.title_h2}>プラン</h2>
        </div>
        <br/>  
        <br/>
        
        {isloadplan?
            <CircularProgress/>
            :<div className={styles.plan_detail_container}>
                <div className={styles.plan_body}>
                    <button className={styles.plan_btnprofile} onClick={()=>dispatch(startProfileLoad())}>
                        <Link to ={"/profile/"+selectedProfile.userProfile}> 
                            <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>{" "}
                        </Link> 
                    </button>
                        
                    {selectedProfile.nickName}
                    <h2>目的地:{plan.destination}</h2>
                    <h3>出発予定日:{plan.date}</h3>
                    <p>{plan.text}</p>
                    {plan.img!==null?
                        <img src={plan.img} className={styles.plan_img} alt="" />
                    :null}
                        
                    {plan.userPlan===myprofile.userProfile?
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
        }
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
                onClick={()=>{
                    postComment();
                    addNotification();
                }}
            >
                コメントを投稿
            </button>
        </div>  
        <br/>
        <div>
            {isloadcomment?
                <CircularProgress/>
            :
                <div className={styles.post_comments}>
                {comments.map((comment) => (
                    <Comment key={comment.id} id={comment.id} text={comment.text} userComment={comment.userComment} plan={comment.plan} profile={comment.profile}/>        
                ))} 
                </div>
            }
        </div>
    </>
    )
}

export default PlanDetail

