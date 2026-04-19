import { MetricAggregatioMode, MetricBody } from "./ApiRequests";
import { METRICS_URL } from "./ApiUrl";
import { ApiConfig } from "./hook/useApi";

export const fetchMetricsV2 = (aggregationMode: MetricAggregatioMode, metrics: string[], body: MetricBody, bankAccountId: string) : ApiConfig => ({
    url : `${METRICS_URL}/v2?aggregationMode=${aggregationMode}&metrics=${metrics}&bankAccountId=${bankAccountId}`,
    method: 'POST',
    body: body
})