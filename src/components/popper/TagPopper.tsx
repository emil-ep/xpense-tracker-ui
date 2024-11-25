import { Button, Checkbox, FormControlLabel, Paper, Popper, Stack, TextField } from "@mui/material";
import { useState } from "react";
import './tagPopper.css'
import { apiCaller } from "../../api/apicaller";
import { createTagApi } from "../../api/tagApi";
import { toast } from 'react-toastify';
import { getNavigate } from "../../navigation";


interface TagPopupProps {
  clazzName: string;
  anchorEl: HTMLElement | null; 
  open: boolean;
  onClose: () => void;
  onCreate: (tagName: string, keywords: string[], canBeConsideredExpense: boolean) => void; 
}

const TagPopper: React.FC<TagPopupProps> = ({ clazzName, anchorEl, open, onClose, onCreate }) => {

  const [tagName, setTagName] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");


  const processKeywords = ()  => {
    const value : string[] = keywords
        .split(",") 
        .map((tag) => tag.trim()) 
        .filter((tag) => tag !== "");
    return value;
  }

  return (
    <Popper className={clazzName} open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper 
        className="paper"
        style={{ padding: 16, width: 200 }}
        >
            <Stack spacing={2}>
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
            </Stack>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Is it an Expense?" />
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => onCreate(tagName, processKeywords(), true)}
                style={{ marginTop: 8 }}
                disabled={tagName === '' || keywords === ''}
            >
                Create new tag
            </Button>
      </Paper>
    </Popper>
  );
};

export default TagPopper;