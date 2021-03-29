import React from 'react'
import Modal from "react-modal";
import {selectOpenImage,resetOpenImage,selectPlanImage} from '../plan/planSlice';
import { AppDispatch } from "../../app/store";
import {  useDispatch, useSelector } from "react-redux";
import styles from "./Plan.module.css";

const modalStyle={
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex:2
      },
    content: {
        //backgroudColor:'rgba(0,0,0,0.6)',
        top: "70%",
        left: "50%",
        width:'100%',
        height:'100%',
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0,0,0,0)",
        border:'none',
      },
};

const ImageModal:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const openImage=useSelector(selectOpenImage);
    const planimage=useSelector(selectPlanImage);
    
    const deleteModal=()=>{
        dispatch(resetOpenImage());
    }

    return (
        <Modal
            isOpen={openImage}
            onRequestClose={async () => {
                dispatch(resetOpenImage());
            }}
            style={modalStyle}
            ariaHideApp={false}
        >
            <div onClick={deleteModal} className={styles.image_modal}>
                <img src={planimage} className={styles.image_modal_image}/>
            </div>     
        </Modal>
    )
}

export default ImageModal
