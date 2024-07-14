"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import EditableKVForm from "@/components/Reusable/DisplayContainer/EditableKVForm/EditableKVForm";
import SortableTable from "@/components/Reusable/DisplayContainer/SortableTable/SortableTable";
import {
    class_columns,
    student_columns,
    enrollment_columns,
} from "./libs/columns_config";

export default function Home() {
    const [studentsData, setStudents] = useState(null);
    const [classesData, setClasses] = useState(null);
    const [enrollmentsData, setEnrollment] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/student")
            .then((res) => res.json())
            .then((data) => {
                setStudents(data);
            });
        fetch("/api/v1/class")
            .then((res) => res.json())
            .then((data) => {
                setClasses(data);
            });
        fetch("/api/v1/enrollment")
            .then((res) => res.json())
            .then((data) => {
                const extractedData = data.map((x) => {
                    return {
                        id: Number(x.student_id) + "_" + Number(x.class_id),
                        student_id: x.student_id,
                        class_id: x.class_id,
                        grade: x.grade ? x.grade : "TBD",
                        name: x.student.name,
                        netid: x.student.netid,
                        title: x.class.name,
                        code: x.class.code,
                    };
                });
                setEnrollment(extractedData);
                setLoading(false);
            });
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (!studentsData) return <p>No student data</p>;

    return (
        <main className={styles.main}>
            <SortableTable
                data={studentsData}
                columns={student_columns}
                caption={"List of students"}
            />
            <SortableTable
                data={classesData}
                columns={class_columns}
                caption={"List of classes"}
            />
            <SortableTable
                data={enrollmentsData}
                columns={enrollment_columns}
                caption={"List of enrollment"}
            />
        </main>
    );
}
