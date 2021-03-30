import React,{useEffect} from 'react'
import SearchList from "./SearchList";
import { useSelector,useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {Link,useLocation} from 'react-router-dom';
import {selectSearchPlans,fetchAsyncSearchPlans,startLoad,endLoad,selectLoadPlan} from '../plan/planSlice';
import styles from "./Home.module.css";
import { count } from 'node:console';
import {CircularProgress} from "@material-ui/core";


const SearchResults:React.FC = () => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch();
    const words=(location.pathname.split('/'));
    const searchplans=useSelector(selectSearchPlans);
    const isloadplan=useSelector(selectLoadPlan);

    useEffect(() => {
        const fetchLoader = async ()=>{ 
            if (localStorage.localJWT) { 
                dispatch(startLoad())
                const destination=words[2].replace(/destination=/g,"");
                const date=words[3].replace(/date=/g,"");
                const prefecture=words[4].replace(/prefecture=/g,"");
                
                    
                const packet = { destination: destination, date: date,prefecture:String(prefecture)};
                await dispatch(fetchAsyncSearchPlans(packet));
                dispatch(endLoad())
                    
                
            }
        };
        fetchLoader();
    },[]);



    return (
        <div className={styles.home_container}>
            <div className={styles.home_body}> 
            <div className={styles.home_title}>
                <h2 className={styles.title_h2}>検索結果</h2>
            </div>
            <br/>  
            <br/>
            <div className={styles.searchresult_min}>
                {isloadplan?
                        <> 
                            <CircularProgress />
                        </>
                    :
                        <>
                            <SearchList/>
                        </>
                }
                
            </div>
            </div>
        </div>
    )
}

export default SearchResults
