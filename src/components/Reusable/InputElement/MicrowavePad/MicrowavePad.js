"use client";
import styles from "./MicrowavePad.module.css";

export default function ModifiableNumpad({
    changeHandler,
    keypad,
    title = null,
}) {
    function getNumRow(rowArr) {
        return (
            <div className={styles.num_row}>
                {rowArr.map((n) => {
                    return (
                        <div
                            key={n}
                            className={styles.numbtn}
                            onClick={() => {
                                changeHandler(n);
                            }}
                        >
                            {n}
                        </div>
                    );
                })}
            </div>
        );
    }
    return (
        <div className={styles.microwavepad}>
            <div className={styles.left}>
                {title ? <div>{title}</div> : ""}
                {keypad.map((numRow, ind) => {
                    return (
                        <div key={ind} className={styles.num_row}>
                            {getNumRow(numRow)}
                        </div>
                    );
                })}
            </div>
            <div className={styles.right}>
                <div
                    className={styles.clearbtn}
                    onClick={() => {
                        changeHandler(0);
                    }}
                >
                    Clear
                </div>
            </div>
        </div>
    );
}
