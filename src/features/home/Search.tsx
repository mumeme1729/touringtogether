import React,{useState,useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Button, TextField, IconButton } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {
    fetchAsyncSearchPlans
}from "../plan/planSlice";
import {Link} from 'react-router-dom';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import styles_css from "./Home.module.css";

const Search:React.FC = () => {
    const dispatch = useDispatch();
    const [destination,setDestination]=useState("");
    const [date,setDate]=useState("");
    

    const searchPlan = async()=>{
        const packet = { destination: destination, date: date};
        await dispatch(fetchAsyncSearchPlans(packet));
        setDestination("");
        setDate("");
    }


    return (
        <div className={styles_css.search_container}>
            <div className={styles_css.search_body}>
                <SearchIcon/>ツーリング仲間を探す
                <br/>
                <TextField
                        placeholder="目的地は？"
                        type="text"
                        defaultValue={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                <br/>
                <br />
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
                <Link to ="/search">
                    <Button
                        //disabled={!destination || !date}
                        variant="contained"
                        color="primary"
                        onClick={searchPlan}
                    >
                    検索
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Search
