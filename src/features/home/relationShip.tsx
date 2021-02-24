import React,{useEffect,useState} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { 
    selectProfile,
    selectProfiles,
    selectRelationships,
    setOpenRelationshipDetail,
    resetOpenRelationshipDetail,
    selectOpenRelationshipDetail,
    setOpenFollowing,
    resetOpenFollowing,
    setOpenFollower,
    resetOpenFollower,
    selectOpenFollower,
    selectOpenFollowing,
    fetchAsyncFollowing,
    selectAddRelationship,
    addRelation,
    fetchAsyncFollowingDelete,
} from "../auth/authSlice";
import { Avatar,Button} from "@material-ui/core";
import styles from "./Home.module.css";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER, PROPS_RELATION } from "../types";
import RelationshipDetail from "./RelationshipDetail";
import Modal from "react-modal";


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
    const followRelations=useSelector(selectRelationships);
    const openRelationDetail=useSelector(selectOpenRelationshipDetail);
    const loginUser=useSelector(selectProfile);
    const openRelationshipDetail=useSelector(selectOpenRelationshipDetail);
    const openFollowing =useSelector(selectOpenFollower);
    const newRelation=useSelector(selectAddRelationship);
    const dispatch: AppDispatch = useDispatch();


     //フォローしているユーザー
     const following=followRelations.filter((followRelation)=>{
        return followRelation.userFollow===proFile.userProfile
    });
    //フォロワー
    const follower=followRelations.filter((followRelation)=>{
        return followRelation.following===proFile.userProfile
    });


    useEffect(() => {
        const fetchLoader = async ()=>{ 
            await dispatch(addRelation({following:proFile.userProfile}));
        };
        fetchLoader();
    },[proFile]);
    

    //選択したユーザーをフォローしているかどうか
    const isFollowing =follower.some((f)=>{
        return loginUser.userProfile===f.userFollow
    });
    const relationId =follower.filter((f)=>{
        return loginUser.userProfile===f.userFollow
    });

    //フォローするユーザー情報を取得
    const addNewFollowing=()=>{
        dispatch(fetchAsyncFollowing(newRelation));
        
    }
    const relation=follower.filter((f)=>{
       return  f.userFollow===loginUser.userProfile
     });
    
    
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
                    <Button variant="outlined" color="primary" onClick={()=>{
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
