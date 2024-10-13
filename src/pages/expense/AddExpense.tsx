import React, { ChangeEvent, useState } from "react"
import './AddExpense.css'
import Stack from "../../components/Stack"
import { uploadStatement } from "../../api/fileApi";
import ExpenseMapperView from "./ExpenseMapperView";

interface UploadData {
    message : string;
    fileName: string;
}

interface UploadResponse {
    data : UploadData;
    status: number;
}

export default function AddExpense(){

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
        const uploadResponse: UploadResponse = await uploadStatement(selectedFile);
        if(uploadResponse.status === 1){
            setFileName(uploadResponse.data.fileName);
            setUploadComplete(true);
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