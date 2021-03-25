import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { 
    selectSelectedProfile,
    selectProfile,
    setOpenSignIn,
    setOpenEditProfile,
    fetchAsyncSelectProfile,
    selectIsLoadingProfile,
    startProfileLoad,
    endProfileLoad,
    selectmyFollowingProfile,
    fetchAsyncGetmyFollowingProfile
} from "../auth/authSlice";

import { RELATION } from "../types";
import { Avatar,Button,CircularProgress} from "@material-ui/core";
import AddLocationIcon from '@material-ui/icons/AddLocation';
import styles from "./User.module.css";
import { AppDispatch } from "../../app/store";
import EditProfile from './EditProfile';
import RelationShip from '../relationship/relationShip';
import {Link,useLocation} from 'react-router-dom';
import UserPlan from "./UserPlan";
import {
    addRelation,
    fetchAsyncGetFollowingProfile,
    fetchAsyncGetFollowerProfile,
    fetchAsyncGetRelationId,
    } from "../relationship/RelationshipSlice";

import {
    selectUserPlan,
    fetchAsyncGetUserPlan,
    fetchAsyncCommentPlan,
    fetchAsyncLikedPlans,
    setCommentPlan,
    resetCommentPlan,
    selectIsOpenUserPlan,
    selectCommentPlan,
    selectLikedPlans
}from "./userSlice";

const UserProfile:React.FC = () => {
    const selectedProfile=useSelector(selectSelectedProfile);//対象のユーザーのプロフィール
    const loginUser=useSelector(selectProfile);
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const user_id=(location.pathname.substr(9));
    const isLoadProfile=useSelector(selectIsLoadingProfile);
    const myfollowing = useSelector(selectmyFollowingProfile);//ログインしているユーザーのフォローしている人
    const userplan = useSelector(selectUserPlan);
    const isopenuserplan=useSelector(selectIsOpenUserPlan);
    const commentplan =useSelector(selectCommentPlan);
    const likedplans=useSelector(selectLikedPlans);
    
    const [isopenplan,setOpenPlan]=useState(true);
    const [isopencommentplan,setOpenCommentPlan]=useState(false);
    const [isopenlikedplan,setOpenLikedPlan]=useState(false);
    
    useEffect(() => {
        const fetchLoader = async ()=>{ 
            if (localStorage.localJWT) {
                dispatch(startProfileLoad());
                await dispatch(fetchAsyncSelectProfile(user_id));
                dispatch(addRelation({following:user_id}));
                //リロード時に使用
                await dispatch(fetchAsyncGetFollowerProfile(user_id));
                await dispatch(fetchAsyncGetFollowingProfile(user_id));
                const relation:RELATION={userFollow:loginUser.userProfile,following:user_id}
                if(relation.userFollow!==0 && relation.following!=='0'){
                    await dispatch(fetchAsyncGetRelationId(relation));
                }
                //リロード用
                if(myfollowing[0]?.id===0){
                    await dispatch(fetchAsyncGetmyFollowingProfile());
                }

                await dispatch(fetchAsyncGetUserPlan(user_id));
                await dispatch(fetchAsyncCommentPlan(user_id));
                await dispatch(fetchAsyncLikedPlans(user_id));
                dispatch(setCommentPlan());
                dispatch(endProfileLoad());
            }
        };
        fetchLoader();
    },[user_id]);


    return (
        <>  <div className={styles.profile_title}>
                <h2 className={styles.title_h2}>プロフィール</h2>
            </div>
            <br/>
            <br/>
            {isLoadProfile?
            <>
                <CircularProgress/>
            </>
            :<>
                <div className={styles.profileDetail}>
                    <div className={styles.profileDetail_container}>
                        { loginUser.id== selectedProfile.id?(
                            <>
                                <div className={styles.profile_container_top}>
                                    <div className={styles.profile_container_top_left}>
                                        <div className={styles.detail_avatar}>
                                            <div className={styles.profile_avatar_img}>
                                                <Avatar alt="who?" src={loginUser.img} style={{height:'70px',width:'70px'}}/>{" "}
                                            </div>
                                            <div className={styles.profile_nickname}>
                                                <h2 className={styles.nickname_h2}>{loginUser.nickName}</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.profile_container_top_right}>
                                        <div className={styles.logout_btn}>
                                            <div className={styles.logout_btn_left}>
                                                <Link to ="/">
                                                    <Button variant="outlined" color="primary" onClick={() => {
                                                        localStorage.removeItem("localJWT");
                                                        dispatch(setOpenSignIn());
                                                    }}
                                                    >Logout</Button>
                                                </Link>
                                            </div>
                                            <div className={styles.logout_btn_right}>
                                                <Button variant="outlined" color="primary" onClick={() => {
                                                        dispatch(setOpenEditProfile());
                                                    }}
                                                >編集</Button>
                                                <EditProfile/>
                                            </div>
                                        </div>
                                        <div className={styles.relationship}>
                                            <RelationShip 
                                                key={loginUser.id} 
                                                id={loginUser.id} 
                                                nickName={loginUser.nickName} 
                                                text={loginUser.text} 
                                                userProfile={loginUser.userProfile} 
                                                created_on={loginUser.created_on} 
                                                img={loginUser.img} 
                                                base={loginUser.base} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.profile_container_bottom}>   
                                    <div className={styles.profile_description}>
                                        <p className={styles.profile_text_p}>{loginUser.text}</p>
                                        <div className={styles.profile_base}>
                                            <div className={styles.profile_base_icon}>
                                                <AddLocationIcon style={{ fontSize: 22 }}/>
                                            </div>
                                            <p className={styles.profile_base_p} >{loginUser.base}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ): 
                        <>
                            {/* ログインしているユーザー以外 */}
                            <div className={styles.profile_container_top}>
                                <div className={styles.profile_container_top_left}>
                                    <div className={styles.detail_avatar}>
                                        <div className={styles.profile_avatar_img}>
                                            <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>
                                        </div>
                                        <div className={styles.profile_nickname}>
                                            <h2 className={styles.nickname_h2}>{selectedProfile.nickName}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.profile_container_top_right}>
                                        <div className={styles.relationship}>
                                            <RelationShip 
                                                key={selectedProfile.id} 
                                                id={selectedProfile.id} 
                                                nickName={selectedProfile.nickName} 
                                                text={selectedProfile.text} 
                                                userProfile={selectedProfile.userProfile} 
                                                created_on={selectedProfile.created_on} 
                                                img={selectedProfile.img} 
                                                base={selectedProfile.base} 
                                            />
                                        </div>
                                </div>
                            </div>
                            <div className={styles.profile_container_bottom}>
                                <div className={styles.profile_description}>
                                    <p className={styles.profile_text_p}>{selectedProfile.text}</p>
                                    <div className={styles.profile_base}>
                                        <div className={styles.profile_base_icon}>
                                        <AddLocationIcon style={{ fontSize: 22 }}/>
                                        </div>
                                        <p className={styles.profile_base_p}>{selectedProfile.base}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                        }

                        <div className={styles.profile_plan_choose}>
                            <div className={styles.profile_plan_choose_btn}>
                                <button className={styles.plan_switch} 
                                    onClick={() => {
                                    setOpenPlan(true);
                                    setOpenCommentPlan(false);
                                    setOpenLikedPlan(false);
                                    }}
                                >
                                    {isopenplan?
                                        <p className={styles.plan_switch_p}>プラン</p>
                                    :<p>プラン</p>}
                                
                                </button>
                            </div>
                            
                            <div className={styles.profile_plan_choose_btn}>
                                <button className={styles.plan_switch} onClick={() => {
                                        setOpenPlan(false);
                                        setOpenCommentPlan(true);
                                        setOpenLikedPlan(false);
                                    }}
                                >
                                    {isopencommentplan?
                                        <p className={styles.plan_switch_p}>コメントしたプラン</p>
                                    :<p>コメントしたプラン</p>}
                                </button>
                            </div>
                            <div className={styles.profile_plan_choose_btn}>
                                <button className={styles.plan_switch}
                                    onClick={() => {
                                        setOpenPlan(false);
                                        setOpenCommentPlan(false);
                                        setOpenLikedPlan(true);
                                    }}
                                >
                                    {isopenlikedplan?
                                        <p className={styles.plan_switch_p}>いいね</p>
                                    :<p>いいね</p>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                {/* プラン表示 */}
                {isopenplan?
                <>
                    {userplan.map((plan)=>(
                        <UserPlan key={plan.id} 
                                  id={plan.id}
                                  title={plan.title}
                                  departure={plan.departure} 
                                  prefecture={plan.prefecture} 
                                  destination={plan.destination} 
                                  date={plan.date} 
                                  userPlan={plan.userPlan} 
                                  created_on={plan.created_on} 
                                  text={plan.text} 
                                  img={plan.img} 
                                  profile={plan.profile}
                                  likes={plan.likes}
                        /> 
                    ))}
                </>
                :null}
                {isopencommentplan?
                <>
                    {commentplan.map((plan)=>(
                         <UserPlan key={plan.id} 
                                id={plan.id} 
                                title={plan.title}
                                departure={plan.departure} 
                                prefecture={plan.prefecture} 
                                destination={plan.destination} 
                                date={plan.date} 
                                userPlan={plan.userPlan} 
                                created_on={plan.created_on} 
                                text={plan.text} 
                                img={plan.img} 
                                profile={plan.profile}
                                likes={plan.likes}
                         />
                    ))}
                </>
                :null}
                {isopenlikedplan?
                <>
                    {likedplans.map((plan)=>(
                         <UserPlan key={plan.id} 
                                id={plan.id} 
                                title={plan.title}
                                departure={plan.departure} 
                                prefecture={plan.prefecture} 
                                destination={plan.destination} 
                                date={plan.date} 
                                userPlan={plan.userPlan} 
                                created_on={plan.created_on} 
                                text={plan.text} 
                                img={plan.img} 
                                profile={plan.profile}
                                likes={plan.likes}
                         />
                    ))}
                </>
                :null}
            </>
            }
        </>
    )
}


export default UserProfile
