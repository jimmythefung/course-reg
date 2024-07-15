import { useState } from "react";

export const useSortableTable = (data, columns, tableType) => {
    const [tableData, setTableData] = useState(
        getDefaultSorting(data, columns)
    );

    const handleSorting = (sortField, sortOrder) => {
        console.log(tableData);
        if (sortField) {
            const sorted = [...tableData].sort((a, b) => {
                if (a[sortField] === null) return 1;
                if (b[sortField] === null) return -1;
                if (a[sortField] === null && b[sortField] === null) return 0;
                return (
                    a[sortField]
                        .toString()
                        .localeCompare(b[sortField].toString(), "en", {
                            numeric: true,
                        }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setTableData(sorted);
        }
    };

    const handleRemove = (id) => {
        console.log(
            "Handling remove for id: " + id.toString() + " in " + tableType
        );
        if (tableType === "student") {
            fetch("/api/v1/student?student_id=" + id.toString(), {
                method: "DELETE",
            }).then((res) => {
                if (res.ok) {
                    setTableData(tableData.filter((row) => row.id !== id));
                }
            });
        }

        if (tableType === "class") {
            fetch("/api/v1/class?class_id=" + id.toString(), {
                method: "DELETE",
            }).then((res) => {
                if (res.ok) {
                    setTableData(tableData.filter((row) => row.id !== id));
                }
            });
        }

        if (tableType === "enrollment") {
            const student_id = id.split("_")[0];
            const class_id = id.split("_")[1];
            fetch(
                "/api/v1/enrollment?student_id=" +
                    student_id.toString() +
                    "&" +
                    "class_id=" +
                    class_id.toString(),
                {
                    method: "DELETE",
                }
            ).then((res) => {
                if (res.ok) {
                    setTableData(
                        tableData.filter(
                            (row) =>
                                row.student_id !== Number(student_id) &&
                                row.class_id !== Number(class_id)
                        )
                    );
                }
            });
        }
    };

    const handleUpdate = (id, field, value) => {
        console.log(
            "Handling Update for id: " + id.toString() + " in " + tableType
        );
        if (tableType === "student") {
            fetch("/api/v1/student?student_id=" + id.toString(), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            }).then((res) => {
                if (res.ok) {
                    setTableData(
                        tableData.map((row) =>
                            row.id === id ? { ...row, [field]: value } : row
                        )
                    );
                }
            });
        }

        if (tableType === "class") {
            fetch("/api/v1/class?class_id=" + id.toString(), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            }).then((res) => {
                if (res.ok) {
                    setTableData(
                        tableData.map((row) =>
                            row.id === id ? { ...row, [field]: value } : row
                        )
                    );
                }
            });
        }

        if (tableType === "enrollment") {
            const student_id = id.split("_")[0];
            const class_id = id.split("_")[1];
            fetch(
                "/api/v1/enrollment?student_id=" +
                    student_id.toString() +
                    "&" +
                    "class_id=" +
                    class_id.toString(),
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ [field]: value }),
                }
            ).then((res) => {
                if (res.ok) {
                    setTableData(
                        tableData.map((row) =>
                            row.student_id === Number(student_id) &&
                            row.class_id === Number(class_id)
                                ? { ...row, [field]: value }
                                : row
                        )
                    );
                }
            });
        }
    };

    return [tableData, setTableData, handleSorting, handleRemove, handleUpdate];
};

function getDefaultSorting(defaultTableData, columns) {
    const sorted = [...defaultTableData].sort((a, b) => {
        const filterColumn = columns.filter((column) => column.sortbyOrder);

        // Merge all array objects into single object and extract accessor and sortbyOrder keys
        let { accessor = "id", sortbyOrder = "asc" } = Object.assign(
            {},
            ...filterColumn
        );

        if (a[accessor] === null) return 1;
        if (b[accessor] === null) return -1;
        if (a[accessor] === null && b[accessor] === null) return 0;

        const ascending = a[accessor]
            .toString()
            .localeCompare(b[accessor].toString(), "en", {
                numeric: true,
            });

        return sortbyOrder === "asc" ? ascending : -ascending;
    });
    return sorted;
}
