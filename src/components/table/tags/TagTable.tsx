import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag } from "../../../api/ApiResponses";
import TagKeywordsEditor from "./TagKeywordsEditor";

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
        editable: true
        // cellRenderer: tagNameCellRenderer,
        // sortable: true
    },
    {field: "tagType"},
    {
        field: 'keywords',
        // editable: (params: any) => params.data.tagType === 'CUSTOM',
        editable: true,
        cellEditor: TagKeywordsEditor,
        // cellRenderer: keyWordsCellRenderer,
        // sortable: false
    }
];



export default function TagTable({ clazzName, tags, height } : TagTableProps) {
    const [rowData, setRowData] = useState<Tag[]>(tags);
    const [edited, setEdited ] = useState<boolean>(false);

    useEffect(() => {
        setRowData(tags);
    }, [tags])


    const saveValue = () => {
        console.log('rows :', rowData)
    }

    const handleCellEditingStopped = () => {
        setEdited(true);
      };

    return (
        <div 
            className={`ag-theme-quartz-auto-dark ${clazzName}`}
            style={{ height: height}}
        >
            <AgGridReact 
                rowData={rowData}
                columnDefs={headers}
                onCellEditingStopped={handleCellEditingStopped}
            />
            <Button 
                sx={{ m : "0.5rem"}} 
                variant="contained" 
                disabled={!edited} 
                onClick={saveValue}
            >
                Save
            </Button>
        </div>
    )
}