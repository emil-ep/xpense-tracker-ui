import { Box, Button, IconButton, Paper, Popper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag } from "../../../api/ApiResponses";
import TagKeywordsEditor from "./TagKeywordsEditor";
import { apiCaller } from "../../../api/apicaller";
import { editTagsApi } from "../../../api/tagApi";
import DeleteIcon from '@mui/icons-material/Delete';
import './tagTable.css';

interface TagTableProps {
    clazzName? : string;
    tags: Tag[];
    height: number | string;
}

export default function TagTable({ clazzName, tags, height } : TagTableProps) {
    const [rowData, setRowData] = useState<Tag[]>(tags);
    const [modifiedTags, setModifiedTags] = useState<Set<Tag>>(new Set<Tag>());
    const [edited, setEdited ] = useState<boolean>(false);
    const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
    const [rowToDelete, setRowToDelete] = useState<Tag | null>(null);

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


    const operationsCellRenderer = (props: any) => {
        return (
            <IconButton aria-label="delete-tag" onClick={(e) => handleDeleteClick(e, props.data)}>
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


    const handleDeleteClick = (event: React.MouseEvent<HTMLElement>, row: Tag) => {
        setPopperAnchor(event.currentTarget);
        setRowToDelete(row);
    };

    const confirmDelete = async () => {
        if (!rowToDelete) return;

        // Call the delete API here
        console.log("Deleting row:", rowToDelete);

        // Update the rowData to remove the deleted row
        setRowData((prev) => prev.filter((row) => row.id !== rowToDelete.id));

        // Close the popper
        setPopperAnchor(null);
        setRowToDelete(null);
    };

    const cancelDelete = () => {
        setPopperAnchor(null);
        setRowToDelete(null);
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
            <Popper open={Boolean(popperAnchor)} anchorEl={popperAnchor} style={{ zIndex: 1100 }}>
                <Paper elevation={3}>
                    <Box p={2}>
                        <Typography>Are you sure you want to delete this tag?</Typography>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button variant="contained" color="error" onClick={confirmDelete}>
                                Yes
                            </Button>
                            <Button variant="outlined" onClick={cancelDelete}>
                                No
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Popper>
            {Boolean(popperAnchor) && (
                    <div
                        className="overlay"
                        onClick={cancelDelete}
                    />
                )
            }
        </div>
    )
}