import React,{useEffect} from 'react'
import SearchList from "./SearchList";
import { useSelector,useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {Link,useLocation} from 'react-router-dom';
import {selectSearchPlans,fetchAsyncSearchPlans } from '../plan/planSlice';
import styles from "./Home.module.css";
import { count } from 'node:console';

const SearchResults:React.FC = () => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const words=(location.pathname.split('/'));
    const searchplans=useSelector(selectSearchPlans);

    useEffect(() => {
        const fetchLoader = async ()=>{ 
            if (localStorage.localJWT) { 
                const destination=words[2].replace(/destination=/g,"");
                const date=words[3].replace(/date=/g,"");
                const prefecture=words[4].replace(/prefecture=/g,"");
                if(searchplans.length!==0){
                    if(searchplans[0].id===0){
                        const packet = { destination: destination, date: date,prefecture:String(prefecture)};
                        await dispatch(fetchAsyncSearchPlans(packet));
                    }
                }
            }
        };
        fetchLoader();
    },[]);



    return (
        <>
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>検索結果</h2>
            </div>
            <br/>  
            <br/>
            <div className={styles.searchresult_min}>
                <SearchList/>
            </div>
        </>
    )
}

export default SearchResults
