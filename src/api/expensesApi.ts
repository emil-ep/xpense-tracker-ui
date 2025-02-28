import { EXPENSES_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


const fetchExpenseParams = (page: number, size: number) => {
    const pageParam = page ? `page=${page}` : undefined;
    const sizeParam = size ? `size=${size}` : '';
    const requestParam = pageParam ? `${pageParam}&${sizeParam}` : sizeParam;
    return requestParam;
}

export const getExpensesV2 = (page: number, size: number): ApiConfig => ({
    url: `${EXPENSES_URL}?${fetchExpenseParams(page, size)}`,
    method: 'GET',
});

export const saveExpense = (fileName: string, body: any): ApiConfig => ({
    url: `${EXPENSES_URL}/save?fileName=${fileName}`,
    method: 'PUT',
    body: body
});

export const updateExpense = (expenseId: string, body: any): ApiConfig => ({
    url: `${EXPENSES_URL}?expense=${expenseId}`,
    method: 'PATCH',
    body: body
});

export const syncExpense = () : ApiConfig => ({
    url: `${EXPENSES_URL}/sync`,
    method: 'POST'
})

export const fetchSyncStatus = (requestId: string) : ApiConfig => ({
    url: `${EXPENSES_URL}/sync/status/${requestId}`,
    method: 'GET'
});