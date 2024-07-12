"use client";

import styles from "./ModifiableDatetime.module.css";
import * as timeutil from "@/libs/timeutils";

export default function ModifiableDatetime({
    title = "",
    changeHandler,
    timestamp,
    inputtype = "datetime-local",
    enableSetNowButton = false,
    setNowButtonName = "Set",
}) {
    const forLabel = "_".concat(title);
    // The inputtype is one of : "datetime-local" | "date" | "time"
    let displayvalue = timeutil.toDateTimeInputValue(timestamp);
    if (inputtype === "date") {
        displayvalue = timeutil.toDateInputValue(timestamp);
    }
    if (inputtype === "time") {
        // Gets the HH:MM from "HH::MM:SS"
        displayvalue = timeutil.toTimeInputValue(timestamp).substring(0, 5);
    }

    return (
        <div className={styles.modifiabledatetime}>
            {title.length > 0 ? <label htmlFor={forLabel}>{title}</label> : ""}
            <input
                className={
                    inputtype === "date"
                        ? styles.date_display
                        : inputtype === "datetime-local"
                        ? styles.datetime_display
                        : styles.time_display
                }
                type={inputtype}
                value={displayvalue}
                onChange={(e) => {
                    let newTimestamp = prepareNewTimestamp(
                        e.target.value,
                        timestamp,
                        inputtype
                    );
                    changeHandler(newTimestamp);
                }}
            />

            {enableSetNowButton ? (
                <input
                    className={styles.now_button}
                    type="button"
                    value={setNowButtonName}
                    onClick={(e) => {
                        changeHandler(timeutil.getCurrentDatetimeLocal());
                    }}
                />
            ) : (
                ""
            )}
        </div>
    );
}

function prepareNewTimestamp(newValue, oldTimestamp, inputtype = "") {
    // In case oldTimestamp is uninitialized to YYYY-MM-DDTHH:MM
    // i.e. oldTimestamp is undefined, '', 0, or '0' 
    if (!['T'].includes(oldTimestamp)) {
        oldTimestamp = timeutil.getCurrentDatetimeLocal();
    }
    let updatedTimestamp = newValue;
    let arr = oldTimestamp.split("T");
    if (inputtype == "date") {
        arr[0] = newValue;
        updatedTimestamp = arr.join("T");
    }
    if (inputtype == "time") {
        arr[1] = newValue;
        updatedTimestamp = arr.join("T");
    }
    return updatedTimestamp;
}
