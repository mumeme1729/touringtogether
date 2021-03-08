import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { 
    selectProfile,
    selectProfiles,
} from "../auth/authSlice";
    
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
    addRelation,
    fetchAsyncFollowingDelete,
    selectFollowing,
    selectFollower,
    fetchAsyncAddFollowing
    } from "../relationship/RelationshipSlice";

import { Avatar,Button} from "@material-ui/core";
import styles from "./relationship.module.css";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER, PROPS_RELATION } from "../types";
import RelationshipDetail from "../home/RelationshipDetail";
import Modal from "react-modal";
import {useLocation} from 'react-router-dom';

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
    const following=useSelector(selectFollowing);
    const follower=useSelector(selectFollower);
    const location = useLocation();
    const user_id=(location.pathname.substr(9));

    useEffect(() => {
        const fetchLoader = async ()=>{ 
            await dispatch(addRelation({following:user_id}));
        };
        fetchLoader();
    },[dispatch]);
    

    //選択したユーザーをフォローしているかどうか
    const isFollowing =follower.some((f)=>{
        return loginUser.userProfile===f.userFollow
    });
    //フォロー解除時にidを返す
    const relationId =follower.filter((f)=>{
        return loginUser.userProfile===f.userFollow
    });

    //フォローする
    const addNewFollowing=()=>{
        dispatch(fetchAsyncAddFollowing(newRelation));
    }
   
    
    return (
        <>
            <div className={styles.relationship_num}>
                {/* <RelationshipDetail /> */}
                <div>
                {proFile.id!==loginUser.id?(
                    isFollowing?(
                        <Button variant="outlined" color="primary" onClick={()=>{
                           dispatch(fetchAsyncFollowingDelete(relationId[0].id))
                        }}>
                         フォロー中 
                        
                         </Button>
                    ):
                    <Button variant="outlined" color="primary" onClick={async()=>{
                        
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
                                <RelationshipDetail id={f.id} following={f.following} userFollow={f.userFollow}/>
                            ))} 
                        </>
                    ):
                        <>
                            フォロワー
                            {follower.map((f)=>(
                                <RelationshipDetail id={f.id} following={f.userFollow} userFollow={f.following}/>
                            ))} 
                        </>
                    }
                </Modal>
        </>
    )
}
export default RelationShip
