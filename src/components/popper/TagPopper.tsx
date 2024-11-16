import { Button, Paper, Popper, TextField } from "@mui/material";
import { useState } from "react";



interface TagPopupProps {
  anchorEl: HTMLElement | null; // Element to anchor the popup
  open: boolean; // Whether the popup is open
  onClose: () => void; // Function to close the popup
  onCreate?: (tag: string) => void; // Callback to handle tag creation
}


const TagPopper: React.FC<TagPopupProps> = ({ anchorEl, open, onClose, onCreate }) => {
  const [newTag, setNewTag] = useState<string>("");

  const handleCreate = () => {
    if (newTag.trim()) {
    //   onCreate(newTag);
      setNewTag(""); // Clear input
      onClose();     // Close popup
    }
  };

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
      <Paper style={{ padding: 16, width: 200 }}>
        <TextField
          label="New Tag"
          variant="outlined"
          fullWidth
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCreate}
          style={{ marginTop: 8 }}
        >
          Add Tag
        </Button>
      </Paper>
    </Popper>
  );
};

export default TagPopper;