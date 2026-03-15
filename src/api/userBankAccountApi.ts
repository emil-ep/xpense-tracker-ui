import { UpsertUserBankAccountRequest } from "./ApiRequests";
import { USER_BANK_ACCOUNT_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";


export const fetchUserBankAccountsApi = (): ApiConfig => ({
    url: `${USER_BANK_ACCOUNT_URL}`,
    method: 'GET',
})

export const upsertUserBankAccountApi = (body: UpsertUserBankAccountRequest): ApiConfig => ({
    url: `${USER_BANK_ACCOUNT_URL}`,
    method: 'POST',
    body: body
})

export const fetchBankAccountTypes = (): ApiConfig => ({
    url: `${USER_BANK_ACCOUNT_URL}/types`,
    method: 'GET',
})