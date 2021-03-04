import React,{useState,useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
    fetchAsyncNewPlan,
    setOpenNewPlan,
    resetOpenNewPlan,
    selectOpenPlan
}from "../plan/planSlice";
import { Button, TextField, IconButton } from "@material-ui/core";
import Modal from "react-modal";

const customStyles = {
    content: {
      top: "55%",
      left: "50%",
  
      width: 280,
      height: 220,
      padding: "50px",
  
      transform: "translate(-50%, -50%)",
    },
  };


const NewPlan:React.FC = () => {
    const dispatch = useDispatch();
    const openPlan=useSelector(selectOpenPlan);
    const [destination,setDestination]=useState("");
    const [date,setDate]=useState("");
    const [text,setText]=useState("");

    const newPlan = async()=>{
        const packet = { destination: destination, date: date ,text:text};
        await dispatch(fetchAsyncNewPlan(packet));
        setDestination("");
        setDate("");
        setText("");
        await dispatch(resetOpenNewPlan());
    }


    return (
        <>
            <Modal isOpen={openPlan}
                onRequestClose={async () => {
                    await dispatch(resetOpenNewPlan());
                }}
                style={customStyles}
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
                <br/>
                <Button
                    disabled={!destination || !date  ||!text}
                    variant="contained"
                    color="primary"
                    onClick={newPlan}
                >
                    投稿
                </Button>
            </form>
        </Modal>
            
        </>
    )
}

export default NewPlan
