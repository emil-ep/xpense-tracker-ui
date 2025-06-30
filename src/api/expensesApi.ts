import { EXPENSES_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


const fetchExpenseParams = (page: number, size: number, fromDate: string, toDate: string) => {
    const pageParam = page ? `page=${page}` : undefined;
    const sizeParam = size ? `size=${size}` : '';
    const pageAndSizeParam = pageParam ? `${pageParam}&${sizeParam}` : sizeParam;
    const requestParam = pageAndSizeParam ? `${pageAndSizeParam}&from=${fromDate}&to=${toDate}` : `from=${fromDate}&to=${toDate}`;
    return requestParam;
}

export const getExpensesV2 = (page: number, size: number, fromDate: string, toDate: string): ApiConfig => ({
    url: `${EXPENSES_URL}?${fetchExpenseParams(page, size, fromDate, toDate)}`,
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

export const deleteExpense = (expenseId: string): ApiConfig => ({
    url: `${EXPENSES_URL}/${expenseId}`,
    method: 'DELETE'
});