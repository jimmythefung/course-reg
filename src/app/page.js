"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import EditableKVForm from "@/components/Reusable/DisplayContainer/EditableKVForm/EditableKVForm";
import SortableTable from "@/components/Reusable/DisplayContainer/SortableTable/SortableTable";

export default function Home() {
    const [studentsData, setStudents] = useState(null);
    const [classesData, setClasses] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const student_columns = [
        {
            label: "Name",
            accessor: "name",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "NetID",
            accessor: "studentid",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "Major",
            accessor: "major",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "Graduation",
            accessor: "graduation",
            sortable: true,
            sortbyOrder: "desc",
        },
    ];

    const class_columns = [
        {
            label: "Code",
            accessor: "code",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "Name",
            accessor: "name",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "Subject",
            accessor: "subject",
            sortable: true,
            sortbyOrder: "desc",
        },
        {
            label: "Term",
            accessor: "term",
            sortable: true,
            sortbyOrder: "desc",
        },
    ];

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
    if (!studentsData) return <p>No student data</p>;

    return (
        <main className={styles.main}>
            <SortableTable
                caption={"List of students"}
                data={studentsData}
                columns={student_columns}
            />
            <SortableTable
                caption={"List of classes"}
                data={classesData}
                columns={class_columns}
            />
        </main>
    );
}
