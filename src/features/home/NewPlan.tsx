import React,{useState,useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
    fetchAsyncNewPlan,
    setOpenNewPlan,
    resetOpenNewPlan,
    selectOpenPlan,
    selectSelectedPlan
}from "../plan/planSlice";
import { Button, TextField, IconButton } from "@material-ui/core";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Modal from "react-modal";
import {selectProfile } from "../auth/authSlice";

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex:2
      },
    content: {
      top: "55%",
      left: "50%",
  
      width: 280,
      height: '90vh',
      padding: "50px",
  
      transform: "translate(-50%, -50%)",
    },
  };

const NewPlan:React.FC = () => {
    const dispatch = useDispatch();
    const openPlan=useSelector(selectOpenPlan);
    const myprofile=useSelector(selectProfile)
    const [destination,setDestination]=useState("");
    const [date,setDate]=useState("");
    const [text,setText]=useState("");
    const [image, setImage] = useState<File | null>(null);
    let url="";
    const newPlan = async()=>{
        const packet = { destination: destination, date: date ,text:text,img:image,profile:myprofile};
        dispatch(fetchAsyncNewPlan(packet));
        setDestination("");
        setDate("");
        setText("");
        setImage(null);
        dispatch(resetOpenNewPlan());
    }
    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
      };
      
      if(image!==null){
        var binaryData = [];
        binaryData.push(image);
        url=window.URL.createObjectURL(new Blob(binaryData, {type: "image/*"}))
      }
    return (
        <>
            <Modal isOpen={openPlan}
                onRequestClose={async () => {
                    url="";
                    setImage(null);
                    dispatch(resetOpenNewPlan());
                }}
                style={customStyles}
               ariaHideApp={false}
            >
            <form > 
                <TextField
                    placeholder="目的地は？"
                    type="text"
                    defaultValue={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <br />
                <br/>
                <TextField
                    id="date"
                    label="予定日"
                    type="date"
                    //defaultValue="2017-05-24"
                    onChange={(e)=>setDate(e.target.value)}
                    defaultValue={date}
                    // className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <br />
                <br />
                <TextField
                    placeholder="コメント"
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    defaultValue={text}
                />
                <br/>
                <input type="file" id="imageInput" hidden={true} onChange={(e) => setImage(e.target.files![0])}/>
                <IconButton onClick={handlerEditPicture}>
                    <AddPhotoAlternateIcon />
                </IconButton>
                <br/>
                <Button
                    disabled={!destination || !date  ||!text}
                    variant="contained"
                    color="primary"
                    onClick={newPlan}
                >
                    投稿
                </Button>
                {url}
                <img src={url} width="50%" height="50%"/>
            </form>
        </Modal>
            
        </>
    )
}

export default NewPlan
