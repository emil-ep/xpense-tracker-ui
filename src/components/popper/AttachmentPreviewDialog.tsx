import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, IconButton, DialogContent, CircularProgress, Box, Link } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { fileDownloader } from "../../api/apicaller";
import { fetchAttachment } from "../../api/fileApi";

interface AttachmentPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  fileId: string | null;
}

export default function AttachmentPreviewDialog({ open, onClose, fileId }: AttachmentPreviewDialogProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (!open || !fileId) return;

    let createdUrl: string | null = null;
    const loadAttachment = async () => {
      setLoading(true);
      try {
        const response: Blob = await fileDownloader(fetchAttachment(fileId));

        // Detect PDF by blob type or filename extension
        const pdfByType = response.type === "application/pdf";
        const pdfByExt = /\.pdf$/i.test(fileId);

        if (pdfByType || pdfByExt) {
          // If the response blob doesn't have the PDF MIME type, create a new Blob that does.
          const pdfBlob = pdfByType ? response : new Blob([response], { type: "application/pdf" });
          createdUrl = URL.createObjectURL(pdfBlob);
          setIsPdf(true);
        } else {
          createdUrl = URL.createObjectURL(response);
          setIsPdf(false);
        }

        setObjectUrl(createdUrl);
      } catch (error) {
        console.error("Failed to fetch attachment", error);
      } finally {
        setLoading(false);
      }
    };

    loadAttachment();

    return () => {
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
        createdUrl = null;
      }
      setObjectUrl(null);
      setIsPdf(false);
    };
  }, [open, fileId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      // Make the dialog taller and use flex so content can fill remaining space
      PaperProps={{
        style: {
          display: "flex",
          flexDirection: "column",
          height: "80vh", // adjust as needed (e.g. 90vh)
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        Attachment Preview
        <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        // Let DialogContent expand to fill the paper and hide overflow for better fit
        style={{ textAlign: "center", flex: 1, padding: 0, overflow: "hidden" }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : objectUrl ? (
          isPdf ? (
            // Fill the available height inside the dialog paper
            <object data={objectUrl} type="application/pdf" width="100%" height="100%" aria-label="PDF Preview">
              <p>
                PDF preview not available. <Link href={objectUrl} target="_blank" rel="noopener">Open or download</Link>
              </p>
            </object>
          ) : (
            <img
              src={objectUrl}
              alt="Attachment"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )
        ) : (
          <p>No preview available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
