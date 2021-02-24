import React,{useEffect} from 'react'
import { useSelector,useDispatch } from "react-redux";
import { 
    selectSelectedProfile,
    selectProfile,
    setOpenSignIn,
    setOpenEditProfile,
    resetOpenProfile,
    selectRelationships,
    fetchAsyncRelations
} from "../auth/authSlice";
import { Avatar,Button} from "@material-ui/core";
import styles from "./Home.module.css";
import { AppDispatch } from "../../app/store";
import EditProfile from './EditProfile';
import RelationShip from './relationShip';

const UserProfile:React.FC = () => {
    const selectedProfile=useSelector(selectSelectedProfile)
    const loginUser=useSelector(selectProfile)
    const followRelations=useSelector(selectRelationships);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const fetchLoader = async ()=>{ 
            await dispatch(fetchAsyncRelations());  
        };
        fetchLoader();
    },[dispatch]);


    return (
        <div className={styles.profileDetail}>
            <div className={styles.profileDetail_container}>
                { loginUser.id== selectedProfile.id?(
                    <>
                        <div className={styles.detail_avatar}>
                            <Avatar alt="who?" src={loginUser.img} style={{height:'70px',width:'70px'}}/>{" "}
                            <div className={styles.detail_h2}>
                                <h2>{loginUser.nickName}</h2>
                                <RelationShip id={loginUser.id} nickName={loginUser.nickName} text={loginUser.text} userProfile={loginUser.userProfile} created_on={loginUser.created_on} img={loginUser.img}/>
                            </div>
                        </div>
                        <div className={styles.logout_btn}>
                            <Button onClick={() => {
                                    localStorage.removeItem("localJWT");
                                    dispatch(setOpenSignIn());
                                    dispatch(resetOpenProfile());
                                }}
                            >Logout</Button>
                            <Button onClick={() => {
                                    dispatch(setOpenEditProfile());
                                }}
                            >編集</Button>
                            <EditProfile/>
                        </div>
                        <div className={styles.name_text}>
                            <p>{loginUser.text}</p>
                        </div>
                    </>
                ): 
                 <>
                     {/* ログインしているユーザー以外 */}
                    <div className={styles.detail_avatar}>
                        <Avatar alt="who?" src={selectedProfile.img} style={{height:'70px',width:'70px'}}/>{" "}
                        <div className={styles.detail_h2}>
                            <h2>{selectedProfile.nickName}</h2>
                            <RelationShip id={selectedProfile.id} nickName={selectedProfile.nickName} text={selectedProfile.text} userProfile={selectedProfile.userProfile} created_on={selectedProfile.created_on} img={selectedProfile.img}/>
                        </div>
                    </div>
                    <div className={styles.logout_btn}>
                        <div className={styles.name_text}>
                            <p>{selectedProfile.text}</p>
                        </div>
                    </div>
                </>
            }
                
           </div>
        </div>
    )
}

export default UserProfile
