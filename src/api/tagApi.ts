import { TAG_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";

export const createTagApi = (body: any): ApiConfig => ({
    url: `${TAG_URL}`,
    method: 'POST',
    body: body
});

export const editTagApi = (body: any): ApiConfig => ({
    url: `${TAG_URL}`,
    method: 'PUT',
    body: body
})