"use client";
import styles from "./Clickable.module.css";

export default function Clickable({
    symbol = "Click Me",
    clickHandler,
    clickValue = symbol,
    isActive = false,
    bgColor = ""
}) {
    const colorStyleMap = {
        "": "",
        orange: styles.bg_orange,
        gray: styles.bg_gray,
        purple: styles.bg_purple,
    };

    const activeStyle = isActive? styles.isActive : ""
    return (
        <div
            className={`${styles.clickable} ${activeStyle} ${colorStyleMap[bgColor]}`}
            onClick={() => {
                clickHandler(clickValue);
            }}
        >
            {symbol}
        </div>
    );
}
