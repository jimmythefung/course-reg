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
import ModifiableText from "@/components/Reusable/InputElement/ModifiableText/ModifiableText";

export default function Home() {
    // Original list to be filter down for render
    const [originalStudents, setOriginalStudents] = useState([]);
    const [originalClasses, setOriginalClasses] = useState([]);
    const [originalEnrollments, setOriginalEnrollments] = useState([]);

    // For table rendering
    const [studentsData, setStudents] = useState([]);
    const [classesData, setClasses] = useState([]);
    const [enrollmentsData, setEnrollment] = useState([]);
    const [isLoading, setLoading] = useState(true);

    // One-to-many table for students and classes
    const [selectedNetid, setSelectedNetid] = useState("");
    const [enrollmentDataByNetid, setEnrollmentDataByNetid] = useState([]);
    const [selectedCode, setSelectedCode] = useState("");
    const [enrollmentDataByCode, setEnrollmentDataByCode] = useState([]);

    // Search params for student
    const [studentSearch, setStudentSearch] = useState({
        text: "",
        columnChoiceList: [],
        valueChoiceList: [],
        selectedColumn: "",
        selectedValue: "",
    });

    // Search params for class
    const [classSearch, setClassSearch] = useState({
        text: "",
        columnChoiceList: [],
        valueChoiceList: [],
        selectedColumn: "",
        selectedValue: "",
    });

    // Form data for new entry of student, class, and enrollment
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
                setOriginalStudents(add_remove_column(data));
                setStudents(add_remove_column(data));
                setSelectedNetid(data[0].netid);

                // Search params for student
                setStudentSearch((prev) => {
                    const newColumnList = Object.keys(data[0]).slice(1, 5);
                    const newValueList = [
                        ...new Set(
                            data.map((s) => {
                                return s[newColumnList[0]];
                            })
                        ),
                    ];
                    return {
                        ...prev,
                        columnChoiceList: newColumnList,
                        valueChoiceList: newValueList,
                        selectedColumn: newColumnList[0],
                        selectedValue: newValueList[0],
                    };
                });
            });
        fetch("/api/v1/class")
            .then((res) => res.json())
            .then((data) => {
                setOriginalClasses(add_remove_column(data));
                setClasses(add_remove_column(data));
                setSelectedCode(data[0].code);

                // Search params for class
                setClassSearch((prev) => {
                    const newColumnList = Object.keys(data[0]).slice(1, 5);
                    const newValueList = [
                        ...new Set(
                            data.map((s) => {
                                return s[newColumnList[0]];
                            })
                        ),
                    ];
                    return {
                        ...prev,
                        columnChoiceList: newColumnList,
                        valueChoiceList: newValueList,
                        selectedColumn: newColumnList[0],
                        selectedValue: newValueList[0],
                    };
                });
            });
        fetch("/api/v1/enrollment")
            .then((res) => res.json())
            .then((data) => {
                setOriginalEnrollments(normalize_enrollment(data));
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
                <div className="search_and_filter">
                    <ModifiableText
                        textTitle="Search for student"
                        changeHandler={(text) => {
                            setStudents(
                                originalStudents.filter((s) =>
                                    s.name
                                        .toLowerCase()
                                        .includes(text.toLowerCase())
                                )
                            );
                        }}
                    />
                    <ModifiableDropdown
                        title="Filter Column By"
                        choiceList={studentSearch.columnChoiceList}
                        displayvalue={studentSearch.selectedColumn}
                        changeHandler={(column) => {
                            const newValueList = [
                                ...new Set(
                                    studentsData.map((s) => {
                                        return s[column];
                                    })
                                ),
                            ];
                            setStudentSearch({
                                ...studentSearch,
                                selectedColumn: column,
                                valueChoiceList: newValueList,
                                selectedValue: newValueList[0],
                            });
                        }}
                    />
                    <ModifiableDropdown
                        title="Values"
                        choiceList={studentSearch.valueChoiceList}
                        displayvalue={studentSearch.selectedValue}
                        changeHandler={(value) => {
                            setStudentSearch({
                                ...studentSearch,
                                selectedValue: value,
                            });
                            setStudents(
                                originalStudents.filter(
                                    (s) =>
                                        s[studentSearch.selectedColumn] ===
                                        value
                                )
                            );
                        }}
                    />
                    <button
                        onClick={() => {
                            setStudents(originalStudents);
                        }}
                    >
                        Reset
                    </button>
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
                            choiceList={originalStudents.map((s) => {
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
                    {enrollmentDataByNetid.length !== 0 ? (
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
                <div className="search_and_filter">
                    <ModifiableText
                        textTitle="Search for class"
                        changeHandler={(text) => {
                            setClasses(
                                originalClasses.filter((c) =>
                                    c.name
                                        .toLowerCase()
                                        .includes(text.toLowerCase())
                                )
                            );
                        }}
                    />
                    <ModifiableDropdown
                        title="Filter Column By"
                        choiceList={classSearch.columnChoiceList}
                        displayvalue={classSearch.selectedColumn}
                        changeHandler={(column) => {
                            const newValueList = [
                                ...new Set(
                                    classesData.map((c) => {
                                        return c[column];
                                    })
                                ),
                            ];
                            setClassSearch({
                                ...classSearch,
                                selectedColumn: column,
                                valueChoiceList: newValueList,
                                selectedValue: newValueList[0],
                            });
                        }}
                    />
                    <ModifiableDropdown
                        title="Values"
                        choiceList={classSearch.valueChoiceList}
                        displayvalue={classSearch.selectedValue}
                        changeHandler={(value) => {
                            setClassSearch({
                                ...classSearch,
                                selectedValue: value,
                            });
                            setClasses(
                                originalClasses.filter(
                                    (c) =>
                                        c[classSearch.selectedColumn] === value
                                )
                            );
                        }}
                    />
                    <button
                        onClick={() => {
                            setClasses(originalClasses);
                        }}
                    >
                        Reset
                    </button>
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
                            choiceList={originalClasses.map((c) => {
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
                    {enrollmentDataByCode.length !== 0 ? (
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
