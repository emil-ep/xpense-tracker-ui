import React, { ChangeEvent, useState } from "react"
import './AddExpense.css'
import Stack from "../../components/Stack"
import { uploadStatement } from "../../api/fileApi";
import { toast } from 'react-toastify';
import ExpenseMapperView from "./ExpenseMapperView";
import { UploadResponse } from "../../api/ApiResponses";
import { useSearchParams } from "react-router-dom";
  

export default function AddExpense(){

    const [searchParams, setSearchParams] = useSearchParams(); // Manage query parameters
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadComplete, setUploadComplete] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]); 
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        try{
            const uploadResponse: UploadResponse = await uploadStatement(selectedFile);
            if(uploadResponse.status === 1){
                setFileName(uploadResponse.data.fileName);
                setSearchParams({ file: selectedFile.name });
                setUploadComplete(true);
            }
        }catch(err){
            toast(`Upload failed : ${err}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    }


    return (
        <Stack className="homeContainer" direction="column">
            <Stack className="uploadContainer" direction="row" justify="center">
                <input className="uploadBtn" type="file" onChange={handleFileChange} />
                <button className="uploadBtn" onClick={handleUpload}>Upload your statement</button>
                {isUploadComplete && <button>completed</button>} 
            </Stack>
            {isUploadComplete && <ExpenseMapperView fileName={fileName}/>}
        </Stack>
    )
}