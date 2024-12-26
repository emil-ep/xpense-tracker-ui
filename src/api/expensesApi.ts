import { ApiConfig } from "./hook/useApi";


const fetchExpenseParams = (page: number, size: number) => {
    const pageParam = page ? `page=${page}` : undefined;
    const sizeParam = size ? `size=${size}` : '';
    const requestParam = pageParam ? `${pageParam}&${sizeParam}` : sizeParam;
    return requestParam;
}

export const getExpensesV2 = (page: number, size: number): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses?${fetchExpenseParams(page, size)}`,
    method: 'GET',
});

export const saveExpense = (fileName: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/save?fileName=${fileName}`,
    method: 'PUT',
    body: body
});

export const updateExpense = (expenseId: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses?expense=${expenseId}`,
    method: 'PATCH',
    body: body
});

export const syncExpense = () : ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/sync`,
    method: 'POST'
})