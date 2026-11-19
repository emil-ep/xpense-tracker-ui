import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './expenseTable.css'

import { ExpenseItemType, Tag, TagCategory, UploadResponse } from "../../../api/ApiResponses";
import React, { useEffect, useState } from "react";
import { createTagApi, editTagApi } from "../../../api/tagApi";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import RotateRightTwoToneIcon from '@mui/icons-material/RotateRightTwoTone';


import { AgGridReact } from 'ag-grid-react';
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import TagPopper from "../../popper/TagPopper";
import { apiCaller } from "../../../api/apicaller";
import { toast } from "react-toastify";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { deleteExpense, updateExpense } from "../../../api/expensesApi";
import { showToast } from "../../../utils/ToastUtil";
import AttachmentUploadDialog from "../../popper/AttachmentUploadDialog";
import { uploadAttachment } from "../../../api/fileApi";
import AttachmentPreviewDialog from "../../popper/AttachmentPreviewDialog";
import DeleteExpenseDialog from "../../popper/DeleteExpenseDialog";
import { useBankAccount } from "../../../context/BankAccountContext";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[];
    pagination?: boolean;
    height: number | string;
    isPreview?: boolean;
    tagCategories: TagCategory[];
    tags: Tag[];
}

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
    const [tagData, setTagData] = useState<Tag[]>(tags);
    const [openPopperId, setOpenPopperId] = useState<string | null>(null);
    const [editingTag, setEditingTag] = useState<Tag | null>();
    const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [previewFileId, setPreviewFileId] = useState<string | null>(null);

    const [showPreviewDialog, setShowPreviewDialog] = useState<boolean>(false);
    const [showDeleteExpenseDialog, setShowDeleteExpenseDialog] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { selectedBankAccountId } = useBankAccount();
        

    useEffect(() => {
        setRowData(expenses);
    }, [expenses]);

    useEffect(() => {
        setTagData(tags);
    }, [tags]);

    const handleClose = () => {
        setOpenPopperId(null);
    };

    const handleOpen = (id: string) => {
        setEditingTag(null);
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
            tagCategoryId: selectedTagCategoryId,
            bankAccountId: selectedBankAccountId
        };

        let createdTag: Tag | null = null;

        try {
            const createTagResponse: any = await apiCaller(createTagApi(body));
            if (createTagResponse.status !== 1) {
                showToast("Creating tag failed");
                return;
            }

            const createdTagData: Tag = createTagResponse.data;
            createdTag = createdTagData;
            const expense = rowData.find((row) => row.id === expenseId);
            const tagIds = [...new Set([...(expense?.tags ?? []).map((existingTag) => existingTag.id), createdTagData.id])];
            const updateExpenseResponse: any = await apiCaller(updateExpense(expenseId, { tagIds }));

            setTagData((previousTags) => previousTags.some((tag) => tag.id === createdTagData.id)
                ? previousTags
                : [...previousTags, createdTagData]
            );

            if (updateExpenseResponse.status === 1) {
                setRowData((previousRows) => previousRows.map((row) =>
                    row.id === expenseId && !row.tags.some((tag) => tag.id === createdTagData.id)
                        ? { ...row, tags: [...row.tags, createdTagData] }
                        : row
                ));
                showToast("Expense saved!");
            } else {
                showToast(`Tag created, but could not be applied: ${updateExpenseResponse.message ?? "unknown error"}`);
            }
            handleClose();
        } catch (err) {
            if (createdTag) {
                setTagData((previousTags) => previousTags.some((tag) => tag.id === createdTag?.id)
                    ? previousTags
                    : [...previousTags, createdTag as Tag]
                );
                showToast("Tag created, but applying it failed. You can apply it from existing tags.");
                handleClose();
            } else {
                showToast("Creating tag failed");
            }
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

    const openDeleteExpenseDialog = (expenseId: string) => {
        setSelectedExpenseId(expenseId);
        setShowDeleteExpenseDialog(true);
    };

    const closeDeleteExpenseDialog = () => {
        setSelectedExpenseId(null);
        setShowDeleteExpenseDialog(false);
    }

    const handleEditTag = (expenseId: string, tag: Tag) => {
        setOpenPopperId(expenseId);
        setEditingTag(tag); // Set the tag to edit
    };

    const handleSelectExistingTag = async (tag: Tag, expense: ExpenseItemType) => {
        const expenseId = expense.id;
        if (!expenseId) return;

        if (expense.tags.some((existingTag) => existingTag.id === tag.id)) {
            setTagData((previousTags) => previousTags.map((existingTag) =>
                existingTag.id === tag.id ? tag : existingTag
            ));
            showToast("Tag keywords updated. This tag is already on the expense.");
            handleClose();
            return;
        }

        try {
            const tagIds = [...new Set([...expense.tags.map((existingTag) => existingTag.id), tag.id])];
            const response: any = await apiCaller(updateExpense(expenseId, { tagIds }));
            if (response.status === 1) {
                setTagData((previousTags) => previousTags.map((existingTag) =>
                    existingTag.id === tag.id ? tag : existingTag
                ));
                setRowData((prevRowData) => prevRowData.map((row) =>
                    row.id === expenseId
                        ? { ...row, tags: [...row.tags, tag] }
                        : row
                ));
                showToast("Tag applied to expense!");
                handleClose();
            } else {
                showToast(`Unable to apply tag: ${response.message ?? "unknown error"}`);
            }
        } catch (err) {
            showToast("Unable to apply tag to expense");
        }
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
                setTagData((previousTags) => previousTags.map((tag) =>
                    tag.id === updatedTag.id ? updatedTag : tag
                ));
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
                <IconButton
                    aria-label="delete-expense"
                    onClick={() => openDeleteExpenseDialog(props.data.id)}
                >
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    };
    const openAttachmentPreview = (fileId: string) => {
        setPreviewFileId(fileId);
        setShowPreviewDialog(true);
    };

    const closePreviewDialog = () => {
        setShowPreviewDialog(false);
        setPreviewFileId(null);
    };

    const attachmentCellRenderer = (props: any) => {
        const attachmentUrl = props.value;
        const handleViewClick = () => {
            openAttachmentPreview(attachmentUrl);
        };
        return attachmentUrl ? (
            <button className="view-button" onClick={handleViewClick}>
                View
            </button>
        ) : null;
    };

    const handleDelete = async () => {
        const deleteApiResponse: any = await apiCaller(deleteExpense(selectedExpenseId ?? ""));
        if (deleteApiResponse.status === 1) {
            showToast("Expense deleted successfully");
            setRowData((prevRowData) =>
                    prevRowData.filter((expense) => expense.id !== selectedExpenseId)
                );
            closeDeleteExpenseDialog();
        } else {
            showToast(`Failed to delete expense: ${deleteApiResponse.message}`);
        }
    }

    const NotesCellRenderer: React.FC<any> = (props) => {
        const [localNotes, setLocalNotes] = useState<string>(props.data.notes ?? "");
        const [isSaving, setIsSaving] = useState<boolean>(false);

        useEffect(() => {
            // keep localNotes in sync if external data changes
            setLocalNotes(props.data.notes ?? "");
        }, [props.data.notes]);

        const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setLocalNotes(e.target.value);
        };

        const handleSave = async (e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation();
            const expenseId = props.data.id;
            setIsSaving(true);
            try {
                const updateExpenseResponse: any = await apiCaller(updateExpense(expenseId, { notes: localNotes }));
                if (updateExpenseResponse.status === 1) {
                    showToast("Notes saved!");
                    // update the grid data once on save (prevents re-renders on every keystroke)
                    setRowData(prevRowData =>
                        prevRowData.map(e => e.id === expenseId ? { ...e, notes: localNotes } : e)
                    );
                } else {
                    showToast(`Failed to save notes: ${updateExpenseResponse.message ?? "unknown error"}`);
                }
            } catch (err) {
                showToast("Saving notes failed");
            } finally {
                setIsSaving(false);
            }
        };

        return (
            <div>
                <Stack direction="row" alignItems="center">
                    <TextField
                        id={`notes-${props.data.id}`}
                        value={localNotes}
                        variant="standard"
                        onChange={handleNoteChange}
                        disabled={isSaving}
                        fullWidth={true}
                    />
                    <IconButton aria-label="save-notes" onClick={handleSave} disabled={isSaving} sx={{ color: '#43815b' }}>
                        <SaveIcon />
                    </IconButton>
                    {isSaving && (
                        <>
                            <style>{`@keyframes spinRight { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                            <RotateRightTwoToneIcon style={{ animation: 'spinRight 1s linear infinite', transformOrigin: '50% 50%' }} />
                        </>
                    )}
                </Stack>
            </div>
        );
    };

    const notesCellRenderer = (props: any) => {
        return <NotesCellRenderer {...props} />;
    };

    const tagCellRenderer = (props: any) => {
        return (
            <div>
                {props.value.map((tag: Tag, index: number) => (
                    <button key={index} className="tag-button" onClick={() => handleEditTag(props.data.id, tag)}>
                        {tag.name}
                    </button>
                ))}
                <IconButton aria-label="add-tag" onClick={() => handleOpen(props.data.id)}>
                    <AddCircleIcon />
                </IconButton>
                {!isPreview && 
                    <TagPopper
                        expense={props.data}
                        tag={editingTag}
                        tags={tagData}
                        tagCategories={tagCategories}
                        open={openPopperId === props.data.id}
                        onClose={handleClose}
                        onSelectExistingTag={(tag) => handleSelectExistingTag(tag, props.data)}
                        onCreate={handleCreateTag}
                        onEdit={handleEditTagSave}
                    />
                }
            </div>
        );
    };

    const headers: Object[] = [
        {field: "id", hide: true},
        {field: "transactionDate", headerName: 'Date', minWidth: 125, flex: 0.7},
        {field: "description", headerName: 'Description', minWidth: 180, flex: 1.4},
        {field: "type", headerName: 'Type', minWidth: 105, flex: 0.55},
        {field: "amount", headerName: 'Amount', minWidth: 130, flex: 0.7, valueFormatter: (params: any) => `${window.tracker?.userCurrency ?? ''} ${Number(params.value || 0).toLocaleString()}`},
        {
            field: 'notes',
            headerName: 'Notes',
            cellRenderer: notesCellRenderer,
            sortable: true,
            flex: 2
        },
        {
            field: 'tags', 
            headerName: 'Tags',
            cellRenderer: tagCellRenderer, 
            sortable: true, 
            flex: 2
        },
        {field: "attachment", headerName: 'Files', minWidth: 80, flex: 0.4, cellRenderer: attachmentCellRenderer},
        {field: "actions", headerName: '', minWidth: 110, flex: 0.55, cellRenderer: actionCellRenderer}
    ];

    
    return (
        <Box className="expenseTableShell" sx={{ height, width: '100%' }}>
        {!isPreview && <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1} className="expenseTableToolbar">
            <Box><Typography variant="subtitle1" sx={{ color: '#203b30', fontWeight: 720 }}>Transaction details</Typography><Typography variant="caption" sx={{ color: '#849087' }}>Search, review, and update your activity</Typography></Box>
            <TextField size="small" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder="Search transactions" inputProps={{ 'aria-label': 'Search transactions' }} InputProps={{ startAdornment: <SearchRoundedIcon sx={{ color: '#8b978e', mr: 1, fontSize: 20 }} /> }} sx={{ width: { xs: '100%', sm: 260 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }} />
        </Stack>}
        <Box
        className={`ag-theme-quartz ${clazzName ?? ''}`}
        sx={{ height: isPreview ? '100%' : 'calc(100% - 82px)', width: '100%' }}
        >
            <AgGridReact
                pagination={pagination? pagination : undefined}
                paginationPageSize={20}
                paginationPageSizeSelector={[20, 50, 100]}
                rowData={rowData}
                columnDefs={headers}
                quickFilterText={searchTerm}
                rowHeight={60}
                headerHeight={48}
                defaultColDef={{ resizable: true }}
            />
        </Box>
            <AttachmentUploadDialog
                open={showUploadDialog}
                onClose={closeUploadDialog}
                onUpload={handleAttachmentUpload}
            />
            <AttachmentPreviewDialog
                open={showPreviewDialog}
                onClose={closePreviewDialog}
                fileId={previewFileId}
            />
            <DeleteExpenseDialog
                open={showDeleteExpenseDialog}
                onClose={closeDeleteExpenseDialog}
                onDelete={handleDelete}
            />
        </Box>
    )
}
