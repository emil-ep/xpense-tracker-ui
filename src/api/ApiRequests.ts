
export type MetricAggregatioMode = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type Metrics = 'credit_aggregate' | 'debit_aggregate' | 'tags_aggregate'

export interface MetricBody {
    fromDate: string;
    toDate: string;
}