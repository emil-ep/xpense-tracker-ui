

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
        throw new Error('Failed to fetch expenses')
    }

    const responseData: any = await response.json();
    return responseData;
}