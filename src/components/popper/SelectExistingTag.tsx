import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
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
    const [keywordsToAdd, setKeywordsToAdd] = useState<string | undefined>(selectedExistingTag?.keywords.concat().join(", ") + ", " + expense.description);

    const onExistingTagChange = (name: string) => {
        const tag = tags.find((tag) => tag.name === name);
        if(tag){
            setSelectedExistingTag(tag);
            setKeywordsToAdd(tag.keywords.concat().join(", ") + ", " + expense.description);
        }
    }

    const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setKeywordsToAdd(event.target.value);
    }

    const handleSave = async () => {
        if(selectedExistingTag){
            const reqBody = {
                ...selectedExistingTag,
                keywords: keywordsToAdd ? keywordsToAdd.split(",").map((kw) => kw.trim()) : selectedExistingTag.keywords
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
            <TextField 
              label="Tag Keyword to add"
              variant="outlined"
              fullWidth
              value={selectedExistingTag === null ? "" : keywordsToAdd}
              onChange={(event) => {
                handleKeywordsChange(event);
              }}
            />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                style={{ marginTop: 8 }}
                disabled={selectedExistingTag === null}
            >
              Save
            </Button>
        </Stack>
    )
}