import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";

interface AttachmentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File | null) => void;
}

export default function AttachmentUploadDialog({
  open,
  onClose,
  onUpload
}: AttachmentUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    onUpload(file);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Attachment</DialogTitle>
      <DialogContent>
        <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleUpload}
          disabled={!file}
          variant="contained"
          color="primary"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
