
interface SignInRequest {
    username: string;
    password: string;
}

interface SignInResponse {
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
        throw new Error('Failed to signIn')
    }
    const responseData: SignInResponse = await response.json();
    return responseData;
}