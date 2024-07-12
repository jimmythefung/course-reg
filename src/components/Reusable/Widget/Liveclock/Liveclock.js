import { calDuration, getCurrentDatetimeLocal, msToHumanReadableTime } from "@/libs/timeutils";
import styles from "./Liveclock.module.css";
import { useState, useEffect } from "react";

export default function Liveclock({ message=null, sinceTime = null, color = "" }) {
    const [clock, setClock] = useState(message);
    const durationInMS = 1000;
    const dependencies = [];
    useEffect(() => {
        setInterval(() => {
            if (sinceTime === null) {
                setClock(getCurrentClockString());
            } else {
                setClock( message + getElapsedTimeString(sinceTime) + " ago");
            }
        }, durationInMS);
    }, dependencies);
    if (color == "red") {
        return <div className={`${styles.red}`}>{clock}</div>;
    } else if (color == "green") {
        return <div className={`${styles.green}`}>{clock}</div>;
    } else {
        return <div>{clock}</div>;
    }
}

/* ###############
 * Helpers
 * ################ */
function getCurrentClockString() {
    const dateObject = new Date();
    const hour = dateObject.getHours();
    const minute = dateObject.getMinutes();
    const second = dateObject.getSeconds();
    const currentClock = hour + " : " + minute + " : " + second;
    return currentClock;
}

function getElapsedTimeString(sinceTime) {
    const duration = calDuration(sinceTime, getCurrentDatetimeLocal());
    return msToHumanReadableTime(duration);
}
