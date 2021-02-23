import React from 'react'
import { useSelector,useDispatch } from "react-redux";
import { 
    selectSelectedProfile,
    selectProfile,
    setOpenSignIn,
    setOpenEditProfile,
    resetOpenProfile,
    selectProfiles,
    selectRelationships
} from "../auth/authSlice";
import { Avatar,Button} from "@material-ui/core";
import styles from "./Home.module.css";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER } from "../types";


const RelationShip:React.FC<PROPS_ALL_USER> = (proFile) => {
    const followRelations=useSelector(selectRelationships);
    const loginUser=useSelector(selectProfile);
    const allprofiles = useSelector(selectProfiles);
    const dispatch: AppDispatch = useDispatch();

    //フォローしているユーザー
    const following=followRelations.filter((followRelation)=>{
        return followRelation.userFollow===proFile.userProfile
    });
    //フォロワー
    const follower=followRelations.filter((followRelation)=>{
        return followRelation.following===proFile.userProfile
        
    });

    return (
        <div className={styles.relationship_num}>
            <Button><p className={styles.relationship_p}>{following.length} フォロー中</p> </Button>
            <Button><p className={styles.relationship_p}>{follower.length} フォロワー</p> </Button>
            
        </div>
    )
}

export default RelationShip
