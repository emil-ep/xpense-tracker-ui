import { ApiConfig } from "./hook/useApi";

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

export const signInV2 = (body: SignInRequest): ApiConfig => ({
    url: 'http://localhost:8080/v1/auth/signIn',
    method: 'POST',
    body: body
})