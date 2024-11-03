import { ApiConfig } from "./hook/useApi";


export const getExpensesV2 = (): ApiConfig => ({
    url: 'http://localhost:8080/v1/expenses',
    method: 'GET',
})

export const saveExpense = (fileName: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/save?fileName=${fileName}`,
    method: 'PUT',
    body: body
})