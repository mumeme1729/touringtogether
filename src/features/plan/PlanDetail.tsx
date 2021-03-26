import React,{useEffect,useState} from 'react'
import { Avatar,Button,TextField,CircularProgress} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_PLANS } from '../types';
import styles from "./Plan.module.css";
import Comment from "../comment/Comment";
import Likes from './Likes';
import EditPlan from "./EditPlan";
import {selectProfile,fetchAsyncSelectProfile,selectSelectedProfile,startProfileLoad} from "../auth/authSlice";
import {Link,useLocation} from 'react-router-dom';
import {
    selectSelectedPlan,
    fetchAsyncPlanDelete,
    fetchAsyncGetSelectPlan,
    startLoad,
    endLoad,
    selectLoadPlan,
    selectPrefectures,
    fetchAsyncSearchPlans,
    setPlanImage,
    setOpenImage,
    setOpenEditPlan,
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
import EditIcon from '@material-ui/icons/Edit';
import {fetchAsyncPostNotification} from '../notification/notificationSlice';

const apiUrl = process.env.REACT_APP_DEV_API_URL

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
    const prefectures=useSelector(selectPrefectures);

    const postComment = async () => {
        const packet = { text: text, plan: plan.id,profile:myprofile };
        await dispatch(fetchAsyncPostComment(packet));
        setText("");
      };
      let imgpath=""
      if(plan.profile.img!==null){
          if((plan.profile.img)[0]!=='h'){
              imgpath=apiUrl+(plan.profile.img).substr(1);
          }else{
              imgpath=plan.profile.img;
          }
      }

    //通知
    const addNotification=async()=>{
        const packet={status:true,receive:plan.userPlan,send:myprofile.userProfile,targetplan:plan.id}
        await dispatch(fetchAsyncPostNotification(packet));
        if(plan.userPlan==myprofile.userProfile){
            const comment=comments.map((com)=>{
                return com.userComment;
            });
            const setComment=Array.from(new Set(comment));
            setComment.map(async(setcom)=>{
                if(setcom!==myprofile.userProfile){
                    const packet2= {status:true,receive:setcom,send:myprofile.userProfile,targetplan:plan.id}
                    await dispatch(fetchAsyncPostNotification(packet2));
                };
            });
        }
    }

    const prefecture=prefectures.filter((p)=>{
        return p.id===Number(plan.prefecture);
    })

    const setImage=(image:string)=>{
        dispatch(setPlanImage(image));
        dispatch(setOpenImage());
    }

    const searchPlan =async()=>{
        const packet = { destination: "", date: "",prefecture:String(plan.prefecture)};
        await dispatch(fetchAsyncSearchPlans(packet));
    }

    const likeProps={
        likes:plan.likes,
        planid:plan.id,
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
                <div className={styles.plan_body_top}>
                    <div className={styles.plan_body_left}>
                            <Link to ={"/profile/"+plan.profile.userProfile} onClick={()=>dispatch(startProfileLoad())} className={styles.plan_btn}> 
                                <div className={styles.plan_profile}>
                                    {imgpath!==apiUrl?
                                        <Avatar alt="who?" src={imgpath} style={{height:'50px',width:'50px'}}/>
                                    :null}
                                    <div className={styles.plan_profile_nickname}>
                                        {plan.profile.nickName}
                                        <div className={styles.plan_title}>
                                            <h2>{plan.title}</h2>
                                        </div>
                                    </div>
                                </div>
                            </Link> 
                            <div className={styles.plan_description}>
                                <br/>
                                <p className={styles.plandetail_description_p}>目的地    : {plan.destination}</p>
                                <p className={styles.plandetail_description_p}>出発予定日: {plan.date}</p>
                                <p className={styles.plandetail_description_p}>出発地    : {plan.departure}</p>
                                <p>{plan.text}</p>
                            </div>
                    </div>
                    <div className={styles.plan_body_right}>
                        {plan.userPlan===myprofile.userProfile?
                            <>
                                <div className={styles.plandetail_edit_container}>
                                    <button className={styles.plandetail_delete_btn} onClick={()=>{dispatch(setOpenEditPlan())}}>
                                        <EditIcon style={{fontSize:25}}/>
                                    </button>
                                    <EditPlan/>
                                    <Link to ={"/"}> 
                                        <button className={styles.plandetail_delete_btn} onClick={()=>{dispatch(fetchAsyncPlanDelete(plan.id))}}>
                                            <DeleteIcon style={{ fontSize: 25 }}/>
                                        </button>
                                    </Link>
                                </div> 
                            </>
                        :null}
                        <div className={styles.plan_likes}>
                            <Likes {...likeProps} /> 
                        </div>
                        <div className={styles.plan_prefecture_container}>
                            <Link to ={'/search/'+'destination='+'/'+'date='+'/'+'prefecture='+String(prefecture[0]?.id)}>
                                <div className={styles.plan_prefecture_div}>
                                    <p onClick={searchPlan} className={styles.plan_prefecture}>{prefecture[0]?.name}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                {plan.img!==null?
                    <img src={plan.img} className={styles.plan_img} alt=""  onClick={()=>{setImage(plan.img)}}/>     
                :null}
            </div> 
        </div>
            
        }
        <br/>
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

