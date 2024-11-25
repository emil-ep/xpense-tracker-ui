import { ApiConfig } from "./hook/useApi";

export const createTagApi = (body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/tag`,
    method: 'POST',
    body: body
})