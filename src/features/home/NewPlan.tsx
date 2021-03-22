import React,{useState,useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
    fetchAsyncNewPlan,
    resetOpenNewPlan,
    selectOpenPlan,
    selectPrefectures,
}from "../plan/planSlice";
import { Button, TextField, IconButton,Menu,MenuItem } from "@material-ui/core";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import Modal from "react-modal";
import {selectProfile } from "../auth/authSlice";
import AddLocationIcon from '@material-ui/icons/AddLocation';

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

  const ITEM_HEIGHT=47;

const NewPlan:React.FC = () => {
    const dispatch = useDispatch();
    const openPlan=useSelector(selectOpenPlan);
    const myprofile=useSelector(selectProfile);
    const prefectures=useSelector(selectPrefectures);
    const [title,setTitle]=useState("");
    const [departure,setDeparture]=useState("");
    const [prefecture,setPrefecture]=useState(0);
    const [destination,setDestination]=useState("");
    const [date,setDate]=useState("");
    const [text,setText]=useState("");
    const [image, setImage] = useState<File | null>(null);
    const [anchorEl, setAnchorEl] =useState(null);
    const open = Boolean(anchorEl);
    const [pref,setP]=useState("");
    
    let url="";
    const newPlan = async()=>{
        const packet = { title:title,departure:departure,prefecture:String(prefecture), destination: destination, date: date ,text:text,img:image,profile:myprofile};
        dispatch(fetchAsyncNewPlan(packet));
        setDestination("");
        setDate("");
        setText("");
        setPrefecture(0);
        setP("");
        setImage(null);
        dispatch(resetOpenNewPlan());
    }
    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
      };

      const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget);
        
      };
    
      const handleClose = () => {
        setAnchorEl(null);
        setPrefecture(0);
        setP("");
      };

      const setPref=(e:any)=>{
        setPrefecture(e.id)
        setP(e.name);
      }
      
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
                    setPrefecture(0);
                    setP("");
                }}
                style={customStyles}
               ariaHideApp={false}
            >
            <form > 
                <TextField
                    placeholder="タイトル"
                    type="text"
                    defaultValue={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br />
                <TextField
                    placeholder="目的地は？"
                    type="text"
                    defaultValue={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <br />
                {/* 都道府県 */}
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <AddLocationIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                    }}
                >
                    
                    {prefectures.map((prefecture)=>(
                         <MenuItem key={prefecture.id} selected={prefecture.id === 1}  onClick={()=>{handleClose();setPref(prefecture)}}>
                            {prefecture.name} 
                         </MenuItem>
                    ))}
                </Menu>
                {pref}
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
                <TextField
                    placeholder="出発地"
                    type="text"
                    defaultValue={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                />
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
                <img src={url} width="50%" height="50%"/>
            </form>
        </Modal>
            
        </>
    )
}

export default NewPlan
