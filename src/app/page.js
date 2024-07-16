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
    const [enrollmentDataByNetid, setEnrollmentDataByNetid] = useState(null);
    const [selectedCode, setSelectedCode] = useState("");
    const [enrollmentDataByCode, setEnrollmentDataByCode] = useState(null);

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
        console.log("Fetching data via APIs...");
        fetch("/api/v1/student")
            .then((res) => res.json())
            .then((data) => {
                setStudents(add_remove_column(data));
                setSelectedNetid(data[0].netid);
            });
        fetch("/api/v1/class")
            .then((res) => res.json())
            .then((data) => {
                setClasses(add_remove_column(data));
                setSelectedCode(data[0].code);
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
                            choiceList={studentsData.map((s) => {
                                return s.netid;
                            })}
                            displayvalue={selectedNetid}
                            changeHandler={(netid) => {
                                console.log("Selected netid: ", netid);
                                setEnrollmentDataByNetid(
                                    enrollmentsData.filter(
                                        (x) => x.netid === netid
                                    )
                                );
                                setSelectedNetid(netid);
                            }}
                        />
                    </h1>
                    {enrollmentDataByNetid !== null ? (
                        <SortableTable
                            data={enrollmentDataByNetid}
                            columns={enrollment_columns}
                            caption={"Courses enrolled by " + selectedNetid}
                            tableType={"class"}
                        />
                    ) : (
                        "No enrollment data for " + selectedNetid
                    )}
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
                            choiceList={classesData.map((c) => {
                                return c.code;
                            })}
                            displayvalue={selectedCode}
                            changeHandler={(code) => {
                                console.log("Selected code: ", code);
                                setEnrollmentDataByCode(
                                    enrollmentsData.filter(
                                        (x) => x.code === code
                                    )
                                );
                                setSelectedCode(code);
                            }}
                        />
                    </h1>
                    {enrollmentDataByCode !== null ? (
                        <SortableTable
                            data={enrollmentDataByCode}
                            columns={enrollment_columns}
                            caption={
                                "Students enrolled in course: " + selectedCode
                            }
                            tableType={"class"}
                        />
                    ) : (
                        "No enrollment data for " + selectedCode
                    )}
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
