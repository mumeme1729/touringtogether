import React,{useState} from 'react'
import { useDispatch,useSelector } from "react-redux";
import { Button, TextField, IconButton,Menu,MenuItem } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import {
    fetchAsyncSearchPlans,
    selectPrefectures
}from "../plan/planSlice";
import {Link} from 'react-router-dom';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import styles from "./Home.module.css";

const ITEM_HEIGHT=47;

const Search:React.FC = () => {
    const dispatch = useDispatch();
    const [destination,setDestination]=useState("");
    const [date,setDate]=useState("");
    const [anchorEl, setAnchorEl] =useState(null);
    const [prefecture,setPrefecture]=useState("");
    const [pref,setP]=useState("");
    const prefectures=useSelector(selectPrefectures);
    const open = Boolean(anchorEl);
    const searchPlan =()=>{
        const packet = { destination: destination, date: date,prefecture:String(prefecture)};
        dispatch(fetchAsyncSearchPlans(packet));
        setDestination("");
        setDate("");
    }

    const handleClick = (event:any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setPrefecture("");
        setP("");
      };
    
      const setPref=(e:any)=>{
        setPrefecture(e.id)
        setP(e.name);
      }

    return (
        <div className={styles.search_container}>
            <div className={styles.search_body}>
                <SearchIcon/>ツーリング仲間を探す
                <br/>
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
