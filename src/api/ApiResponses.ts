

interface UploadData {
    message : string;
    fileName: string;
}

export interface UploadResponse {
    data : UploadData;
    status: number;
}