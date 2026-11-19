import {
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ExpenseItemType, Tag } from "../../api/ApiResponses";
import { useId, useState } from "react";
import { apiCaller } from "../../api/apicaller";
import { editTagApi } from "../../api/tagApi";
import { showToast } from "../../utils/ToastUtil";

interface SelectExistingTagProps {
    tags: Tag[];
    expense: ExpenseItemType;
    onSelect: (tag: Tag) => Promise<void>;
}

export default function SelectExistingTag({tags, expense, onSelect} : SelectExistingTagProps) {

    const componentId = useId().replace(/:/g, "");
    const [selectedExistingTag, setSelectedExistingTag] = useState<Tag | null>(null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [descriptionDraft, setDescriptionDraft] = useState(expense.description ?? "");
    const [isKeywordEditorOpen, setIsKeywordEditorOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const onExistingTagChange = (name: string) => {
        const tag = tags.find((tag) => tag.name === name);
        if(tag){
            setSelectedExistingTag(tag);
            setKeywords(
                tag.keywords
                    .filter((keyword) => Boolean(keyword?.trim()))
                    .map((keyword) => keyword.trim())
            );
            setDescriptionDraft(expense.description ?? "");
            setKeywordInput("");
        }
    }

    const addKeywords = (value: string) => {
        const newKeywords = value
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean);

        if (newKeywords.length > 0) {
            setKeywords((currentKeywords) => {
                const seen = new Set(currentKeywords.map((keyword) => keyword.toLocaleLowerCase()));
                const additions = newKeywords.filter((keyword) => {
                    const normalized = keyword.toLocaleLowerCase();
                    if (seen.has(normalized)) return false;
                    seen.add(normalized);
                    return true;
                });
                return [...currentKeywords, ...additions];
            });
        }
        setKeywordInput("");
    }

    const handleKeywordInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addKeywords(keywordInput);
        }
    }

    const descriptionAlreadyAdded = keywords.some(
        (keyword) => keyword.toLocaleLowerCase() === descriptionDraft.trim().toLocaleLowerCase()
    );

    const handleSave = async () => {
        if(selectedExistingTag && !isSaving){
            const originalKeywords = selectedExistingTag.keywords ?? [];
            const keywordsChanged = originalKeywords.length !== keywords.length
                || originalKeywords.some((keyword, index) => keyword !== keywords[index]);

            setIsSaving(true);
            try {
                if (keywordsChanged) {
                    const response: any = await apiCaller(editTagApi({
                        ...selectedExistingTag,
                        keywords,
                    }));
                    if(response.status !== 1){
                        showToast('Unable to save tag keywords');
                        return;
                    }
                }

                await onSelect({ ...selectedExistingTag, keywords });
            } catch (error) {
                showToast('Unable to apply tag. Please try again.');
            } finally {
                setIsSaving(false);
            }
        }
    }

    return (
        <Stack spacing={2}>
            <Stack spacing={0.5}>
                <Typography variant="h6" component="h2">Use an existing tag</Typography>
                <Typography variant="body2" color="text.secondary">
                    Add a tag to this expense. Edit its saved keywords if needed.
                </Typography>
            </Stack>
            {tags.length === 0 ? (
                <Typography role="status" color="text.secondary">
                    No tags are available yet. Create a tag instead.
                </Typography>
            ) : (
                <FormControl fullWidth>
                    <InputLabel id={`${componentId}-select-tag-label`}>Tag</InputLabel>
                    <Select
                        labelId={`${componentId}-select-tag-label`}
                        id={`${componentId}-select-tag`}
                        value={selectedExistingTag?.name ?? ""}
                        onChange={(event) => onExistingTagChange(event.target.value)}
                        label="Tag"
                    >
                        {tags.map((tag) => (
                            <MenuItem key={tag.id} value={tag.name}>{tag.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {selectedExistingTag && (
                <Stack spacing={1}>
                    <Typography variant="subtitle2">
                        Keywords ({keywords.length})
                    </Typography>
                    {keywords.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No keywords yet.
                        </Typography>
                    ) : (
                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                            {keywords.slice(0, 3).map((keyword, index) => (
                                <Chip key={`${keyword}-${index}`} label={keyword} size="small" />
                            ))}
                            {keywords.length > 3 && (
                                <Button
                                    size="small"
                                    onClick={() => setIsKeywordEditorOpen(true)}
                                >
                                    +{keywords.length - 3} more
                                </Button>
                            )}
                        </Stack>
                    )}
                    <Button
                        size="small"
                        onClick={() => setIsKeywordEditorOpen(true)}
                    >
                        Edit keywords
                    </Button>
                </Stack>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                sx={{ mt: 1 }}
                disabled={selectedExistingTag === null || tags.length === 0 || isSaving}
                startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
                {isSaving ? "Applying tag…" : "Apply tag to expense"}
            </Button>
            <Dialog
                open={isKeywordEditorOpen}
                onClose={() => setIsKeywordEditorOpen(false)}
                fullWidth
                maxWidth="sm"
                aria-labelledby={`${componentId}-keyword-dialog-title`}
                aria-describedby={`${componentId}-keyword-dialog-description`}
                PaperProps={{ className: "keywordEditorDialogPaper" }}
            >
                <DialogTitle id={`${componentId}-keyword-dialog-title`}>
                    Edit keywords for {selectedExistingTag?.name}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <Typography id={`${componentId}-keyword-dialog-description`} color="text.secondary">
                            Changes are saved when you apply this tag to the expense.
                        </Typography>
                        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {keywords.map((keyword, index) => (
                                <Chip
                                    key={`${keyword}-${index}`}
                                    label={keyword}
                                    onDelete={() => setKeywords((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                                />
                            ))}
                            {keywords.length === 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    No keywords. Add one below.
                                </Typography>
                            )}
                        </Stack>
                        {expense.description?.trim() && (
                            <Stack spacing={1}>
                                <Typography variant="subtitle2">
                                    Expense description suggestion
                                </Typography>
                                <TextField
                                    label="Suggested keyword"
                                    value={descriptionDraft}
                                    helperText={descriptionAlreadyAdded ? "Already in the keyword list." : "Not included unless you add it."}
                                    onChange={(event) => setDescriptionDraft(event.target.value)}
                                    fullWidth
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => addKeywords(descriptionDraft)}
                                    disabled={!descriptionDraft.trim() || descriptionAlreadyAdded}
                                >
                                    Add description as keyword
                                </Button>
                            </Stack>
                        )}
                        <Stack direction="row" spacing={1}>
                            <TextField
                                label="Add keyword"
                                placeholder="Type a keyword and press Enter"
                                value={keywordInput}
                                onChange={(event) => setKeywordInput(event.target.value)}
                                onKeyDown={handleKeywordInputKeyDown}
                                fullWidth
                            />
                            <Button
                                variant="outlined"
                                onClick={() => addKeywords(keywordInput)}
                                disabled={!keywordInput.trim()}
                            >
                                Add
                            </Button>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            Separate multiple keywords with commas. Remove a keyword using its × button.
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setIsKeywordEditorOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}