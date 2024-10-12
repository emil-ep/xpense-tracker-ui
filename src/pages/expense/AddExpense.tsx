import React, { ChangeEvent, useState } from "react"
import './AddExpense.css'
import Stack from "../../components/Stack"
import { uploadStatement } from "../../api/fileApi";

export default function AddExpense(){

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]); 
        }
    }

    const handleUpload = () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }
        uploadStatement(selectedFile);
    }


    return (
        <Stack className="homeContainer" direction="column">
            <Stack className="uploadContainer" direction="row" justify="center">
                <input className="uploadBtn" type="file" onChange={handleFileChange} />
                <button className="uploadBtn" onClick={handleUpload}>Upload your statement</button>
            </Stack>
            
        </Stack>
    )

    // return <></>
}