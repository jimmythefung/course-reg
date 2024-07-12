"use client";
import styles from "./ModifiableDropdown.module.css";

export default function ModifiableDropdown({
    title,
    choiceList = [],
    changeHandler = null,
    displayvalue = null,
}) {
    if (displayvalue === null) {
        displayvalue = choiceList[0];
    }

    return (
        <>
            <label htmlFor={title}>{title}</label>
            <select
                id={title}
                className={`${styles.modifiable_dropdown}`}
                value={displayvalue}
                // Conditional attributes: https://stackoverflow.com/a/35428331
                // {...(c == displayvalue && { attribute: true })}
                {...(changeHandler !== null && {
                    onChange: (e) => {
                        changeHandler(e.target.value);
                    },
                })}
            >
                {choiceList.map((c) => {
                    return (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    );
                })}
            </select>
        </>
    );
}
