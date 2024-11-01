

interface UploadData {
    message : string;
    fileName: string;
}

interface BaseResponse {
    status: number;
}

export interface UploadResponse extends BaseResponse {
    data: UploadData;
}

export interface ExpensePreviewResponse extends BaseResponse {
    data: ExpenseItemType[];
}

export interface ExpenseSaveResponse extends BaseResponse {
    data: string;
}

export interface ExpenseItemType {
    id?: string;
    transactionDate?: string;
    description?: string;
    bankReferenceNo?: string;
    debit?: number;
    credit?: number;
    closingBalance?: number;
    type?: string;
    amount?: number //derived value from credit or debit based on type
}