import { Button, Checkbox, FormControlLabel, MenuItem, Paper, Popper, Select, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import './tagPopper.css'
import { Tag, TagCategory } from "../../api/ApiResponses";


interface TagPopupProps {
  clazzName: string;
  tag?: Tag | null;
  expenseId: string;
  tagCategories: TagCategory[];
  tags: Tag[];
  anchorEl: HTMLElement | null; 
  open: boolean;
  onClose: () => void;
  onCreate: (
    tagName: string, 
    keywords: string[], 
    canBeConsideredExpense: boolean, 
    expenseId: string, 
    selectedTagCategoryId: string | undefined) => void;
  onEdit?: (updatedTag: Tag, expenseId: string) => void; 
}

const TagPopper: React.FC<TagPopupProps> = (
  { clazzName, 
    tag, 
    expenseId, 
    tagCategories, 
    anchorEl, 
    open, 
    onClose, 
    onCreate, 
    onEdit 
  }) => {

  const [tagName, setTagName] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const [selectedTagCategoryId, setSelectedTagCategoryId] = useState<string>();
  const [isExpense, setIsExpense] = useState<boolean>(true);

  useEffect(() => {
    if(tag){
      setTagName(tag.name);
      setKeywords(tag.keywords.join(", "));
      // setCanBeConsideredExpense(tag.canBeCountedAsExpense);
    }else{
      setTagName("");
      setKeywords("");
    }
  }, []);


  const processKeywords = ()  => {
    const value : string[] = keywords
        .split(",") 
        .map((tag) => tag.trim()) 
        .filter((tag) => tag !== "");
    return value;
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsExpense(event.target.checked);
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
                expenseId
            );
        } else {
            onCreate(tagName, keywords.split(",").map((kw) => kw.trim()), isExpense, expenseId, selectedTagCategoryId);
        }
    };

  const onCategoryChange = (value : string) => {
    setSelectedTagCategoryId(value);
  }

  return (
    <Popper className={clazzName} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper 
        className="paper"
        style={{ padding: 16, width: 200 }}
        > 
            <Stack>
                <h4>Choose existing tag</h4>
            </Stack>
            <h2>OR</h2>
            <Stack spacing={2}>
              <h4>Create a new tag</h4>
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
            </Stack>
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
            <Button onClick={onClose}>Cancel</Button>
      </Paper>
    </Popper>
  );
};

export default TagPopper;