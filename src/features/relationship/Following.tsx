import React from 'react'
import styles from "./relationship.module.css";
import { Avatar} from "@material-ui/core";
import {  useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { PROPS_ALL_USER } from "../types";
import {resetOpenRelationshipDetail} from "./RelationshipSlice";
import {Link} from 'react-router-dom';
import {startProfileLoad} from "../auth/authSlice";

const Following:React.FC<PROPS_ALL_USER> = (profile) => {
    const dispatch: AppDispatch = useDispatch();
    return (
        <div className={styles.followcard_container}>
            <div  className={styles.followcard_left}>
                <button className={styles.followcard_avatar_btn} onClick={()=>{
                    dispatch(resetOpenRelationshipDetail());
                    dispatch(startProfileLoad());
                    }}>
                    <Link to ={"/profile/"+profile.userProfile}> 
                        <Avatar alt="who?" src={profile.img} style={{height:'50px',width:'50px'}}/>
                    </Link> 
                </button>
            </div>
            <div  className={styles.followcard_right}>
                <div className={styles.relationship_nickname}>
                    {profile.nickName}
                </div>
                <p className={styles.followcard_text_p}>{profile.text}</p>
            </div>    
        </div>
    )
}

export default Following