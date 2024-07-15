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
                setStudents(add_remove_column(data));
            });
        fetch("/api/v1/class")
            .then((res) => res.json())
            .then((data) => {
                setClasses(add_remove_column(data));
            });
        fetch("/api/v1/enrollment")
            .then((res) => res.json())
            .then((data) => {
                setEnrollment(normalize_enrollment(data));
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
                tableType={"student"}
            />
            <SortableTable
                data={classesData}
                columns={class_columns}
                caption={"List of classes"}
                tableType={"class"}
            />
            <SortableTable
                data={enrollmentsData}
                columns={enrollment_columns}
                caption={"List of enrollment"}
                tableType={"enrollment"}
            />
        </main>
    );
}

function add_remove_column(data) {
    return data.map((x) => {
        return { ...x, remove: "X" };
    });
}

function normalize_enrollment(data) {
    const enrollmentData = data.map((x) => {
        return {
            id: Number(x.student_id) + "_" + Number(x.class_id),
            student_id: x.student_id,
            class_id: x.class_id,
            grade: x.grade ? x.grade : "TBD",
            name: x.student.name,
            netid: x.student.netid,
            title: x.class.name,
            code: x.class.code,
            remove: "X",
        };
    });
    return enrollmentData;
}
