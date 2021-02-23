import React,{ useState } from 'react'
import Modal from "react-modal";
import styles from "./Home.module.css";
import {
    editNickname,
    editProfileText,
    selectProfile,
    selectOpenEditProfile,
    resetOpenEditProfile,
    fetchAsyncUpdateProf,
  } from "../auth/authSlice";

import { File } from "../types";
import { Button, TextField,Avatar} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";

const modalStyle={
    content: {
        width: 400,
        height: 520,

        top: "55%",
        left: "50%",

        transform: "translate(-50%, -50%)",
      },
};


const EditProfile:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openEditProfile=useSelector(selectOpenEditProfile);
    const profile=useSelector(selectProfile);//ログインしているユーザーのprofile
    const [image, setImage] = useState<File | null>(null);


    const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { id: profile.id, nickName: profile.nickName,text:profile.text ,img: image };
    
        await dispatch(fetchAsyncUpdateProf(packet));
        await dispatch(resetOpenEditProfile());
      };


      const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
      };
    
    return (
        <div>
            <Modal
                isOpen={openEditProfile}
                onRequestClose={async () => {
                    await dispatch(resetOpenEditProfile());
                }}
                style={modalStyle}
             >
                <form className={styles.core_signUp}>
                    <h1 className={styles.core_title}>プロフィールを編集</h1>
                    <br />
                    
                    <input type="file" id="imageInput" hidden={true} onChange={(event) => setImage(event.target.files![0])}/>
                    <Button onClick={handlerEditPicture} className={styles.homr_btnprofile}>
                        <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                    </Button>

                    <TextField placeholder="nickname" type="text" value={profile?.nickName} label="ニックネーム"
                        onChange={(event) => dispatch(editNickname(event.target.value))}/>
                    <br />
                    <br />
                    <TextField placeholder="自己紹介" type="text" value={profile?.text} multiline style = {{width: 350}} label="自己紹介"
                        onChange={(event) => dispatch(editProfileText(event.target.value))}/>
                    <br />
                    <br />
                    <br />
                    <Button
                        disabled={!profile?.nickName}
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={updateProfile}
                    >
                        Update
                    </Button>

                </form>
             </Modal>
        </div>
    )
}

export default EditProfile
