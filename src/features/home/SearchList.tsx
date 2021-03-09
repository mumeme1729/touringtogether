import React,{useState,useEffect} from 'react'
import {selectSearchPlans} from "../plan/planSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Plan from "../plan/Plan";
import {

}from "../plan/planSlice";

const SearchList:React.FC = () => {
    const searchplans=useSelector(selectSearchPlans);
    const dispatch: AppDispatch = useDispatch();


   
    return (
        <div>
            {searchplans.length?
                <>    
                    {searchplans.map((plan)=>(
                        <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text}/>
                    ))}
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
