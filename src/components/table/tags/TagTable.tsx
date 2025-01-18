import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag } from "../../../api/ApiResponses";
import TagKeywordsEditor from "./TagKeywordsEditor";
import { apiCaller } from "../../../api/apicaller";
import { editTagsApi } from "../../../api/tagApi";
import DeleteIcon from '@mui/icons-material/Delete';

interface TagTableProps {
    clazzName? : string;
    tags: Tag[];
    height: number | string;
}

const operationsCellRenderer = (props: any) => {
    return (
        <IconButton aria-label="delete-tag" >
            <DeleteIcon />
        </IconButton>
    )
}


const headers: Object[] = [
    {
        field: "name",
        editable: true
    },
    {field: "tagType"},
    {
        field: 'keywords',
        editable: true,
        cellEditor: TagKeywordsEditor,
    },
    {
        field: 'Operations',
        cellRenderer: operationsCellRenderer,
        sortable: false
    }
];



export default function TagTable({ clazzName, tags, height } : TagTableProps) {
    const [rowData, setRowData] = useState<Tag[]>(tags);
    const [modifiedTags, setModifiedTags] = useState<Set<Tag>>(new Set<Tag>());
    const [edited, setEdited ] = useState<boolean>(false);

    useEffect(() => {
        setRowData(tags);
    }, [tags])


    const saveValue = async () => {
        const reqBody = {
            tags: Array.from(modifiedTags)
        }
        const response: any = await apiCaller(editTagsApi(reqBody));
        if(response.status === 1){
            setEdited(false);
        }else{
            setEdited(true);
        }

    }

    const handleCellEditingStopped = (event: any) => {
        setModifiedTags(modifiedTags?.add(event.data))
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