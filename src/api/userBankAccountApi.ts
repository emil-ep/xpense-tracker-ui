import { USER_BANK_ACCOUNT_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


export const fetchUserBankAccountsApi = (): ApiConfig => ({
    url: `${USER_BANK_ACCOUNT_URL}`,
    method: 'GET',
})