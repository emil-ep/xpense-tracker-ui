import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, IconButton, DialogContent, CircularProgress, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { apiCaller, fileDownloader } from "../../api/apicaller";
import { fetchAttachment } from "../../api/fileApi";

interface AttachmentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  fileId: string | null;
}

export default function AttachmentPreviewDialog({ open, onClose, fileId }: AttachmentPreviewDialogProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !fileId) return;

    const loadAttachment = async () => {
      setLoading(true);
      try {
        const response: Blob = await fileDownloader(fetchAttachment(fileId));
        const url = URL.createObjectURL(response);
        setObjectUrl(url);
      } catch (error) {
        console.error("Failed to fetch attachment", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttachment();

    return () => {
      // Cleanup object URL to avoid memory leaks
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
    };
  }, [open, fileId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Attachment Preview
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{ textAlign: "center" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : objectUrl ? (
          <img src={objectUrl} alt="Attachment" style={{ maxWidth: "100%", maxHeight: "80vh" }} />
        ) : (
          <p>No preview available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
