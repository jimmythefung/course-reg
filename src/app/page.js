"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import EditableKVForm from "@/components/Reusable/DisplayContainer/EditableKVForm/EditableKVForm";

export default function Home() {
    const [students, setStudents] = useState(null);
    const [classes, setClasses] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/student")
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
            });
        fetch("/api/v1/class")
            .then((res) => res.json())
            .then((classes) => {
                setClasses(classes);
                setLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!students) return <p>No student data</p>;

    return (
        <main className={styles.main}>
            <h2>Students</h2>
            <div className={styles.student_table}>
                {students.map((s, ind) => {
                    return <EditableKVForm kvData={s} />;
                })}
            </div>

            <h2>Classes</h2>
            <div className={styles.class_table}>
                {classes.map((c, ind) => {
                    return <EditableKVForm kvData={c} />;
                })}
            </div>
        </main>
    );
}
