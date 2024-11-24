import { Button, Paper, Popper, TextField } from "@mui/material";
import { useState } from "react";
import './tagPopper.css'


interface TagPopupProps {
  anchorEl: HTMLElement | null; 
  open: boolean;
  onClose: () => void;
  onCreate?: (tag: string) => void; 
}

const TagPopper: React.FC<TagPopupProps> = ({ anchorEl, open, onClose, onCreate }) => {
  const [tagName, setTagName] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");
  const handleCreate = () => {
    if (tagName.trim()) {
    //   onCreate(newTag);
    //   setTagName(""); // Clear input
      onClose();   
    }
  };

//   const processKeywords = (input: string)  => {
//     const value : string[] = input
//         .split(",") // Split the string by commas
//         .map((tag) => tag.trim()) // Remove any extra whitespace
//         .filter((tag) => tag !== "");
//     setKeywords(value)
//   }


  return (
    <Popper className="popperCentered" open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper style={{ padding: 16, width: 200 }}>
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreate}
          style={{ marginTop: 8 }}
        >
          Create new tag
        </Button>
      </Paper>
    </Popper>
  );
};

export default TagPopper;