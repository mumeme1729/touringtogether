import React from 'react'
import dayjs from 'dayjs';
import styles from "./Plan.module.css";

const PrintDate:React.FC<{created_on:string}> = (props) => {
    const now  = dayjs().unix();
    const created_on=dayjs(props.created_on).unix();
    const lag=(now-created_on);
    const minutes=Math.floor(lag/60);
    let timelag="";
    if(minutes>0){
        const days=Math.floor(minutes/1440);
        if(days>0){
            timelag=String(days)+"d";
        }else{
            const hours=Math.floor(minutes/60);
            if(hours>0){
                timelag=String(hours)+"h";
            }else{
                timelag=String(minutes)+"m";
            }
        }
    }else{
        timelag="now"
    }

    return (
        <div className={styles.created_on}>
            <p className={styles.created_on_p}>{timelag}</p>
        </div>
    )
}

export default PrintDate
