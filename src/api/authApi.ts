import { LOGOUT_URL, SIGN_IN_URL, SIGN_UP_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";

interface SignInRequest {
    username: string;
    password: string;
}

export const signInV2 = (body: SignInRequest): ApiConfig => ({
    url: SIGN_IN_URL,
    method: 'POST',
    body: body
})

export const signUpApi = (body: { name: string; email: string; password: string }): ApiConfig => ({
    url: SIGN_UP_URL,
    method: 'POST',
    body: body
})

export const logoutApi = (): ApiConfig => ({
    url: LOGOUT_URL,
    method: 'DELETE',
})