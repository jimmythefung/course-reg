"use client";
import { useState } from "react";
import styles from "./Tabs.module.css";

export default function Tabs({ tabAndContentTable = null }) {
    let tabKeys =
        tabAndContentTable !== null ? Object.keys(tabAndContentTable) : [];
    const [activeTabNum, setActiveTabNum] = useState(tabKeys[0]);

    return (
        <div className={styles.tab_frame}>
            {/* Tabs: clickable buttons */}
            <div className={styles.tab_bar}>
                {tabKeys.map((k) => {
                    return (
                        <div
                            key={k}
                            className={` ${styles.tabbutton} ${
                                activeTabNum === k ? styles.active : ""
                            }`}
                            value={k}
                            onClick={(e) => {
                                setActiveTabNum(k);
                            }}
                        >
                            {k}
                        </div>
                    );
                })}
            </div>

            {/* Content of tabs */}
            {tabKeys.map((k) => {
                return (
                    <div
                        key={k}
                        className={`${
                            activeTabNum === k ? styles.show : styles.hide
                        }`}
                    >
                        {tabAndContentTable[k]}
                    </div>
                );
            })}
        </div>
    );
}
