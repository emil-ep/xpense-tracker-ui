import { ApiConfig } from "./hook/useApi";


export const getExpensesV2 = (page: number, size: number): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses?page=${page}&size=${size}`,
    method: 'GET',
})

export const saveExpense = (fileName: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/save?fileName=${fileName}`,
    method: 'PUT',
    body: body
})