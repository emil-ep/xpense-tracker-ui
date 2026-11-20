import './AddExpense.css';
import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';
import ExpenseMapperView from './ExpenseMapperView';
import { UploadResponse } from '../../api/ApiResponses';
import { uploadStatement } from '../../api/fileApi';
import { showToast } from '../../utils/ToastUtil';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

export default function AddExpense() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setUploading] = useState(false);
    const [isUploadComplete, setUploadComplete] = useState(false);
    const [fileName, setFileName] = useState('');
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectFile = (file?: File) => {
        if (!file) return;
        setSelectedFile(file);
        setUploadComplete(false);
        setUploadError(null);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => selectFile(event.target.files?.[0]);
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        selectFile(event.dataTransfer.files?.[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setUploadError(null);
        try {
            const uploadResponse: UploadResponse = await uploadStatement(selectedFile);
            if (uploadResponse.status !== 1) throw new Error('Upload failed unexpectedly.');
            setFileName(uploadResponse.data.fileName);
            setUploadComplete(true);
        } catch (err) {
            setUploadError('Upload failed. Please check the file and try again.');
            showToast(`Upload failed: ${err}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box className="addExpensePage">
            <Box className="addExpenseContent">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}>
                    <DescriptionRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                    <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Import activity</Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Add expenses</Typography>
                <Typography variant="body2" sx={{ color: '#849087', mt: .75, mb: 3 }}>Upload a bank statement, match its columns, then review transactions before saving.</Typography>

                <Card sx={{ borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff', mb: 2.5 }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2 }}>
                            <Box><Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>1. Upload your statement</Typography><Typography variant="body2" sx={{ color: '#849087', mt: .4 }}>Drop a file here or browse your device.</Typography></Box>
                            {isUploadComplete && <Alert icon={<CheckCircleRoundedIcon />} severity="success" sx={{ py: 0 }}>Statement uploaded</Alert>}
                        </Stack>

                        <Box
                            onDragOver={event => { event.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`statementDropzone${isDragging ? ' isDragging' : ''}`}
                            onClick={() => inputRef.current?.click()}
                            role="button"
                            tabIndex={0}
                            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
                        >
                            <input ref={inputRef} type="file" accept=".csv,.xlsx,.delimited,.pdf,.txt,.xls" onChange={handleFileChange} style={{ display: 'none' }} />
                            <Box className="uploadIconBubble"><CloudUploadRoundedIcon sx={{ fontSize: 30 }} /></Box>
                            {selectedFile ? <>
                                <Typography sx={{ color: '#203b30', fontWeight: 700, mt: 1.25 }}>{selectedFile.name}</Typography>
                                <Typography variant="body2" sx={{ color: '#849087', mt: .25 }}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to choose a different file</Typography>
                            </> : <>
                                <Typography sx={{ color: '#30473a', fontWeight: 700, mt: 1.25 }}>Drag your statement here</Typography>
                                <Typography variant="body2" sx={{ color: '#849087', mt: .25 }}>or click to browse files</Typography>
                            </>}
                            <Typography variant="caption" sx={{ display: 'block', color: '#9aa49c', mt: 1.25 }}>CSV, XLS, XLSX, PDF, TXT · Choose a statement file from your device</Typography>
                        </Box>

                        {uploadError && <Alert severity="error" icon={<ErrorRoundedIcon />} sx={{ mt: 2 }}>{uploadError}</Alert>}
                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button onClick={handleUpload} disabled={!selectedFile || isUploading || isUploadComplete} variant="contained" startIcon={isUploading ? <CircularProgress size={17} color="inherit" /> : <CloudUploadRoundedIcon />} sx={{ borderRadius: 2.5, px: 2.5, py: 1, bgcolor: '#28634c', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1e503c' } }}>
                                {isUploading ? 'Uploading…' : isUploadComplete ? 'Uploaded' : 'Upload statement'}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {isUploadComplete && <ExpenseMapperView fileName={fileName} />}
            </Box>
        </Box>
    );
}
