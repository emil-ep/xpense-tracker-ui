import { getErrorMessage } from "./ApiUtil";


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