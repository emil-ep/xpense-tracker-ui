import "./AddExpense.css";
import React, { ChangeEvent, useState } from "react";
import ExpenseMapperView from "./ExpenseMapperView";
import { UploadResponse } from "../../api/ApiResponses";
import { uploadStatement } from "../../api/fileApi";
import { useSearchParams } from "react-router-dom";
import { showToast } from "../../utils/ToastUtil";
import { 
    Box, 
    Button, 
    CircularProgress, 
    Typography, 
    Stack 
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function AddExpense() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setUploading] = useState(false);
    const [isUploadComplete, setUploadComplete] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setUploadError(null); // Reset error when selecting a new file
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            showToast("Please select a file first!");
            return;
        }
        setUploading(true);
        setUploadError(null);
        try {
            const uploadResponse: UploadResponse = await uploadStatement(selectedFile);
            if (uploadResponse.status === 1) {
                setFileName(uploadResponse.data.fileName);
                setSearchParams({ file: selectedFile.name });
                setUploadComplete(true);
            } else {
                throw new Error("Upload failed unexpectedly.");
            }
        } catch (err) {
            setUploadError("Upload failed. Please try again.");
            showToast(`Upload failed: ${err}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "rgb(5, 30, 52)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: 3
            }}
        >
            {/* Upload Box */}
            <Box
                sx={{
                    p: 3,
                    border: "2px dashed #0288d1",
                    borderRadius: 2,
                    textAlign: "center",
                    width: "100%",
                    maxWidth: "500px",
                    bgcolor: "#0A253F",
                    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)"
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ color: "#82B1FF" }}>
                    Upload Your Statement
                </Typography>

                {/* Hidden File Input */}
                <input 
                    type="file" 
                    accept=".csv, .xlsx, .delimited, .pdf, .txt"
                    onChange={handleFileChange} 
                    style={{ display: "none" }} 
                    id="file-input"
                />
                <label htmlFor="file-input">
                    <Button 
                        variant="contained" 
                        component="span" 
                        startIcon={<CloudUploadIcon />}
                        sx={{ backgroundColor: "#0288d1", "&:hover": { backgroundColor: "#0277bd" } }}
                    >
                        Select File
                    </Button>
                </label>

                {/* Display Selected File Name */}
                {selectedFile && (
                    <Typography variant="body2" sx={{ mt: 1, color: "#fff" }}>
                        {selectedFile.name}
                    </Typography>
                )}

                {/* Upload Button & Progress */}
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                    <Button 
                        onClick={handleUpload} 
                        disabled={!selectedFile || isUploading} 
                        variant="contained"
                        sx={{ backgroundColor: "#43a047", "&:hover": { backgroundColor: "#388e3c" } }}
                    >
                        {isUploading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload"}
                    </Button>
                </Stack>

                {/* Upload Error Message */}
                {uploadError && (
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <ErrorIcon fontSize="small" sx={{ color: "red", mr: 1 }} />
                        <Typography sx={{ color: "red" }}>{uploadError}</Typography>
                    </Stack>
                )}

                {/* Upload Success Message */}
                {isUploadComplete && (
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                        <CheckCircleIcon fontSize="small" sx={{ color: "lightgreen", mr: 1 }} />
                        <Typography sx={{ color: "lightgreen" }}>Upload Completed!</Typography>
                    </Stack>
                )}
            </Box>

            {/* Expense Mapping View (Appears After Upload Completes) */}
            {isUploadComplete && <ExpenseMapperView fileName={fileName} />}
        </Box>
    );
}
