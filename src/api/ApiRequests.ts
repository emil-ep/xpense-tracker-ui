
export type MetricAggregatioMode = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type Metrics = 'credit_aggregate' | 'debit_aggregate' | 'tags_aggregate' | 'highest_expense_recorded';

export interface MetricBody {
    fromDate: string | null;
    toDate: string | null;
}