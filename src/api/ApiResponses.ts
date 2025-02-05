

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

export interface PaginatedExpenseResponse extends BaseResponse {
    data: PaginatedExpenses;
}

export interface MetricsV2Response extends BaseResponse {
    data: MetricsV2[];
}

export interface FetchTagsResponse extends BaseResponse {
    data: Tag[];
}

export interface TagCategoryResponse extends BaseResponse {
    data: TagCategory[];
}

export interface MetricsV2 {
    timeframe : string;
    debit_aggregate?: number;
    credit_aggregate?: number;
    tags_aggregate?: Object;
}

interface PaginatedExpenses {
    totalPages : number;
    totalCount: number;
    currentCount: number;
    page: number;
    expenses : ExpenseItemType[];
}

export interface Tag {
    id: string;
    parentTag?: Tag;
    name: string;
    tagType: string;
    keywords: string[];
    category: TagCategory;
    editable: boolean;
}

export interface TagCategory {
    id: string;
    name: string;
    expense: boolean;
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
    amount?: number; //derived value from credit or debit based on type
    tags: Tag[];
}