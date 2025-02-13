import { Button, Checkbox, FormControlLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
import { useState } from "react";


interface CreateNewTagProps {
    tagCategories: TagCategory[];
    tag?: Tag | null;
    expense: ExpenseItemType;
    onEdit?: (updatedTag: Tag, expenseId: string) => void;
    onCreate: (
        tagName: string, 
        keywords: string[], 
        canBeConsideredExpense: boolean, 
        expenseId: string, 
        selectedTagCategoryId: string | undefined
    ) => void;
}


export default function CreateNewTag({tagCategories, tag, expense, onEdit, onCreate}: CreateNewTagProps) {

    const [tagName, setTagName] = useState<string>("");
    const [keywords, setKeywords] = useState<string>("");
    const [selectedTagCategoryId, setSelectedTagCategoryId] = useState<string>();
    const [isExpense, setIsExpense] = useState<boolean>(true);


    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsExpense(event.target.checked);
  }

    const onCategoryChange = (value : string) => {
    setSelectedTagCategoryId(value);
  }

  const handleSave = () => {
        if (tag) {
            onEdit?.(
                {
                    ...tag,
                    name: tagName,
                    keywords: keywords.split(",").map((kw) => kw.trim()),
                    // isExpense,
                },
                expense.id ?? ''
            );
        } else {
            onCreate(tagName, keywords.split(",").map((kw) => kw.trim()), isExpense, expense.id ?? '', selectedTagCategoryId);
        }
  };

    return (
        <Stack spacing={2}>
            <h4>Create new Tag</h4>
            <TextField
                label="Tag name"
                variant="outlined"
                fullWidth
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
            />
            <TextField
                label="Enter keywords seperated by comma (,)"
                variant="outlined"
                fullWidth
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
            />
            <Select
                labelId="select-tag-categories-label"
                id="select-tag-categories"
                value={selectedTagCategoryId}
                onChange={(event) => onCategoryChange(event.target.value)}
                label="Category"
            >
            <MenuItem value="" disabled>
                Select a category
            </MenuItem>
            {tagCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                    {category.name}
                </MenuItem>
            ))}
            </Select>
            <FormControlLabel control={
            <Checkbox defaultChecked checked={isExpense} onChange={handleCheckboxChange}/>}
                label="Is it an Expense?" 
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                style={{ marginTop: 8 }}
                disabled={tagName === '' || keywords === '' || selectedTagCategoryId === undefined}
            >
              {tag ? "Save Changes" : "Create tag"}
            </Button>
        </Stack>
          
    )
}