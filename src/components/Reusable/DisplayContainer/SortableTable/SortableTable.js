import Body from "./Body";
import Head from "./Head";
import { useSortableTable } from "./useSortableTable";

export default function SortableTable({ data, columns, caption }) {
    const [tableData, handleSorting] = useSortableTable(data, columns);

    return (
        <table className="table">
            <caption>{caption}</caption>
            <Head columns={columns} handleSorting={handleSorting} />
            <Body columns={columns} tableData={tableData} />
        </table>
    );
}
