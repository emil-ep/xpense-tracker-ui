import { MUTUAL_FUND_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


export const searchMutualFundApi = (page: number, size: number, keyword: string): ApiConfig => ({
    url: `${MUTUAL_FUND_URL}/search?page=${page}&size=${size}&searchKey=${encodeURIComponent(keyword)}`,
    method: 'GET',
});