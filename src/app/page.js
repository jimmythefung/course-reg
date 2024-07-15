"use client";
import styles from "./page.module.css";
import { useState, useEffect, useRef } from "react";
import Tabs from "@/components/Reusable/DisplayContainer/Tabs/Tabs";
import SortableTable from "@/components/Reusable/DisplayContainer/SortableTable/SortableTable";
import {
    class_columns,
    student_columns,
    enrollment_columns,
} from "./libs/columns_config";
import EditableKVForm from "@/components/Reusable/DisplayContainer/EditableKVForm/EditableKVForm";
import { getCurrentDatetimeLocal } from "./libs/timeutils";
import ModifiableDropdown from "@/components/Reusable/InputElement/ModifiableDropdown/ModifiableDropdown";

export default function Home() {
    const [studentsData, setStudents] = useState(null);
    const [classesData, setClasses] = useState(null);
    const [enrollmentsData, setEnrollment] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const [selectedNetid, setSelectedNetid] = useState("");
    const [selectedCode, setSelectedCode] = useState("");

    const [newStudentData, setNewStudent] = useState({
        netid: "",
        name: "",
        major: "",
        graduation: getCurrentDatetimeLocal() + "Z",
    });
    const [newClassData, setNewClass] = useState({
        code: "",
        name: "",
        subject: "",
        capacity: 30,
        term: "",
    });
    const [newEnrollmentData, setNewEnrollment] = useState({
        student_id: "",
        class_id: "",
    });

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

    const tabAndContentTable = {
        Students: (
            <div>
                <div className={styles.entry_form}>
                    <EditableKVForm
                        kvData={newStudentData}
                        changeHandler={setNewStudent}
                        keysAllowedToUpdate={Object.keys(newStudentData)}
                        submitHandler={(data) => {
                            fetch("/api/v1/student", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                            }).then((res) => {
                                window.location.reload();
                            });
                        }}
                    />
                </div>
                <SortableTable
                    data={studentsData}
                    columns={student_columns}
                    caption={"List of students"}
                    tableType={"student"}
                />
                <div className={styles.details}>
                    <h1>
                        Student Enrollment:{" "}
                        <ModifiableDropdown
                            changeHandler={(netid) => {
                                console.log("Selected netid: ", netid);
                                setSelectedNetid(netid);
                            }}
                            choiceList={studentsData.map((s) => {
                                return s.netid;
                            })}
                            displayvalue={selectedNetid}
                        />
                    </h1>
                    {enrollment_table_by_netid(enrollmentsData, selectedNetid)}
                </div>
            </div>
        ),
        Classes: (
            <div>
                <div className={styles.entry_form}>
                    <EditableKVForm
                        kvData={newClassData}
                        changeHandler={setNewClass}
                        keysAllowedToUpdate={Object.keys(newClassData)}
                        submitHandler={(data) => {
                            fetch("/api/v1/class", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                            }).then((res) => {
                                window.location.reload();
                            });
                        }}
                    />
                </div>
                <SortableTable
                    data={classesData}
                    columns={class_columns}
                    caption={"List of classes"}
                    tableType={"class"}
                />
                <div className={styles.details}>
                    <h1>
                        Enrollment by class:{" "}
                        <ModifiableDropdown
                            changeHandler={(code) => {
                                console.log("Selected code: ", code);
                                setSelectedCode(code);
                            }}
                            choiceList={classesData.map((c) => {
                                return c.code;
                            })}
                            displayvalue={selectedCode}
                        />
                    </h1>
                    {enrollment_table_by_code(enrollmentsData, selectedCode)}
                </div>
            </div>
        ),
        Enrollment: (
            <div>
                <div className={styles.entry_form}>
                    <EditableKVForm
                        kvData={newEnrollmentData}
                        changeHandler={setNewEnrollment}
                        keysAllowedToUpdate={Object.keys(newEnrollmentData)}
                        submitHandler={(data) => {
                            fetch("/api/v1/enrollment", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(data),
                            }).then((res) => {
                                window.location.reload();
                            });
                        }}
                    />
                </div>
                <SortableTable
                    data={enrollmentsData}
                    columns={enrollment_columns}
                    caption={"List of enrollment"}
                    tableType={"enrollment"}
                />
            </div>
        ),
    };

    return (
        <main className={styles.main}>
            <Tabs tabAndContentTable={tabAndContentTable} />
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
            grade: x.grade,
            name: x.student.name,
            netid: x.student.netid,
            title: x.class.name,
            code: x.class.code,
            remove: "X",
        };
    });
    return enrollmentData;
}

function enrollment_table_by_netid(enrollmentsData, netid) {
    const tableData = enrollmentsData.filter((x) => x.netid === netid);
    if (tableData.length === 0) {
        return <p>No enrollment data</p>;
    }
    return (
        <table className={styles.table}>
            <caption>List of enrollment</caption>
            <thead>
                <tr>
                    {Object.keys(tableData[0]).map((key) => {
                        return <th key={key}>{key}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row) => {
                    return (
                        <tr key={row.id}>
                            {Object.keys(row).map((key) => {
                                return <td key={key}>{row[key]}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function enrollment_table_by_code(enrollmentsData, code) {
    const tableData = enrollmentsData.filter((x) => x.code === code);
    if (tableData.length === 0) {
        return <p>No enrollment data</p>;
    }
    return (
        <table className={styles.table}>
            <caption>List of enrollment</caption>
            <thead>
                <tr>
                    {Object.keys(tableData[0]).map((key) => {
                        return <th key={key}>{key}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row) => {
                    return (
                        <tr key={row.id}>
                            {Object.keys(row).map((key) => {
                                return <td key={key}>{row[key]}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
