import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Popover, Popper, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { Tag, TagCategory } from "../../../api/ApiResponses";
import { apiCaller } from "../../../api/apicaller";
import { deleteTagApi, editTagsApi } from "../../../api/tagApi";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [keywordTag, setKeywordTag] = useState<Tag | null>(null);
    const [keywordDraft, setKeywordDraft] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
    const [colorTag, setColorTag] = useState<Tag | null>(null);

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
        const editedData = { ...event.data };

        if (typeof editedData.keywords === "string") {
            editedData.keywords = editedData.keywords
            .split(',')
            .map((kw: string) => kw.trim())
            .filter((kw: string) => kw.length > 0);
        }

        setModifiedTags((prev) => new Set(prev).add(editedData));
        setEdited(true);
    };


    const operationsCellRenderer = (props: any) => {
        return (
            <IconButton aria-label="delete-tag" onClick={(e) => handleDeleteClick(e, props.data)}>
                <DeleteIcon />
            </IconButton>
        )
    }

    const openKeywordsEditor = (tag: Tag) => {
        setKeywordTag(tag);
        setKeywordDraft(tag.keywords ?? []);
        setKeywordInput('');
    };

    const addKeyword = (rawKeyword: string) => {
        const keyword = rawKeyword.trim().replace(/,$/, '');
        if (keyword && !keywordDraft.some(existing => existing.toLocaleLowerCase() === keyword.toLocaleLowerCase())) {
            setKeywordDraft(previous => [...previous, keyword]);
        }
        setKeywordInput('');
    };

    const saveKeywords = () => {
        if (!keywordTag) return;
        const updatedTag = { ...keywordTag, keywords: keywordDraft };
        setRowData(previous => previous.map(tag => tag.id === updatedTag.id ? updatedTag : tag));
        setModifiedTags(previous => {
            const next = new Set(Array.from(previous).filter(tag => tag.id !== updatedTag.id));
            next.add(updatedTag);
            return next;
        });
        setEdited(true);
        setKeywordTag(null);
    };

    const keywordsCellRenderer = (props: any) => {
        const keywords: string[] = props.data.keywords ?? [];
        const shownKeywords = keywords.slice(0, 3);
        const hiddenCount = Math.max(0, keywords.length - shownKeywords.length);
        return (
            <Stack direction="row" alignItems="center" spacing={.5} sx={{ width: '100%', overflow: 'hidden' }}>
                {shownKeywords.map(keyword => <Chip key={keyword} label={keyword} size="small" sx={{ maxWidth: 140, bgcolor: '#eff5f0', color: '#426b53', fontWeight: 550, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }} />)}
                {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={{ bgcolor: '#f0f2ef', color: '#718078' }} />}
                {!keywords.length && <Typography variant="caption" sx={{ color: '#9aa49c' }}>No keywords</Typography>}
                <IconButton size="small" aria-label={`Edit keywords for ${props.data.name}`} onClick={() => openKeywordsEditor(props.data)} sx={{ ml: 'auto', flexShrink: 0, color: '#718078' }}><EditRoundedIcon sx={{ fontSize: 17 }} /></IconButton>
            </Stack>
        );
    };

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
                        keywords: updatedTag.keywords,
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

    const tagColors = ['#43815b', '#8fb9a0', '#5267a2', '#9995bf', '#d2a36f', '#df987e', '#c65353', '#d86c9b', '#83a9b8', '#75865b', '#8d6b52', '#536b83'];

    const updateTagColor = (tag: Tag, color: string) => {
        const updatedTag = { ...tag, color };
        setRowData(previous => previous.map(item => item.id === tag.id ? updatedTag : item));
        setModifiedTags(previous => {
            const next = new Set(Array.from(previous).filter(item => item.id !== tag.id));
            next.add(updatedTag);
            return next;
        });
        setEdited(true);
    };

    const colorCellRenderer = (props: any) => {
        const currentColor = rowData.find(tag => tag.id === props.data.id)?.color || '#43815b';
        return (
            <Tooltip title="Choose tag color">
                <IconButton aria-label={`Choose color for ${props.data.name}`} onClick={event => {
                    setColorTag(rowData.find(tag => tag.id === props.data.id) ?? props.data);
                    setColorAnchor(event.currentTarget);
                }} sx={{ width: 40, height: 36, borderRadius: 2, border: '1px solid #e2e8e2', bgcolor: '#fff' }}>
                    <Box sx={{ width: 22, height: 22, borderRadius: 1.5, bgcolor: currentColor, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }} />
                </IconButton>
            </Tooltip>
        );
    };


    const tagCategoryCellRenderer = (props: any) => {
        const currentCategory = rowData.find(tag => tag.id === props.data.id)?.category?.name || "";

        return (
            <Select
                labelId="select-tag-categories-label"
                id="select-tag-categories"
                value={currentCategory}
                onChange={(event) => onCategoryChange(props.data.id, event.target.value)}
                size="small"
                variant="outlined"
                sx={{ width: '100%', maxWidth: 220, bgcolor: '#fff', borderRadius: 2 }}
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
            headerName: 'Tag name',
            editable: true,
            flex: 1
        },
        {
            field: 'keywords',
            headerName: 'Keywords',
            editable: false,
            cellRenderer: keywordsCellRenderer,
            flex: 2.4
        },
        {
            field: 'category.name',
            headerName: 'Category',
            cellRenderer: tagCategoryCellRenderer,
            sortable: false,
            flex: 1
        },
        {
            field: 'expenseCount',
            headerName: 'Expenses',
            sortable: true,
            flex: 0.75,
            editable: false,
        },
        {
            field: 'Color',
            headerName: 'Color',
            sortable: false,
            flex: 0.25,
            cellRenderer: colorCellRenderer,
        },
        {
            field: 'Operations',
            headerName: '',
            cellRenderer: operationsCellRenderer,
            sortable: false,
            flex: 1
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
        <Box className="tagTableShell">
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={1.5} className="tagTableToolbar">
                <Box>
                    <Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>Manage tags</Typography>
                    <Typography variant="body2" sx={{ color: '#849087' }}>{rowData.length} tags · edit names, keywords, category, and color</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                        placeholder="Search tags"
                        inputProps={{ 'aria-label': 'Search tags' }}
                        InputProps={{ startAdornment: <SearchRoundedIcon sx={{ color: '#8b978e', mr: 1, fontSize: 20 }} /> }}
                        sx={{ minWidth: { xs: 0, sm: 210 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                    />
                    <Button variant="contained" startIcon={<SaveRoundedIcon />} disabled={!edited} onClick={saveValue} sx={{ whiteSpace: 'nowrap', borderRadius: 2.5, px: 2, bgcolor: '#28634c', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1e503c' } }}>
                        {edited ? 'Save changes' : 'Saved'}
                    </Button>
                </Stack>
            </Stack>
            <div
            className={`ag-theme-quartz ${clazzName ?? ''}`}
            style={{ height: height, width: '100%' }}
        >
            <AgGridReact 
                rowData={rowData}
                columnDefs={headers}
                onCellEditingStopped={handleCellEditingStopped}
                quickFilterText={searchTerm}
                rowHeight={58}
                headerHeight={48}
                defaultColDef={{ resizable: true, sortable: true }}
                overlayNoRowsTemplate="<span class='tagGridEmpty'>No tags found</span>"
            />
            </div>
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
            <Popover
                open={Boolean(colorAnchor)}
                anchorEl={colorAnchor}
                onClose={() => { setColorAnchor(null); setColorTag(null); }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{ sx: { p: 2, width: 260, borderRadius: 3, border: '1px solid #e8ece7', boxShadow: '0 14px 36px rgba(35, 55, 43, .16)' } }}
            >
                <Stack spacing={1.5}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: '#203b30', fontWeight: 700 }}>Tag color</Typography>
                        <Typography variant="caption" sx={{ color: '#849087' }}>Choose a preset or create your own.</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1 }}>
                        {tagColors.map(color => <IconButton
                            key={color}
                            aria-label={`Use ${color}`}
                            onClick={() => {
                                if (colorTag) updateTagColor(colorTag, color);
                                setColorAnchor(null);
                                setColorTag(null);
                            }}
                            sx={{ width: 30, height: 30, bgcolor: color, border: colorTag?.color === color ? '2px solid #203b30' : '2px solid transparent', '&:hover': { bgcolor: color, transform: 'scale(1.08)' } }}
                        />)}
                    </Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: .5 }}>
                        <Typography variant="body2" sx={{ color: '#536158' }}>Custom color</Typography>
                        <input
                            aria-label="Choose custom tag color"
                            type="color"
                            value={colorTag?.color || '#43815b'}
                            onChange={event => { if (colorTag) updateTagColor(colorTag, event.target.value); }}
                            onBlur={() => { setColorAnchor(null); setColorTag(null); }}
                            style={{ width: 40, height: 34, border: '1px solid #e2e8e2', borderRadius: 8, padding: 2, cursor: 'pointer', background: '#fff' }}
                        />
                    </Stack>
                </Stack>
            </Popover>
            {Boolean(popperAnchor) && (
                    <div
                        className="overlay"
                        onClick={cancelDelete}
                    />
                )
            }
            <Dialog open={Boolean(keywordTag)} onClose={() => setKeywordTag(null)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ color: '#203b30', fontWeight: 720 }}>Keywords for {keywordTag?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ color: '#849087', mb: 2 }}>Keywords help match transactions to this tag. Add each phrase separately.</Typography>
                    <Stack direction="row" spacing={1} onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ',') {
                            event.preventDefault();
                            addKeyword(keywordInput);
                        }
                    }}>
                        <TextField autoFocus fullWidth size="small" label="Add a keyword" value={keywordInput} onChange={event => setKeywordInput(event.target.value)} onBlur={() => { if (keywordInput.trim()) addKeyword(keywordInput); }} />
                        <Button variant="outlined" onClick={() => addKeyword(keywordInput)} sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}>Add</Button>
                    </Stack>
                    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1} sx={{ mt: 2, minHeight: 42 }}>
                        {keywordDraft.map(keyword => <Chip key={keyword} label={keyword} onDelete={() => setKeywordDraft(previous => previous.filter(item => item !== keyword))} sx={{ bgcolor: '#eff5f0', color: '#426b53' }} />)}
                        {!keywordDraft.length && <Typography variant="body2" sx={{ color: '#9aa49c', alignSelf: 'center' }}>No keywords added yet.</Typography>}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setKeywordTag(null)} sx={{ color: '#718078', textTransform: 'none' }}>Cancel</Button>
                    <Button variant="contained" onClick={saveKeywords} sx={{ bgcolor: '#28634c', textTransform: 'none', '&:hover': { bgcolor: '#1e503c' } }}>Save keywords</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
