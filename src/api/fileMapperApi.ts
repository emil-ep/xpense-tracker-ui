import { useCallback } from "react";
import { ApiConfig } from "./useApi";

export const getHeaderMapper = (fileName: string) : ApiConfig => ({
    url : `http://localhost:8080/v1/expenses/statement/mapper?fileName=${fileName}`,
    method: 'GET',
});


export const useHeaderMapper = (fileName: string) => {
  const getHeaderMapper = useCallback((): ApiConfig => ({
    url: `http://localhost:8080/v1/expenses/statement/mapper?fileName=${fileName}`,
    method: 'GET',
  }), [fileName]);

  return getHeaderMapper;
};