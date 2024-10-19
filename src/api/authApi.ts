import { getErrorMessage } from "./ApiUtil";

interface SignInRequest {
    username: string;
    password: string;
}

interface SignInResponse {
    data: SignInData;
}

interface SignInData{
    token: string;
}

export const signIn = async (data: SignInRequest): Promise<SignInResponse> => {
    const response = await fetch('http://localhost:8080/v1/auth/signIn', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    })

    if(!response.ok){
        const errorMessage = await getErrorMessage(response);
        throw new Error(errorMessage);
    }
    const responseData: SignInResponse = await response.json();
    return responseData;
}