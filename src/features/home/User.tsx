import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { PROPS_ALL_USER } from "../types";
import { AppDispatch } from "../../app/store";
import {
    Avatar,
    CircularProgress,
  } from "@material-ui/core";
  import styles from "./Home.module.css";

  import { selectUserProfile,setOpenProfile,selectProfile } from "../auth/authSlice";





const User:React.FC<PROPS_ALL_USER> = (proFile) => {
    const dispatch: AppDispatch = useDispatch();
    const loginedUser=useSelector(selectProfile);
    return (
        <div>
            {loginedUser.id!=proFile.id ?(
               <div className={styles.user}> 
                    <button className={styles.homr_btnprofile} onClick={()=>{
                        dispatch(setOpenProfile());
                        dispatch(selectUserProfile(proFile));
                    }}>
                        <Avatar alt="who?" src={proFile.img} style={{height:'70px',width:'70px'}}/>{" "}
                    </button>
                    <br/>
                    {proFile.nickName}
                </div>
            ): null
            }
        </div>
    )
}

export default User
