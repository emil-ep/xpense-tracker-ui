import { UploadResponse } from "./ApiResponses";

export const uploadStatement = async (selectedFile : File) : Promise<UploadResponse> => {

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response  = await fetch('http://localhost:8080/v1/file/upload/statement', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    });
    if(!response.ok){
        throw new Error('Failed to fetch expenses')
    }
    const responseData: UploadResponse = await response.json();
    return responseData;
}