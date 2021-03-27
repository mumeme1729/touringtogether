import React,{ useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import ReactCrop, {Crop} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Modal from "react-modal";
import {IconButton,Button} from "@material-ui/core";
import { resetOpenImageTrimming,selectIsOpenImageTrimming }from "./userSlice";
import {selectProfile,fetchAsyncUpdateProfImage} from "../auth/authSlice";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import styles from "./User.module.css";
// import { File} from "../types";

const modalStyle={
    overlay: {
        zIndex:4
      },
    content: {
        width: 400,
        height: 520,

        top: "55%",
        left: "50%",

        transform: "translate(-50%, -50%)",
      },
};

const ImageTrimming:React.FC= () =>{
    const dispatch: AppDispatch = useDispatch();
    const [src, setSrc] = useState<any>(null);
    const profile=useSelector(selectProfile);
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        x: 0,
        y: 0,
        width: 70,
        aspect: 1
    });
    const [imageRef, setImage] = useState<HTMLImageElement | null>(null);
    const [u,setUrl]=useState<string>("");
    const [bloB,setBlob]=useState<Blob|null>(null);
    const isopenimagetrimming=useSelector(selectIsOpenImageTrimming);

    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            if(event.target.files.length!==0){
                const reader = new FileReader();
                reader.addEventListener("load", () =>{
                    setSrc(reader.result);
                });
                reader.readAsDataURL(event.target.files[0]);
            }
        }
    };

    const handlerEditPicture = () => {
        const fileInput = document.getElementById("editInputImage");
        fileInput?.click();
    };

    const onImageLoaded = (image:HTMLImageElement) => {
        setImage(image);
      };
    
    const onCropChange=(crop:Crop)=>{
        setCrop(crop);
    };

    const onCropComplete=(crop:Crop)=>{
        makeClientCrop(crop);
    }

    const updateImage = async () => {
        const name:string=String(profile.id)+String(Date.now())+".jpg";
        if(bloB!==null){
            const newImage=new File([bloB],name,{type:"image/jpg",lastModified:Date.now()});
            const packet = { id: profile.id,nickName:profile.nickName,text:profile.text,img: newImage,name:name,};
            await dispatch(fetchAsyncUpdateProfImage(packet)); 
            dispatch(resetOpenImageTrimming());
        }  
    };

    const makeClientCrop=async(crop:Crop)=>{
        if(imageRef && crop.width && crop.height){
            const croppedImageUrl:any=await getCroppedImg(
                imageRef,
                crop,
                "newFile.jpg"
            );
            setUrl(croppedImageUrl);
        }
    }

    
    const getCroppedImg=(image:HTMLImageElement,crop:any,fileName:string)=>{
            const canvas = document.createElement("canvas")
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width
            canvas.height = crop.height
            const ctx = canvas.getContext("2d")
            if(ctx !== null){
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
                return new Promise((resolve, reject)=>{
                    canvas.toBlob((blob) => {
                        if (!blob) {
                          console.error("Canvas is empty");
                          return;
                        }
                        setBlob(blob);
                        //console.log(blob);
                      }, "image/jpeg");
                    });
                }
            };
        

    return (
            <Modal
                isOpen={isopenimagetrimming}
                onRequestClose={async () => {
                    dispatch(resetOpenImageTrimming());
                    setSrc(null);
                }}
                style={modalStyle}
                ariaHideApp={false}
             >
                <div>
                    <div className={styles.profile_image_top}>
                        <div>
                            <input type="file" id="editInputImage" className={styles.profile_image_icon_input} 
                                accept=".jpg,.gif,.png,image/gif,image/jpeg,image/png"
                                onChange={onSelectFile}
                            />
                            <IconButton onClick={handlerEditPicture}>
                                <AddPhotoAlternateIcon />
                            </IconButton>    
                        </div>
                        <div>
                            <Button
                                    // disabled={bloB!==null}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={updateImage}
                                >
                                    Upload
                            </Button>
                        </div>
                    </div>
                    <div>
                        {src && (
                            <ReactCrop
                                src={src}
                                crop={crop}
                                ruleOfThirds
                                onImageLoaded={onImageLoaded}
                                onComplete={onCropComplete}
                                onChange={onCropChange}
                            />
                        )}
                    </div>
                </div>
        </Modal>
    )
}

export default ImageTrimming
