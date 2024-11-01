import { getErrorMessage } from "./ApiUtil";
import { ApiConfig } from "./hook/useApi";


export const getExpenses = async() : Promise<any>=> {

    const response = await fetch('http://localhost:8080/v1/expenses', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type' : 'application/json'
        }
    });
    if(!response.ok){
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
    }

    const responseData: any = await response.json();
    return responseData;
}

export const saveExpense = (fileName: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/save?fileName=${fileName}`,
    method: 'PUT',
    body: body
})