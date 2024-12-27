
import { FILE_MAPPER_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


export const getHeaderMapperConfig = (fileName: string): ApiConfig => ({
  url: `${FILE_MAPPER_URL}/mapper?fileName=${fileName}`,
  method: "GET",
});

export const getPreviewApi = (fileName: string, body: any): ApiConfig => ({
    url: `${FILE_MAPPER_URL}/preview?fileName=${fileName}`,
    method: 'POST',
    body: body
});
