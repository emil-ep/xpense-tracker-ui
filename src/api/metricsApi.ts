import { MetricAggregatioMode, MetricBody, Metrics } from "./ApiRequests";
import { ApiConfig } from "./hook/useApi";

export const fetchMetricsV2 = (aggregationMode: MetricAggregatioMode, metrics: Metrics[], body: MetricBody) : ApiConfig => ({
    url : `http://localhost:8080/v1/metrics/v2?aggregationMode=${aggregationMode}&metrics=${metrics}`,
    method: 'POST',
    body: body
})