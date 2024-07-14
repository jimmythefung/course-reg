import Body from "./Body";
import Head from "./Head";
import { useSortableTable } from "./useSortableTable";

export default function SortableTable({ data, columns, caption }) {
    // console.log(columns);
    // columns.push({
    //     label: "remove",
    //     accessor: "remove",
    // });
    // console.log(columns);
    // data = data.map((row) => {
    //     return { ...row, remove: <div>X</div> };
    // });
    const [tableData, setTableData, handleSorting, handleRemove] =
        useSortableTable(data, columns);

    return (
        <table className="table">
            <caption>{caption}</caption>
            <Head columns={columns} handleSorting={handleSorting} />
            <Body
                columns={columns}
                tableData={tableData}
                setTableData={setTableData}
                handleRemove={handleRemove}
            />
        </table>
    );
}

// function removeButton(_id, deleteEntryHandler) {
//     return (
//         <div
//             // className={styles.removeBtn}
//             onClick={() => {
//                 deleteEntryHandler(_id);
//             }}
//         >
//             X
//         </div>
//     );
// }
