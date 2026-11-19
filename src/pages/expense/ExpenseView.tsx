import './expenseView.css';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import ExpenseTable from '../../components/table/expenses/ExpenseTable';
import { getExpensesV2 } from '../../api/expensesApi';
import { useApi } from '../../api/hook/useApi';
import { fetchTagCategories, fetchTagsApi } from '../../api/tagApi';
import { Timeframe } from '../analytics/AnalyticsView';
import { useDateRange } from '../../context/DateRangeContext';
import { useBankAccount } from '../../context/BankAccountContext';
import { ExpenseItemType, FetchTagsResponse, PaginatedExpenseResponse, Tag, TagCategory, TagCategoryResponse } from '../../api/ApiResponses';
import { findCurrency } from '../../utils/CurrencyUtil';

const summaryCardSx = { height: '100%', borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff' };

export const ExpenseView = () => {
    const [, setSearchParams] = useSearchParams();
    const [expenseItems, setExpenseItems] = useState<ExpenseItemType[]>([]);
    const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
    const { fromDate, toDate } = useDateRange();
    const { selectedBankAccountId } = useBankAccount();

    const updateParams = useCallback((newParams: Record<string, string | number>) => {
        setSearchParams(currentParams => {
            const updatedParams = new URLSearchParams(currentParams);
            Object.entries(newParams).forEach(([key, value]) => updatedParams.set(key, String(value)));
            return updatedParams;
        });
    }, [setSearchParams]);

    useEffect(() => {
        if (fromDate && toDate) {
            const newTimeframe = { fromDate: format(fromDate, 'dd-MM-yy'), toDate: format(toDate, 'dd-MM-yy') };
            updateParams(newTimeframe);
            setTimeframe(newTimeframe);
        }
    }, [fromDate, toDate, updateParams]);

    const fetchExpenses = useCallback(() => timeframe && selectedBankAccountId
        ? getExpensesV2(1, 50000, timeframe.fromDate!, timeframe.toDate!, selectedBankAccountId)
        : { url: '', method: 'GET' as const }, [timeframe, selectedBankAccountId]);
    const { responseBody, loading } = useApi<PaginatedExpenseResponse>(fetchExpenses, [timeframe, selectedBankAccountId]);

    const fetchTags = useCallback(() => selectedBankAccountId
        ? fetchTagsApi(selectedBankAccountId)
        : { url: '', method: 'GET' as const }, [selectedBankAccountId]);
    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, [selectedBankAccountId]);
    const { responseBody: tagsCategoryResponse } = useApi<TagCategoryResponse>(fetchTagCategories, []);

    useEffect(() => {
        if (responseBody?.data?.expenses) setExpenseItems(responseBody.data.expenses.map(item => ({
            ...item,
            amount: item.type === 'CREDIT' ? item.credit : item.debit,
        })));
    }, [responseBody]);
    useEffect(() => { if (tagsCategoryResponse?.data) setTagCategories(tagsCategoryResponse.data); }, [tagsCategoryResponse]);
    useEffect(() => { if (tagsResponse?.data) setTags(tagsResponse.data); }, [tagsResponse]);

    const stats = useMemo(() => ({
        count: expenseItems.length,
        moneyIn: expenseItems.reduce((sum, expense) => sum + (Number(expense.credit) || 0), 0),
        moneyOut: expenseItems.reduce((sum, expense) => sum + (Number(expense.debit) || 0), 0),
        untagged: expenseItems.filter(expense => !expense.tags?.length).length,
    }), [expenseItems]);
    const currency = findCurrency(window.tracker?.userCurrency ?? '');
    const rangeLabel = fromDate && toDate ? `${format(fromDate, 'MMM d')} – ${format(toDate, 'MMM d, yyyy')}` : 'Choose a date range';

    return (
        <Box className="expensePage">
            <Box className="expenseContent">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 2.5 }}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}>
                            <ReceiptLongRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                            <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Your activity</Typography>
                        </Stack>
                        <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Expenses</Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .75 }}>
                            <Typography variant="body2" sx={{ color: '#849087' }}>{rangeLabel}</Typography>
                            {!loading && <Chip size="small" label={`${stats.count.toLocaleString()} transactions`} sx={{ height: 23, bgcolor: '#e9f1eb', color: '#426b53', fontWeight: 650 }} />}
                        </Stack>
                    </Box>
                    <Button href="/add/expense" variant="contained" startIcon={<AddRoundedIcon />} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, borderRadius: 3, px: 2.5, py: 1.2, bgcolor: '#28634c', textTransform: 'none', fontWeight: 700, boxShadow: '0 8px 20px #28634c2e', '&:hover': { bgcolor: '#1e503c' } }}>Add expense</Button>
                </Stack>

                {!selectedBankAccountId && <Alert severity="info" sx={{ mb: 2 }}>Select a bank account to see your transactions.</Alert>}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6} md={3}><ExpenseSummary title="Money in" value={`${currency} ${stats.moneyIn.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={<TrendingUpRoundedIcon />} color="#43815b" loading={loading} /></Grid>
                    <Grid item xs={6} md={3}><ExpenseSummary title="Money out" value={`${currency} ${stats.moneyOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={<TrendingDownRoundedIcon />} color="#c77961" loading={loading} /></Grid>
                    <Grid item xs={6} md={3}><ExpenseSummary title="Transactions" value={stats.count.toLocaleString()} icon={<ReceiptLongRoundedIcon />} color="#5267a2" loading={loading} /></Grid>
                    <Grid item xs={6} md={3}><ExpenseSummary title="Needs a tag" value={stats.untagged.toLocaleString()} icon={<LocalOfferRoundedIcon />} color="#bd7c38" loading={loading} /></Grid>
                </Grid>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}><CircularProgress size={20} sx={{ color: '#43815b' }} /></Box>}
                <ExpenseTable
                    clazzName="expenseTableContainer"
                    height="min(60vh, 660px)"
                    pagination
                    expenses={expenseItems}
                    tagCategories={tagCategories}
                    tags={tags}
                />
            </Box>
        </Box>
    );
};

function ExpenseSummary({ title, value, icon, color, loading }: { title: string; value: string; icon: React.ReactNode; color: string; loading: boolean }) {
    return <Card sx={summaryCardSx}><CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box sx={{ minWidth: 0 }}><Typography variant="caption" noWrap sx={{ color: '#77847b', fontWeight: 600 }}>{title}</Typography>{loading ? <CircularProgress size={18} sx={{ display: 'block', mt: .8 }} /> : <Typography variant="h6" noWrap sx={{ mt: .5, color: '#203b30', fontWeight: 750, letterSpacing: '-.03em' }}>{value}</Typography>}</Box>
            <Avatar sx={{ width: 38, height: 38, bgcolor: `${color}15`, color, flexShrink: 0 }}>{icon}</Avatar>
        </Stack>
    </CardContent></Card>;
}
