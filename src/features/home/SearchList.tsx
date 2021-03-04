import React,{useState,useEffect} from 'react'
import {selectSearchPlans} from "../plan/planSlice";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import Plan from "../plan/Plan";
import { PROPS_PROFILE,PROPS_ALL_USER, PROPS_PLANS } from '../types';
const SearchList:React.FC = () => {
    const searchplans=useSelector(selectSearchPlans);
     const localsearchplans: {
         id: number;
         destination: string;
         date: string;
         userPlan: number;
         created_on: string;
         text: string;
     }[]=JSON.parse(localStorage.getItem("localsearchPlan") as string);

    
    return (
        <div>
            {searchplans.length?
                <>
                    {searchplans[0].id===0?
                        <>
                            {localsearchplans.map((plan)=>(
                                <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text}/>
                            ))}
                        </>
                    :
                        <>
                            {searchplans.map((plan)=>(
                                <Plan key={plan.id} id={plan.id} destination={plan.destination} date={plan.date} userPlan={plan.userPlan} created_on={plan.created_on} text={plan.text}/>
                            ))}
                        </>
                    }
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
