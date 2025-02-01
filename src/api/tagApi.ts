import { ApiConfig } from "./hook/useApi";
import { TAG_URL } from "./ApiUrl";

export const createTagApi = (body: any): ApiConfig => ({
    url: `${TAG_URL}`,
    method: 'POST',
    body: body
});

export const editTagApi = (body: any): ApiConfig => ({
    url: `${TAG_URL}`,
    method: 'PUT',
    body: body
});

export const fetchTagsApi = (): ApiConfig => ({
    url: TAG_URL,
    method: 'GET',
})

export const editTagsApi = (body: any): ApiConfig => ({
    url: `${TAG_URL}/multiple`,
    method: 'PATCH',
    body: body
})

export const deleteTagApi = (tagId: string): ApiConfig => ({
    url: `${TAG_URL}/${tagId}`,
    method: 'DELETE',
})

export const fetchTagCategories = (): ApiConfig => ({
    url: `${TAG_URL}/categories`,
    method: 'GET'
})