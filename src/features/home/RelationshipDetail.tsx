import React from 'react'
import Modal from "react-modal";
import styles from "./Home.module.css";
import { Button, TextField,Avatar} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
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
} from "../auth/authSlice";
import { PROPS_RELATION } from "../types";
const modalStyle={
    content: {
        width: 400,
        height: 520,

        top: "55%",
        left: "50%",

        transform: "translate(-50%, -50%)",
      },
};


const RelationshipDetail:React.FC<PROPS_RELATION> = (relation) => {
    const dispatch: AppDispatch = useDispatch();
    const allprofiles = useSelector(selectProfiles);

    const relationshipProfile=allprofiles.filter((allprof)=>{
        return allprof.userProfile===relation.following
    });
    return (
        <div>
            {relationshipProfile.map((p)=>(
                <>
                <div className={styles.relationship_all}>
                    <Avatar alt="who?" src={p.img} style={{height:'50px',width:'50px'}}/>{" "}
                    <div className={styles.relationship_nickname}>{p.nickName}</div>
                </div>
                <div className={styles.profile_text}>
                    <p className={styles.text_p}>{p.text}</p>
                </div>
                </>
            ))} 
        </div>
    )
}

export default RelationshipDetail
