import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './expenseTable.css'

import { ExpenseItemType, Tag } from "../../../api/ApiResponses";
import React, { useEffect, useState } from "react";
import { createTagApi, editTagApi } from "../../../api/tagApi";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AgGridReact } from 'ag-grid-react';
import { IconButton } from "@mui/material";
import TagPopper from "../../popper/TagPopper";
import { apiCaller } from "../../../api/apicaller";
import { toast } from "react-toastify";
import { updateExpense } from "../../../api/expensesApi";

interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[];
    pagination?: boolean;
    height: number | string;
    isPreview?: boolean;
}

const dummyAnchor = document.createElement('div');

export default function ExpenseTable(
    {clazzName, 
        expenses, 
        pagination, 
        height,
        isPreview
    } : TableProps){
        
    const [rowData, setRowData] = useState<ExpenseItemType[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openPopperId, setOpenPopperId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<Tag | null>();

    useEffect(() => {
        setRowData(expenses);
    }, [expenses]);

    const handleClose = () => {
        setOpenPopperId(null);
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setEditingTag(null);
        setAnchorEl(dummyAnchor);
        setOpenPopperId(id);
    }

    const handleCreateTag = async (tagName: string, keywords: string[], canBeConsideredExpense: boolean, expenseId: string) => {
        const body = {
            name : tagName,
            keywords : keywords,
            canBeCountedAsExpense: canBeConsideredExpense
    }

    try{
            const createTagResponse: any = await apiCaller(createTagApi(body));
            if(createTagResponse.status === 1){
                const tagId = createTagResponse.data.id;
                const tag = createTagResponse.data;
                const updateExpenseBody = {
                    tagIds: [tagId]
                }
                handleClose();
                const updateExpenseResponse: any = await apiCaller(updateExpense(expenseId, updateExpenseBody));
                if(updateExpenseResponse.status === 1){
                    toast("Expense Saved!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "dark",
                    });
                    setRowData((prevRowData) =>
                        prevRowData.map((expense) =>
                            expense.id === expenseId
                            ? { ...expense, tags: [...expense.tags, tag] } // Add the new tag
                            : expense
                        )
                    );
                }
            }
        } catch(err) {
            toast("Creating tag failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const handleEditTag = (event: React.MouseEvent<HTMLElement>, expenseId: string, tag: Tag) => {
        setAnchorEl(dummyAnchor); // Keep the popper aligned
        setOpenPopperId(expenseId);
        setEditingTag(tag); // Set the tag to edit
    };

    const handleEditTagSave = async (updatedTag: Tag, expenseId: string) => {
        try {
            // Call API to update the tag
            const updateTagResponse: any = await apiCaller(editTagApi(updatedTag));
            if (updateTagResponse.status === 1) {
                toast("Tag updated!", {
                    position: "top-right",
                    autoClose: 5000,
                    theme: "dark",
                });

                // Update the state with the modified tag
                setRowData((prevRowData) =>
                    prevRowData.map((expense) =>
                        expense.id === expenseId
                            ? {
                                ...expense,
                                tags: expense.tags.map((tag) =>
                                    tag.id === updatedTag.id ? updatedTag : tag
                                ),
                            }
                            : expense
                    )
                );
            }
        } catch (err) {
            toast("Updating tag failed", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
        handleClose();
    };

    const tagCellRenderer = (props: any) => {
        return (
            <div>
                {props.value.map((tag: Tag, index: number) => (
                    <button key={index} className="tag-button" onClick={(e) => handleEditTag(e, props.data.id, tag)}>
                        {tag.name}
                    </button>
                ))}
                <IconButton aria-label="add-tag" onClick={(e) => handleOpen(e, props.data.id)}>
                    <AddCircleIcon />
                </IconButton>
                {!isPreview && 
                    <TagPopper
                        clazzName="popperCentered"
                        expenseId={props.data.id}
                        tag={editingTag}
                        anchorEl={dummyAnchor}
                        open={openPopperId === props.data.id}
                        onClose={handleClose}
                        onCreate={handleCreateTag}
                        onEdit={handleEditTagSave}
                    />
                }
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
                rowData={rowData}
                columnDefs={headers}
            />
            {openPopperId && (
                <div
                    className="overlay"
                    onClick={handleClose}
                />
            )}
        </div>
)
}