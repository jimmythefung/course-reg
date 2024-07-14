import { useState } from "react";

export default function Body({ columns, tableData, setTableData }) {
    const [editCell, setEditCell] = useState({});
    const handleChange = (inputValue, accessor) => {
        const newDataState = [...tableData];

        // Find the row and updated the property
        const row = newDataState.find((row) => row.id === editCell.id);
        row[accessor] = inputValue;

        // Update the state
        setTableData(newDataState);
    };
    return (
        <tbody>
            {tableData.map((data) => {
                return (
                    <tr key={data.id}>
                        {columns.map(({ accessor }) => {
                            const isEditing =
                                editCell.id === data.id &&
                                editCell.accessor === accessor;

                            const tData = data[accessor]
                                ? data[accessor]
                                : isEditing
                                ? ""
                                : "——";

                            return (
                                <td
                                    key={accessor}
                                    onClick={() =>
                                        setEditCell({ id: data.id, accessor })
                                    }
                                >
                                    {isEditing ? (
                                        <input
                                            value={tData}
                                            onChange={(e) =>
                                                handleChange(
                                                    e.target.value,
                                                    accessor
                                                )
                                            }
                                            onBlur={() => setEditCell({})}
                                            autoFocus
                                        />
                                    ) : (
                                        tData
                                    )}
                                </td>
                            );
                        })}
                    </tr>
                );
            })}
        </tbody>
    );
}
