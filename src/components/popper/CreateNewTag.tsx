import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
import { useEffect, useId, useState } from "react";


interface CreateNewTagProps {
    tagCategories: TagCategory[];
    tag?: Tag | null;
    expense: ExpenseItemType;
    onEdit?: (updatedTag: Tag, expenseId: string) => void;
    onCreate: (
        tagName: string, 
        keywords: string[], 
        expenseId: string, 
        selectedTagCategoryId: string | undefined
    ) => void;
}


export default function CreateNewTag({tagCategories, tag, expense, onEdit, onCreate}: CreateNewTagProps) {

const componentId = useId().replace(/:/g, "");
const [tagName, setTagName] = useState<string>(tag?.name ?? "");
const [keywords, setKeywords] = useState<string>(tag?.keywords.join(", ") ?? expense.description ?? "");
const [selectedTagCategoryId, setSelectedTagCategoryId] = useState<string | undefined>(tag?.category?.id);

useEffect(() => {
    setTagName(tag?.name ?? "");
    setKeywords(tag?.keywords.join(", ") ?? expense.description ?? "");
    setSelectedTagCategoryId(tag?.category?.id);
}, [tag, expense.description]);

const onCategoryChange = (value : string) => {
    setSelectedTagCategoryId(value);
}

  const handleSave = () => {
        const parsedKeywords = keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean);
        if (tag) {
            onEdit?.(
                {
                    ...tag,
                    name: tagName,
                    keywords: parsedKeywords,
                },
                expense.id ?? ''
            );
        } else {
            onCreate(tagName, parsedKeywords, expense.id ?? '', selectedTagCategoryId);
        }
  };

    return (
        <Stack spacing={2}>
            <Stack spacing={0.5}>
                <Typography variant="h6" component="h2">
                    {tag ? "Edit tag details" : "Create a new tag"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {tag ? "Update the tag name and keywords." : "Give the tag a clear name, category, and optional matching keywords."}
                </Typography>
            </Stack>
            <TextField
                label="Tag name"
                variant="outlined"
                fullWidth
                value={tagName}
                required
                onChange={(e) => setTagName(e.target.value)}
            />
            <TextField
                label="Keywords"
                helperText="Separate matching words or phrases with commas."
                variant="outlined"
                fullWidth
                multiline
                minRows={2}
                maxRows={4}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            {!tag && (
                <FormControl fullWidth required>
                    <InputLabel id={`${componentId}-category-label`}>Category</InputLabel>
                    <Select
                        labelId={`${componentId}-category-label`}
                        id={`${componentId}-category-select`}
                        value={selectedTagCategoryId ?? ""}
                        onChange={(event) => onCategoryChange(event.target.value)}
                        label="Category"
                    >
                        {tagCategories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                sx={{ mt: 1 }}
                disabled={!tagName.trim() || !keywords.trim() || (!tag && !selectedTagCategoryId)}
            >
              {tag ? "Save changes" : "Create and apply tag"}
            </Button>
        </Stack>
          
    )
}