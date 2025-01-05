import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag } from "../../../api/ApiResponses";

interface TagTableProps {
    clazzName? : string;
    tags: Tag[];
    height: number | string;
}

const headers: Object[] = [
    // {field: "id"},
    {field: "name"},
    {field: "tagType"},
    {field: "keywords"}
];

export default function TagTable({ clazzName, tags, height } : TagTableProps) {

    console.log('tags : ', tags)
    const [rowData, setRowData] = useState<Tag[]>(tags);

    useEffect(() => {
        setRowData(tags);
    }, [tags])

    return (
        <div 
            className={`ag-theme-quartz-auto-dark ${clazzName}`}
            style={{ height: height}}
        >
            <AgGridReact 
                rowData={rowData}
                columnDefs={headers}
            />
        </div>
    )
}