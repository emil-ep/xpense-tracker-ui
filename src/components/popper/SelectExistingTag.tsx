import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ExpenseItemType, Tag } from "../../api/ApiResponses";
import { useState } from "react";
import { apiCaller } from "../../api/apicaller";
import { editTagApi } from "../../api/tagApi";
import { showToast } from "../../utils/ToastUtil";

interface SelectExistingTagProps {
    tags: Tag[];
    expense: ExpenseItemType;
    onClose: () => void;
}

export default function SelectExistingTag({tags, expense, onClose} : SelectExistingTagProps) {

    const [selectedExistingTag, setSelectedExistingTag] = useState<Tag | null>(null);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [descriptionDraft, setDescriptionDraft] = useState(expense.description ?? "");
    const [showAllKeywords, setShowAllKeywords] = useState(false);
    const [isKeywordEditorOpen, setIsKeywordEditorOpen] = useState(false);

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
            setShowAllKeywords(false);
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
        if(selectedExistingTag){
            const reqBody = {
                ...selectedExistingTag,
                keywords,
            }
            const response: any = await apiCaller(editTagApi(reqBody));
            if(response.status === 1){
                showToast('Saved tag');
                onClose();
            }else{
                showToast('Unable to save tag');
            }
        }
    }

    return (
        <Stack spacing={2}>
            <h4>Choose existing tag</h4>
            <Select
              labelId="select-tag-label"
              id="select-tag"
              value={selectedExistingTag?.name}
              onChange={(event) => onExistingTagChange(event.target.value)}
              label="Tag"
            >
              <MenuItem value="" disabled>
                  Select a Tag
              </MenuItem>
              {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.name}>
                      {tag.name}
                  </MenuItem>
              ))}
            </Select>
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
                            {(showAllKeywords ? keywords : keywords.slice(0, 3)).map((keyword, index) => (
                                <Chip key={`${keyword}-${index}`} label={keyword} size="small" />
                            ))}
                            {keywords.length > 3 && (
                                <Button
                                    size="small"
                                    onClick={() => setShowAllKeywords((showAll) => !showAll)}
                                >
                                    {showAllKeywords ? "Show less" : `+${keywords.length - 3} more`}
                                </Button>
                            )}
                        </Stack>
                    )}
                    <Button size="small" onClick={() => setIsKeywordEditorOpen(true)}>
                        Edit keywords
                    </Button>
                </Stack>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                style={{ marginTop: 8 }}
                disabled={selectedExistingTag === null}
            >
              Save keywords
            </Button>
            <Dialog
                open={isKeywordEditorOpen}
                onClose={() => setIsKeywordEditorOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit keywords</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
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
                <DialogActions>
                    <Button onClick={() => setIsKeywordEditorOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}