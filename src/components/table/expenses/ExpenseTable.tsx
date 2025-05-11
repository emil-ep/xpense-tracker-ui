import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './expenseTable.css'

import { ExpenseItemType, Tag, TagCategory, UploadResponse } from "../../../api/ApiResponses";
import React, { useEffect, useState } from "react";
import { createTagApi, editTagApi } from "../../../api/tagApi";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import { AgGridReact } from 'ag-grid-react';
import { IconButton } from "@mui/material";
import TagPopper from "../../popper/TagPopper";
import { apiCaller } from "../../../api/apicaller";
import { toast } from "react-toastify";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { updateExpense } from "../../../api/expensesApi";
import { showToast } from "../../../utils/ToastUtil";
import AttachmentUploadDialog from "../../popper/AttachmentUploadDialog";
import { uploadAttachment } from "../../../api/fileApi";

interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[];
    pagination?: boolean;
    height: number | string;
    isPreview?: boolean;
    tagCategories: TagCategory[];
    tags: Tag[];
}

const dummyAnchor = document.createElement('div');

export default function ExpenseTable(
    {clazzName, 
        expenses, 
        pagination, 
        height,
        isPreview,
        tagCategories,
        tags
    } : TableProps){
        
    const [rowData, setRowData] = useState<ExpenseItemType[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [openPopperId, setOpenPopperId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<Tag | null>();
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);

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

    const handleCreateTag = async (
        tagName: string, 
        keywords: string[], 
        expenseId: string, 
        selectedTagCategoryId: string | undefined
    ) => {
        const body = {
            name : tagName,
            keywords : keywords,
            tagCategoryId: selectedTagCategoryId
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
                    showToast("Expense Saved!");
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
            showToast("Creating tag failed")
        }
    }

    const openUploadDialog = (expenseId: string) => {
        setSelectedExpenseId(expenseId);
        setShowUploadDialog(true);
    };

    const closeUploadDialog = () => {
        setSelectedExpenseId(null);
        setShowUploadDialog(false);
    };

    const handleEditTag = (event: React.MouseEvent<HTMLElement>, expenseId: string, tag: Tag) => {
        setAnchorEl(dummyAnchor); // Keep the popper aligned
        setOpenPopperId(expenseId);
        setEditingTag(tag); // Set the tag to edit
    };

    const handleAttachmentUpload = async (file: File | null) => {
        if (!file || !selectedExpenseId) return;
        
        console.log("Uploading", file, "for expense:", selectedExpenseId);
        // const uploadAttachmentResponse: any = await apiCaller(uploadAttachment(file));
        const uploadAttachmentResponse: UploadResponse = await uploadAttachment(file);
        if(uploadAttachmentResponse.status === 1) {
            const updateExpenseResponse: any = await apiCaller(updateExpense(selectedExpenseId, {attachment: uploadAttachmentResponse.data.fileName}));
            if(updateExpenseResponse.status !== 1){
                showToast("Expense update failed!");
            }else{
                showToast("Attachment uploaded!");
                setRowData((prevRowData) =>
                    prevRowData.map((expense) =>
                        expense.id === selectedExpenseId
                            ? { ...expense, attachment: uploadAttachmentResponse.data.fileName }
                            : expense
                    )
                );
                closeUploadDialog();
            }
        }else{
            showToast("Attachment upload failed");
            return;
        }
    
    // Optionally update rowData if you want to reflect the new attachment
    };

    const handleEditTagSave = async (updatedTag: Tag, expenseId: string) => {
        try {
            // Call API to update the tag
            const updateTagResponse: any = await apiCaller(editTagApi(updatedTag));
            if (updateTagResponse.status === 1) {
                showToast("Tag updated!");
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

    const actionCellRenderer = (props: any) => {
        return (
            <div>
                <IconButton 
                aria-label="upload-attachment" 
                onClick={() => openUploadDialog(props.data.id)}
                >
                    <FileUploadIcon />
                </IconButton>
            </div>
        );
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
                        expense={props.data}
                        tag={editingTag}
                        tags={tags}
                        tagCategories={tagCategories}
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
        {field: "id", flex: 1},
        {field: "transactionDate", flex: 0.5, filter: "agTextColumnFilter", floatingFilter: true},
        {field: "description", flex: 1, filter: "agTextColumnFilter", floatingFilter: true},
        {field: "type", flex: 0.5, filter: "agTextColumnFilter", floatingFilter: true},
        {field: "amount", flex: 1, filter: "agTextColumnFilter", floatingFilter: true},
        {
            field: 'tags', 
            cellRenderer: tagCellRenderer, 
            sortable: true, 
            flex: 2
        },
        {field: "attachment", flex: 0.5},
        {field: "actions", flex: 1, cellRenderer: actionCellRenderer}
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
            <AttachmentUploadDialog
                open={showUploadDialog}
                onClose={closeUploadDialog}
                onUpload={handleAttachmentUpload}
            />
        </div>
)
}