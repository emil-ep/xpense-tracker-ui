import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { ExpenseItemType, Tag, TagCategory } from "../../api/ApiResponses";
import { useState } from "react";

interface SelectExistingTagProps {
    tags: Tag[];
    expense: ExpenseItemType;
}

export default function SelectExistingTag({tags, expense} : SelectExistingTagProps) {

    const [selectedExistingTag, setSelectedExistingTag] = useState<Tag | null>(null);
    const [keywordsToAdd, setKeywordsToAdd] = useState<string | undefined>(expense.description);

    const onExistingTagChange = (name: string) => {
        const tag = tags.find((tag) => tag.name === name);
        if(tag){
            setSelectedExistingTag(tag);
        }
    }

    const handleKeywordsChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setKeywordsToAdd(event.target.value);
    }

    const handleSave = () => {
        if(selectedExistingTag){
            console.log(selectedExistingTag);
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
              value={selectedExistingTag === null?"" : selectedExistingTag?.keywords.concat().join(", ") + ", " + expense.description}
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