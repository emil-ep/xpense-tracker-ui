
export type MetricAggregatioMode = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export type Metrics =
'credit_aggregate' | 
'debit_aggregate' | 
'tags_aggregate' |
'first_expense_recorded_date' |
'last_expense_recorded_date' |
'total_expenses_entry' |
'total_untagged_expenses_entry' |
'total_tagged_expenses_entry' |
'highest_expense_recorded' |
'highest_expense_tag' |
'highest_credit_recorded' |
'highest_credit_recorded_tag';

export interface MetricBody {
    fromDate: string | null;
    toDate: string | null;
}

export const findAggregationModeByValue = (value: string): MetricAggregatioMode => {
    switch (value) {
        case 'daily':
            return 'daily';
        case 'weekly':
            return 'weekly';
        case 'monthly':
            return 'monthly';
        case 'yearly':
            return 'yearly';
        case 'custom':
            return 'custom';
        default:
            throw new Error(`Unknown aggregation mode: ${value}`);
    }
}