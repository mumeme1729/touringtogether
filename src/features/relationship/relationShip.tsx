import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { selectProfile,} from "../auth/authSlice"; 
import {
    setOpenRelationshipDetail,
    resetOpenRelationshipDetail,
    selectOpenRelationshipDetail,
    setOpenFollowing,
    resetOpenFollowing,
    setOpenFollower,
    resetOpenFollower,
    selectOpenFollower,
    selectAddRelationship,
    fetchAsyncFollowingDelete,
    fetchAsyncAddFollowing,
    selectFollowerProfile,
    selectFollowingProfile,
    fetchAsyncGetFollowerProfile,
    selectDeleteId,
    fetchAsyncGetRelationId,
    } from "../relationship/RelationshipSlice";

import {Button} from "@material-ui/core";
import styles from "./relationship.module.css";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER,RELATION } from "../types";
import Following from "./Following";
import Follower from "./Follower";
import Modal from "react-modal";
import {useLocation} from 'react-router-dom';
import {fetchAsyncPostNotification} from '../notification/notificationSlice';

const modalStyle={
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex:2
      },
    content: {
        top: "50%",
        left: "50%",
        backgroundColor: 'white',
        width: 260,
        height: 450,
        transform: "translate(-50%, -50%)",
      },
};


const RelationShip:React.FC<PROPS_ALL_USER> = (proFile) => {
    const loginUser=useSelector(selectProfile);//ログインしているユーザーのプロフィール
    const openRelationshipDetail=useSelector(selectOpenRelationshipDetail);//フォロー関係のモーダルを開く
    const openFollowing =useSelector(selectOpenFollower);//フォロー中のモーダルを開く
    const newRelation=useSelector(selectAddRelationship);//新しくフォローする関係
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const user_id=(location.pathname.substr(9));

    const following =useSelector(selectFollowingProfile);
    const follower  = useSelector(selectFollowerProfile);
    const Id=useSelector(selectDeleteId);
    

    const isFollowing =follower.some((f)=>{
        return loginUser.userProfile===f.userProfile;
    });
    
    //フォローする
    const addNewFollowing=async()=>{
        console.log(newRelation.following)
        await dispatch(fetchAsyncAddFollowing(newRelation));//フォローする
        await dispatch(fetchAsyncGetFollowerProfile(user_id));
        const relation:RELATION={userFollow:loginUser.userProfile,following:user_id}
        await dispatch(fetchAsyncGetRelationId(relation));
    }

    //通知を追加
    const addNotification=async()=>{
        const packet={status:true,receive:proFile.userProfile,send:loginUser.userProfile,targetplan:null}
        await dispatch(fetchAsyncPostNotification(packet));
    }

    const deleteReration=async()=>{
        await dispatch(fetchAsyncFollowingDelete(Id.id))
        await dispatch(fetchAsyncGetFollowerProfile(user_id));
    }
   
    
    return (
        <>
            <div className={styles.follow_btn_container}>
                    {proFile.id!==loginUser.id?(
                        isFollowing?(
                            <div className={styles.follow_btn}>
                                <Button variant="outlined" color="primary" onClick={()=>{
                                    //フォロー解除時
                                    deleteReration();
                                }}>
                                フォロー中 
                                </Button>
                            </div>
                        ):
                            <div className={styles.follow_btn}>
                                <Button variant="outlined" color="primary" onClick={()=>{
                                    addNotification();
                                    addNewFollowing();
                                }}>
                                    フォロー
                                </Button>
                            </div>
                    ):null}  
            </div>
            <div className={styles.follow_follow_num_btn}>
                <Button style={{height:'10px',width:'50%'}} onClick={()=>{
                    dispatch(setOpenRelationshipDetail());
                    dispatch(resetOpenFollower());
                    dispatch(setOpenFollowing());
                }}>
                    <p className={styles.relationship_p}>{following.length} フォロー中</p> 
                </Button>
                <Button style={{height:'10px',width:'50%'}} onClick={()=>{
                    dispatch(setOpenRelationshipDetail());
                    dispatch(resetOpenFollowing());
                    dispatch(setOpenFollower());
                }}>
                    <p className={styles.relationship_p}>{follower.length} フォロワー</p> 
                </Button>
            </div>
            {/* フォロー・フォロワーの一覧 */}
            <Modal
                    isOpen={openRelationshipDetail}
                    onRequestClose={() => {
                        dispatch(resetOpenRelationshipDetail());
                    }}
                    style={modalStyle}
                    ariaHideApp={false}
                >
                    <div className={styles.relationship_follow_switch_btn_container}>
                        <div className={styles.relationship_follow_switch_btn}>
                            <button className={styles.relationship_switch_btn} onClick={()=>{
                                dispatch(resetOpenFollower());
                                dispatch(setOpenFollowing());
                            }}>
                                {!openFollowing?
                                    <h4 className={styles.follow_selected}>フォロー中</h4>
                                :<h4>フォロー中</h4>}
                            </button>
                        </div>
                        <div className={styles.relationship_follow_switch_btn}>
                            <button className={styles.relationship_switch_btn} onClick={()=>{
                                dispatch(resetOpenFollowing());
                                dispatch(setOpenFollower());
                            }}>
                                {openFollowing?
                                    <h4 className={styles.follow_selected}>フォロワー</h4>
                                :<h4>フォロワー</h4>}
                            </button>
                        </div>
                    </div>
                    {!openFollowing ?(
                        <>
                            {/* フォローしているユーザー */}
                             {following.map((f)=>(
                                <Following key={f.id} id={f.id} nickName={f.nickName} text={f.text} userProfile={f.userProfile} created_on={f.created_on} img={f.img} base={f.base}/>
                            ))}  
                        </>
                    ):
                        <>
                             {follower.map((f)=>(
                                <Follower key={f.id} id={f.id} nickName={f.nickName} text={f.text} userProfile={f.userProfile} created_on={f.created_on} img={f.img} base={f.base}/>
                            ))}  
                        </>
                    }
                </Modal>
        </>
    )
}
export default RelationShip
