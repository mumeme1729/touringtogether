import React from 'react'
import styles from "./relationship.module.css";
import { Avatar} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER } from "../types";
import {resetOpenRelationshipDetail} from "./RelationshipSlice";
import {Link} from 'react-router-dom';

const Follower:React.FC<PROPS_ALL_USER> = (profile) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <div>
        <div  className={styles.relationship_all}>
            <button className={styles.plan_btnprofile} onClick={()=>{dispatch(resetOpenRelationshipDetail())}}>
                <Link to ={"/profile/"+profile.userProfile}> 
                    <Avatar alt="who?" src={profile.img} style={{height:'50px',width:'50px'}}/>
                </Link> 
            </button>
            <div className={styles.relationship_nickname}>{profile.nickName}</div>
        </div>
        <div  className={styles.profile_text}>
            <p className={styles.text_p}>{profile.text}</p>
        </div>    
    </div>
    )
}

export default Follower