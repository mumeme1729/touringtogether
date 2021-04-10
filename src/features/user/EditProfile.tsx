import React,{ useState } from 'react'
import Modal from "react-modal";
import styles from "./User.module.css";
import {
    selectProfile,
    selectOpenEditProfile,
    resetOpenEditProfile,
    fetchAsyncUpdateProf,
  } from "../auth/authSlice";
import { Button, TextField,Avatar} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import ImageTrimming from "./ImageTrimming";
import {setOpenImageTrimming}from "./userSlice";

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:2,
      },
    content: {
        
        top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 450,
      transform: "translate(-50%, -50%)",
      },
};


const EditProfile:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openEditProfile=useSelector(selectOpenEditProfile);
    const profile=useSelector(selectProfile);//ログインしているユーザーのprofile
    const [nickName,setnickNme]=useState(profile.nickName);
    const [text,setText]=useState(profile.text);
    const [base,setBase]=useState(profile.base);

    const updateProfile = async () => {
        const packet = { id: profile.id, nickName: nickName,text:text,base:base};
        await dispatch(fetchAsyncUpdateProf(packet));
    };

    return (
            <Modal
                isOpen={openEditProfile}
                onRequestClose={async () => {
                    dispatch(resetOpenEditProfile());
                }}
                style={modalStyle}
                ariaHideApp={false}
             >
                <div className={styles.editprofile_modal_container}>
                    <form>
                        <h2 className={styles.core_title}>プロフィールを編集</h2>
                        
                        <div className={styles.editprofile_modal_top}>
                            <Button onClick={()=>{dispatch(setOpenImageTrimming());}} className={styles.homr_btnprofile}>
                                <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                            </Button>
                            <div className={styles.editprofile_modal_nickname}>
                                <TextField placeholder="nickname" type="text" value={nickName} label="ニックネーム"
                                    onChange={(e) => setnickNme(e.target.value)}/>
                            </div>
                        </div>
                        <br />
                        <TextField placeholder="自己紹介" type="text" value={text} multiline fullWidth label="自己紹介"
                            onChange={(event) => setText(event.target.value)}/>
                        <br />
                        <br />
                        <TextField placeholder="拠点" type="text" value={base} label="拠点" fullWidth
                            onChange={(event) => setBase(event.target.value)}/>
                        <div className={styles.editprofile_modal_update_btn}>
                            <Button
                                disabled={!profile?.nickName}
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={updateProfile}
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
               <ImageTrimming/> 
             </Modal>
        
    )
}

export default EditProfile
