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
    content: {
        width: 400,
        height: 520,

        top: "55%",
        left: "50%",

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
    
   

    //選択したユーザーをフォローしているかどうか
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
            <div className={styles.relationship_num}>
                <div>
                {proFile.id!==loginUser.id?(
                    isFollowing?(
                        <Button variant="outlined" color="primary" onClick={()=>{
                            //フォロー解除時
                            deleteReration();
                        }}>
                         フォロー中 
                        
                         </Button>
                    ):
                    <Button variant="outlined" color="primary" onClick={()=>{
                        addNotification();
                        addNewFollowing();
                    }}>
                        フォロー
                     </Button>
                    
                ):null}
                    
                </div>
                <Button onClick={()=>{
                    dispatch(setOpenRelationshipDetail());
                    dispatch(resetOpenFollower());
                    dispatch(setOpenFollowing());
                }}>
                    <p className={styles.relationship_p}>{following.length} フォロー中</p> 
                </Button>
                <Button onClick={()=>{
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
                    onRequestClose={async () => {
                        await dispatch(resetOpenRelationshipDetail());
                    }}
                    style={modalStyle}
                    ariaHideApp={false}
                >
                    <div>
                        <Button onClick={()=>{
                             dispatch(resetOpenFollower());
                             dispatch(setOpenFollowing());
                        }}>
                            フォロー中
                        </Button>
                        <Button onClick={()=>{
                            dispatch(resetOpenFollowing());
                            dispatch(setOpenFollower());
                        }}>
                            フォロワー
                        </Button>
                    </div>
                    {!openFollowing ?(
                        <>
                            {/* フォローしているユーザー */}
                            フォロー中
                             {following.map((f)=>(
                                <Following key={f.id} id={f.id} nickName={f.nickName} text={f.text} userProfile={f.userProfile} created_on={f.created_on} img={f.img} base={f.base}/>
                            ))}  
                        </>
                    ):
                        <>
                            フォロワー
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
