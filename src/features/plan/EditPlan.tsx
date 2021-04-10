import React,{ useState } from 'react'
import Modal from "react-modal";
import { AppDispatch } from "../../app/store";
import {selectOpenEditPlan,resetOpenEditPlan,selectPrefectures, selectSelectedPlan,fetchAsyncUpdatePlan} from "./planSlice";
import { Button, TextField, IconButton,Menu,MenuItem } from "@material-ui/core";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import { useSelector, useDispatch } from "react-redux";
import styles from "./Plan.module.css";
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex:2
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

const ITEM_HEIGHT=47;

const EditPlan:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openeditplan=useSelector(selectOpenEditPlan);
    const plan=useSelector(selectSelectedPlan);
    
    const prefectures=useSelector(selectPrefectures);
    const [title,setTitle]=useState(plan.title);
    const [departure,setDeparture]=useState(plan.departure);
    const [prefecturestate,setPrefecture]=useState(plan.prefecture);
    const [destination,setDestination]=useState(plan.destination);
    const [date,setDate]=useState(plan.date);
    const [text,setText]=useState(plan.text);
    const [image, setImage] = useState<File | null>(null);
    const [anchorEl, setAnchorEl] =useState(null);
    const open = Boolean(anchorEl);
    const [pref,setP]=useState("");

    let url=""
    if(plan.img!==null){
        url=plan.img;
    }

    const editPlan = async()=>{
        const packet = { id:plan.id,title:title,departure:departure,prefecture:String(prefecturestate), destination: destination, date: date ,text:text,img:image,profile:plan.profile,likes:plan.likes};
        const results= dispatch(fetchAsyncUpdatePlan(packet));
        console.log(results);
        // setDestination("");
        // setDate("");
        // setText("");
        // setPrefecture('');
        setP("");
        setImage(null);
        dispatch(resetOpenEditPlan());
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
        setPrefecture('');
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
            <Modal isOpen={openeditplan}
                onRequestClose={async () => {
                    dispatch(resetOpenEditPlan());
                }}
                style={customStyles}
               ariaHideApp={false}
            >
            <div className={styles.newplan_modal_container}>
                <h3>新規プラン</h3>
                <form > 
                    <div className={styles.newplan_modal_textfield}>
                        <TextField
                            placeholder="タイトル"
                            type="text"
                            defaultValue={title}
                            fullWidth
                            multiline
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className={styles.newplan_modal_textfield}>
                        <TextField
                            placeholder="目的地"
                            type="text"
                            fullWidth
                            multiline
                            defaultValue={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                    </div>
                    {/* 都道府県 */}
                    <div className={styles.newplan_modal_prefecture_menu}>
                        <p>都道府県</p>
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
                        <p>{pref}</p>
                    </div>
                    <div className={styles.newplan_modal_textfield}>
                        <TextField
                            id="date"
                            label="予定出発日"
                            type="date"
                            onChange={(e)=>setDate(e.target.value)}
                            defaultValue={date}
                            fullWidth
                            // className={classes.textField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>
                    <div className={styles.newplan_modal_textfield}>
                        <TextField
                            placeholder="出発地"
                            type="text"
                            fullWidth
                            defaultValue={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                        />
                    </div>
                    <div className={styles.newplan_modal_textfield}>
                        <TextField
                            placeholder="コメント"
                            type="text"
                            fullWidth
                            multiline
                            onChange={(e) => setText(e.target.value)}
                            defaultValue={text}
                        />
                    </div>
                    <div className={styles.newplan_modal_img_container}>
                        <input type="file" id="imageInput" hidden={true} accept=".jpg,.gif,.png,image/gif,image/jpeg,image/png" onChange={(e) => setImage(e.target.files![0])}/>
                        <IconButton onClick={handlerEditPicture}>
                            <AddPhotoAlternateIcon />
                        </IconButton>
                        <div className={styles.newplan_modal_img}>
                        {url!==""?<img src={url} height="90px"/>:null}
                        </div>
                    </div>
                    <div className={styles.newplan_modal_btn}>
                        <Button
                            disabled={!destination || !date  ||!text}
                            variant="contained"
                            color="primary"
                            onClick={editPlan}
                        >
                            更新
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
            
        </>
    )
}

export default EditPlan
