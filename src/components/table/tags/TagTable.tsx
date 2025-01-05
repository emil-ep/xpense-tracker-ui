import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag } from "../../../api/ApiResponses";
import { TextField } from "@mui/material";

interface TagTableProps {
    clazzName? : string;
    tags: Tag[];
    height: number | string;
}

const keyWordsCellRenderer = (props: any) => {
    return (
        <TextField 
            value={props.value.join(",")} 
            variant="outlined" 
            fullWidth={true} 
        />
    )
}

const tagNameCellRenderer = (props: any) => {
    return (
        <TextField 
            value={props.value}
            variant="outlined"
            fullWidth={true}
        />
    )
}

const headers: Object[] = [
    // {field: "id"},
    {
        field: "name",
        cellRenderer: tagNameCellRenderer,
        sortable: true
    },
    {field: "tagType"},
    {
        field: 'keywords',
        cellRenderer: keyWordsCellRenderer,
        sortable: false
    }
];

export default function TagTable({ clazzName, tags, height } : TagTableProps) {
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