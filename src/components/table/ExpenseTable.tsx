import React, { useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ExpenseItemType, Tag } from "../../api/ApiResponses";
import { IconButton } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TagPopper from "../popper/TagPopper";
import './expenseTable.css'
import { apiCaller } from "../../api/apicaller";
import { createTagApi } from "../../api/tagApi";
import { toast } from "react-toastify";
import { updateExpense } from "../../api/expensesApi";


interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[]
    pagination?: boolean,
    height: number | string
}

const dummyAnchor = document.createElement('div');

export default function ExpenseTable(
    {clazzName, 
        expenses, 
        pagination, 
        height,
    } : TableProps){
        
    const [rowData, setRowData] = useState<ExpenseItemType[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openPopperId, setOpenPopperId] = useState<string | null>(null);

    useEffect(() => {
        setRowData(expenses);
    }, [expenses]);

    const handleClose = () => {
        setOpenPopperId(null);
    };

    const handleOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
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
                    clazzName="popperCentered"
                    expenseId={props.data.id}
                    anchorEl={dummyAnchor}
                    open={openPopperId === props.data.id}
                    onClose={handleClose}
                    onCreate={handleCreateTag}
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