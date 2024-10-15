import { useCallback } from "react";
import { ApiConfig } from "./hook/useApi";


export const useHeaderMapper = (fileName: string) => {
  const getHeaderMapper = useCallback((): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/statement/mapper?fileName=${fileName}`,
    method: 'GET',
  }), [fileName]);

  return getHeaderMapper;
};

export const useExpensePreview = (fileName: string, body: any) => {
    const getExpensePreview = useCallback((): ApiConfig => ({
        url: `http://localhost:8080/v1/expenses/statement/preview?fileName=${fileName}`,
        method: 'POST',
        body: body
    }), [fileName, body]);
    return getExpensePreview;
}