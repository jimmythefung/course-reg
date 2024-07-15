import Body from "./Body";
import Head from "./Head";
import { useSortableTable } from "./useSortableTable";

export default function SortableTable({ data, columns, caption, tableType }) {
    const [tableData, setTableData, handleSorting, handleRemove] =
        useSortableTable(data, columns, tableType);

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
