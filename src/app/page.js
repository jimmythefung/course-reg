"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [data, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/student")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No student data</p>;

    return (
        <main className={styles.main}>
            <div>
                <h1>{data[0].studentid}</h1>
            </div>
        </main>
    );
}
