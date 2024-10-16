
import { ApiConfig } from "./hook/useApi";


export const getHeaderMapperConfig = (fileName: string): ApiConfig => ({
  url: `http://localhost:8080/v1/expenses/statement/mapper?fileName=${fileName}`,
  method: "GET",
});

export const getPreviewApi = (fileName: string, body: any): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/statement/preview?fileName=${fileName}`,
    method: 'POST',
    body: body
});
