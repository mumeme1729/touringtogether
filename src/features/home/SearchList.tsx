import React from 'react'
import {selectSearchPlans} from "../plan/planSlice";
import { useSelector} from "react-redux";
import Plan from "../plan/Plan";
import {

}from "../plan/planSlice";

const SearchList:React.FC = () => {
    const searchplans=useSelector(selectSearchPlans);
    
    return (
        <div>
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
                        />
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
