import React from 'react'
import { useSelector,useDispatch } from "react-redux";
import { selectSelectedProfile,selectProfile,setOpenSignIn} from "../auth/authSlice";
import { Avatar,Button} from "@material-ui/core";
import styles from "./Home.module.css";
import { AppDispatch } from "../../app/store";
const UserProfile:React.FC = () => {
    const selectedProfile=useSelector(selectSelectedProfile)
    const loginUser=useSelector(selectProfile)
    const dispatch: AppDispatch = useDispatch();
    return (
        <div className={styles.profileDetail}>
            <div className={styles.profileDetail_container}>
                <div className={styles.detail_avatar}>
                    <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>{" "}
                    <div className={styles.detail_h2}>
                    <h2>{selectedProfile.nickName}</h2>
                    </div>
                </div>
                { loginUser.id== selectedProfile.id?(
                    <div className={styles.logout_btn}>
                        <Button onClick={() => {
                                localStorage.removeItem("localJWT");
                                dispatch(setOpenSignIn());
                            }}
                        >Logout</Button>
                        <p>編集</p>
                    </div>
                ):null}
                
                <div className={styles.name_text}>
                    <p>{selectedProfile.text}</p>
                </div>
           </div>
        </div>
    )
}

export default UserProfile
