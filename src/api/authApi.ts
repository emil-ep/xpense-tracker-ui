import { LOGOUT_URL, SIGN_IN_URL } from "./ApiUrl";
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
    url: SIGN_IN_URL,
    method: 'POST',
    body: body
})

export const logoutApi = (): ApiConfig => ({
    url: LOGOUT_URL,
    method: 'DELETE',
})