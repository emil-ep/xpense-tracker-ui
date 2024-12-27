import { UploadResponse } from "./ApiResponses";
import { FILE_URL } from "./ApiUrl";
import { getErrorMessage } from "./ApiUtil";

export const uploadStatement = async (selectedFile : File) : Promise<UploadResponse> => {

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response  = await fetch(`${FILE_URL}/upload/statement`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
    });
    if(!response.ok){
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
    }
    const responseData: UploadResponse = await response.json();
    return responseData;
}