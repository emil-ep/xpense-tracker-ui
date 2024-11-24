import React, { useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ExpenseItemType, Tag } from "../../api/ApiResponses";
import { IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TagPopper from "../popper/TagPopper";


interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[]
    pagination?: boolean,
    height: number | string
    handleAddTag?: () => void;
    handleTagAdded?: (tag: string) => void;
}

const dummyAnchor = document.createElement('div');

export default function ExpenseTable(
    {clazzName, 
        expenses, 
        pagination, 
        height, 
        handleAddTag, 
        handleTagAdded
    } : TableProps){
        
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openPopperId, setOpenPopperId] = useState<string | null>(null);

    const handleClose = () => {
        setOpenPopperId(null);
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setAnchorEl(dummyAnchor);
        setOpenPopperId(id);
    }

    const tagCellRenderer = (props: any) => {
        return (
            <div>
                {props.value.map((tag: Tag, index: number) => (
                    <button key={index} className="tag-button" >
                        {tag.name}
                    </button>
                ))}
                <IconButton aria-label="add-tag" onClick={(e) => handleOpen(e, props.data.id)}>
                    <AddCircleIcon />
                </IconButton>
                <TagPopper
                    anchorEl={dummyAnchor}
                    open={openPopperId === props.data.id}
                    onClose={handleClose}
                    onCreate={handleTagAdded}
                />
            </div>
        );
    };  

    const headers: Object[] = [
        {field: "id"},
        {field: "transactionDate"},
        {field: "description"},
        {field: "type"},
        {field: "amount"},
        {
            field: 'tags', 
            cellRenderer: tagCellRenderer, 
            sortable: false, 
            cellRendererParams: {
                onTagAdded: handleTagAdded,
            },
        }
    ];

    
    return (
        <div
        className={`ag-theme-quartz-auto-dark ${clazzName}`} 
        style={{ height: height}}
        >
            <AgGridReact
                pagination={pagination? pagination : undefined}
                paginationPageSize={20}
                paginationPageSizeSelector={[20, 50, 100]}
                rowData={expenses}
                columnDefs={headers}
            />
        </div>
)
}