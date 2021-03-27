import React,{ useState } from 'react'
import Modal from "react-modal";
import styles from "./User.module.css";
import {
    editNickname,
    editProfileText,
    selectProfile,
    selectOpenEditProfile,
    resetOpenEditProfile,
    fetchAsyncUpdateProf,
    editProfileBase,
  } from "../auth/authSlice";
import { Button, TextField,Avatar} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import ImageTrimming from "./ImageTrimming";
import {setOpenImageTrimming}from "./userSlice";

const modalStyle={
    overlay: {
        zIndex:2
      },
    content: {
        width: 420,
        height: 460,
        top: "48%",
        left: "48%",

        transform: "translate(-50%, -50%)",
      },
};


const EditProfile:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openEditProfile=useSelector(selectOpenEditProfile);
    const profile=useSelector(selectProfile);//ログインしているユーザーのprofile
    const [image, setImage] = useState<File | null>(null);

    const updateProfile = async () => {
        const packet = { id: profile.id, nickName: profile.nickName,text:profile.text,base:profile.base};
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
                        <h1 className={styles.core_title}>プロフィールを編集</h1>
                        
                        <div className={styles.editprofile_modal_top}>
                            {/* <input type="file" id="imageInput" hidden={true} onChange={(event) => setImage(event.target.files![0])}/> */}
                            <Button onClick={()=>{dispatch(setOpenImageTrimming());}} className={styles.homr_btnprofile}>
                                <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                            </Button>
                            <div className={styles.editprofile_modal_nickname}>
                                <TextField placeholder="nickname" type="text" value={profile?.nickName} label="ニックネーム"
                                    onChange={(event) => dispatch(editNickname(event.target.value))}/>
                            </div>
                        </div>
                        <br />
                        <TextField placeholder="自己紹介" type="text" value={profile?.text} multiline fullWidth label="自己紹介"
                            onChange={(event) => dispatch(editProfileText(event.target.value))}/>
                        <br />
                        <br />
                        <TextField placeholder="拠点" type="text" value={profile?.base} label="拠点" fullWidth
                            onChange={(event) => dispatch(editProfileBase(event.target.value))}/>
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
