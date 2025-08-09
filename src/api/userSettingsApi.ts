import { ApiConfig } from "./hook/useApi";
import { USER_SETTINGS_URL } from "./ApiUrl";

export const fetchUserSettingsApi = (): ApiConfig => ({
    url: USER_SETTINGS_URL,
    method: 'GET'
});

export const updateUserSettingsApi = (body: any): ApiConfig => ({
    url: USER_SETTINGS_URL,
    method: 'PUT',
    body: body
});