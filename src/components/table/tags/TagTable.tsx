import { Box, Button, IconButton, MenuItem, Paper, Popper, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag, TagCategory } from "../../../api/ApiResponses";
import TagKeywordsEditor from "./TagKeywordsEditor";
import { apiCaller } from "../../../api/apicaller";
import { deleteTagApi, editTagsApi } from "../../../api/tagApi";
import DeleteIcon from '@mui/icons-material/Delete';
import './tagTable.css';
import { showToast } from "../../../utils/ToastUtil";

interface TagTableProps {
    clazzName? : string;
    tags: Tag[];
    height: number | string;
    tagCategories: TagCategory[];
}

export default function TagTable({ clazzName, tags, height, tagCategories } : TagTableProps) {
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

    const onCategoryChange = (tagId: string, newCategoryName: string) => {
        const selectedCategory = tagCategories.find((category) => category.name === newCategoryName);
        const updatedTag = rowData.find((tag) => tag.id === tagId);
        setRowData((prevData) => 
            prevData.map((tag) => 
                tag.id === tagId 
                            ? { ...tag, category: 
                                //@ts-expect-error
                                { id: selectedCategory.id, name: newCategoryName, expense: selectedCategory.expense } 
                            } 
                            : tag
            )
        );

        setModifiedTags((prevModifiedTags) => {
            const newSet = new Set(prevModifiedTags);
            
            if (updatedTag) {
                newSet.add(
                    { ...updatedTag, 
                        //@ts-expect-error
                        keywords: updatedTag.keywords.toString(),
                        category: { 
                            //@ts-expect-error
                            id: selectedCategory.id, 
                            name: newCategoryName, 
                            //@ts-expect-error
                            expense: selectedCategory.expense 
                        } 
                    });
            }

            return newSet;
        });
        setEdited(true);
    };


    const tagCategoryCellRenderer = (props: any) => {
        const currentCategory = rowData.find(tag => tag.id === props.data.id)?.category?.name || "";

        return (
            <Select
                labelId="select-tag-categories-label"
                id="select-tag-categories"
                value={currentCategory}
                onChange={(event) => onCategoryChange(props.data.id, event.target.value)}
                label="Category"
            >
                <MenuItem value="" disabled>
                    Select a category
                </MenuItem>
                {tagCategories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
        );
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
            field: 'Category',
            cellRenderer: tagCategoryCellRenderer,
            sortable: false
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

        const apiDeleteResponse: any = await apiCaller(deleteTagApi(rowToDelete.id));
        if(apiDeleteResponse.status === 1){
            showToast('Removed tag');
            setRowData((prev) => prev.filter((row) => row.id !== rowToDelete.id));
        }else{
            showToast('Failed to remove tag');
        }
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