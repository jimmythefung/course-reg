"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";

export default function Home() {
    const headerMessage = "Jimmy Fung";
    const [subtext, setSubtext] = useState("_");
    const full_subtext = "Rutgers Full Stack Demo";
    const idx = useRef({ forward: true, val: 0 });
    const durationInMS = 200;
    const dependencies = [];
    useEffect(() => {
        let intervalId = setInterval(() => {
            setSubtext(full_subtext.slice(0, idx.current.val) + "_|");
            if (idx.current.forward === true) {
                idx.current.val += 1;
            } else {
                idx.current.val -= 1;
            }
            if (idx.current.val === full_subtext.length) {
                idx.current.forward = false;
            }
            if (idx.current.val === 0) {
                idx.current.forward = true;
            }
        }, durationInMS);
        return () => {
            clearInterval(intervalId);
        };
    }, dependencies);
    return (
        <main className={styles.main}>
            <div className={styles.message}>{headerMessage}</div>
            <div className={styles.message}>{subtext}</div>
        </main>
    );
}
