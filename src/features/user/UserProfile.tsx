import React,{useEffect} from 'react'
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
    setCommentPlan,
    resetCommentPlan,
    selectIsOpenUserPlan,
    selectCommentPlan,
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
                dispatch(setCommentPlan());
                dispatch(endProfileLoad());
            }
        };
        fetchLoader();
    },[user_id]);


    return (
        <>  
            {isLoadProfile?
            <>
                <CircularProgress/>
            </>
            :<>
                <div className={styles.profileDetail}>
                    <div className={styles.profileDetail_container}>
                        { loginUser.id== selectedProfile.id?(
                            <>
                                <div className={styles.detail_avatar}>
                                    <Avatar alt="who?" src={loginUser.img} style={{height:'70px',width:'70px'}}/>{" "}
                                    <div className={styles.detail_h2}>
                                        <h2>{loginUser.nickName}</h2>
                                        <RelationShip key={loginUser.id} id={loginUser.id} nickName={loginUser.nickName} text={loginUser.text} userProfile={loginUser.userProfile} created_on={loginUser.created_on} img={loginUser.img} base={loginUser.base} />
                                    </div>
                                </div>
                                <div className={styles.logout_btn}>
                                    <Link to ="/">
                                        <Button onClick={() => {
                                                localStorage.removeItem("localJWT");
                                                dispatch(setOpenSignIn());
                                            }}
                                        >Logout</Button>
                                    </Link>
                                    <Button onClick={() => {
                                            dispatch(setOpenEditProfile());
                                        }}
                                    >編集</Button>
                                    <EditProfile/>
                                </div>
                                <div className={styles.name_text}>
                                    <p>{loginUser.text}</p>
                                    <p>{loginUser.base}</p>
                                </div>
                            </>
                        ): 
                        <>
                            {/* ログインしているユーザー以外 */}
                            <div className={styles.detail_avatar}>
                                <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>{" "}
                                <div className={styles.detail_h2}>
                                    <h2>{selectedProfile.nickName}</h2>
                                    <RelationShip key={selectedProfile.id} id={selectedProfile.id} nickName={selectedProfile.nickName} text={selectedProfile.text} userProfile={selectedProfile.userProfile} created_on={selectedProfile.created_on} img={selectedProfile.img} base={selectedProfile.base} />
                                </div>
                            </div>
                            <div className={styles.logout_btn}>
                                <div className={styles.name_text}>
                                    <p>{selectedProfile.text}</p>
                                    <p>{selectedProfile.base}</p>
                                </div>
                            </div>
                        </>
                        }
                        
                    </div>
                </div>
                <div>
                    <Button variant="outlined" color="primary"
                    onClick={() => {
                     dispatch(setCommentPlan());
                    }}
                    >プラン</Button>
                    <br/>
                    <br/>
                    <Button variant="outlined" color="primary"
                    onClick={() => {
                     dispatch(resetCommentPlan());
                    }}
                    >コメントしたプラン</Button>
                
                </div>
                {/* プラン表示 */}
                {isopenuserplan
                ?
                <>
                    {userplan.map((plan)=>(
                        <UserPlan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text} img={plan.img} profile={selectedProfile}/> 
                    ))}
                </>
                :
                <>
                    {commentplan.map((plan)=>(
                        <UserPlan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text} img={plan.img} profile={plan.profile}/> 
                    ))}
                </>
                }
                
            </>
            }
        </>
    )
}


export default UserProfile
