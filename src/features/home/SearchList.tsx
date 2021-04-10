import React,{useEffect,useState} from 'react'
import {selectSearchPlans} from "../plan/planSlice";
import Plan from "../plan/Plan";
import {selectNextPage,fetchAsyncSearchPlansPage,setNextPagePlans,}from "../plan/planSlice";
import UseInfiniteScroll from './UseInfiniteScroll'
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';

const SearchList:React.FC = () => {
    const searchplans=useSelector(selectSearchPlans);
    
    const [isFetching, setIsFetching] = UseInfiniteScroll(fetchMoreListItems);
    const nextpage=useSelector(selectNextPage);
    const dispatch: AppDispatch = useDispatch();

    
      async function fetchMoreListItems() {
            if(nextpage!==null){
                const a=await dispatch(fetchAsyncSearchPlansPage(nextpage));
                dispatch(setNextPagePlans(a.payload.results));
            }
            setIsFetching(false)
      }
    
    return (
        <div >
            
            {searchplans.length?
                <>    
                    {searchplans.map((plan)=>(
                         <Plan key={plan.id} 
                               id={plan.id} 
                               title={plan.title}
                               departure={plan.departure} 
                               prefecture={plan.prefecture} 
                               destination={plan.destination} 
                               date={plan.date} 
                               userPlan={plan.userPlan} 
                               created_on={plan.created_on} 
                               text={plan.text} 
                               img={plan.img} 
                               profile={plan.profile}
                               likes={plan.likes}
                        />
                    ))} 
                    
                    {/* {isFetching && <CircularProgress/>} */}
                </>
                // 検索結果なし
                :
                    <>
                        検索結果がありませんでした。
                    </>
            }
        </div>
    )
}

export default SearchList
