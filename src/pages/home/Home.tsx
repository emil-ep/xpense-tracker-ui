import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { format, isValid, parse, parseISO } from 'date-fns';
import {
  Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, LinearProgress, Stack, Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { BarChart } from '@mui/x-charts/BarChart';
import { Link, useLocation } from 'react-router-dom';
import { MetricsV2, MetricsV2Response, PaginatedExpenseResponse, ExpenseItemType } from '../../api/ApiResponses';
import { MetricBody } from '../../api/ApiRequests';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { getExpensesV2 } from '../../api/expensesApi';
import { useApi } from '../../api/hook/useApi';
import { useBankAccount } from '../../context/BankAccountContext';
import { useDateRange } from '../../context/DateRangeContext';
import { findCurrency } from '../../utils/CurrencyUtil';

const summaryMetrics = [
  'expense_aggregate', 'total_expenses_entry', 'total_untagged_expenses_entry', 'highest_expense_recorded',
];
const trendMetrics = ['debit_aggregate', 'credit_aggregate', 'tags_aggregate'];
const emptyMetrics: MetricsV2[] = [];

const money = (value: number | undefined) => `${findCurrency(window.tracker?.userCurrency ?? '')} ${(Number.isFinite(value) ? value as number : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const dateText = (date?: string) => {
  if (!date) return 'Date unavailable';
  const isoDate = parseISO(date);
  if (isValid(isoDate)) return format(isoDate, 'MMM d, yyyy');
  const apiDate = parse(date, 'dd/MM/yy', new Date());
  return isValid(apiDate) ? format(apiDate, 'MMM d, yyyy') : 'Date unavailable';
};

export default function Home() {
  const location = useLocation();
  const { selectedBankAccountId } = useBankAccount();
  const { fromDate, toDate } = useDateRange();
  const timeframe = useMemo<MetricBody | null>(() => fromDate && toDate ? {
    fromDate: format(fromDate, 'dd/MM/yy'),
    toDate: format(toDate, 'dd/MM/yy'),
  } : null, [fromDate, toDate]);

  const fetchSummary = useCallback(() => selectedBankAccountId && timeframe
    ? fetchMetricsV2('custom', summaryMetrics, timeframe, selectedBankAccountId)
    : { url: '', method: 'GET' as const }, [selectedBankAccountId, timeframe]);
  const fetchTrend = useCallback(() => selectedBankAccountId && timeframe
    ? fetchMetricsV2('monthly', trendMetrics, timeframe, selectedBankAccountId)
    : { url: '', method: 'GET' as const }, [selectedBankAccountId, timeframe]);
  const fetchRecent = useCallback(() => selectedBankAccountId && timeframe
    ? getExpensesV2(1, 5, format(fromDate!, 'dd-MM-yy'), format(toDate!, 'dd-MM-yy'), selectedBankAccountId)
    : { url: '', method: 'GET' as const }, [selectedBankAccountId, timeframe, fromDate, toDate]);

  const { responseBody: summaryResponse, loading: summaryLoading, error: summaryError } = useApi<MetricsV2Response>(fetchSummary, [selectedBankAccountId, timeframe]);
  const { responseBody: trendResponse, loading: trendLoading, error: trendError } = useApi<MetricsV2Response>(fetchTrend, [selectedBankAccountId, timeframe]);
  const { responseBody: recentResponse, loading: recentLoading, error: recentError } = useApi<PaginatedExpenseResponse>(fetchRecent, [selectedBankAccountId, timeframe]);

  const summary = summaryResponse?.data?.[0];
  const trend = trendResponse?.data ?? emptyMetrics;
  const chartDataset = trend.map(item => ({
    timeframe: item.timeframe,
    credit_aggregate: item.credit_aggregate ?? 0,
    debit_aggregate: item.debit_aggregate ?? 0,
  }));
  const recent = recentResponse?.data?.expenses ?? [];
  const rangeLabel = fromDate && toDate ? `${format(fromDate, 'MMM d')} – ${format(toDate, 'MMM d, yyyy')}` : 'Choose a date range';
  const tagTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    trend.forEach(item => {
      const tags = item.tags_aggregate as Record<string, number> | undefined;
      Object.entries(tags ?? {}).forEach(([name, value]) => {
        if (!name.startsWith('UnTagged')) totals[name] = (totals[name] ?? 0) + Math.abs(Number(value) || 0);
      });
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [trend]);
  const tagMax = tagTotals[0]?.[1] ?? 1;

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f6f3', color: '#202b27', px: { xs: 2, md: 4 }, pt: { xs: 10, md: 11 }, pb: 5 }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#718078', mb: .5 }}>{greeting}{window.tracker?.username ? `, ${window.tracker.username}` : ''}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 750, letterSpacing: '-.04em', color: '#18382d' }}>Your money, in focus.</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: '#728078' }} />
              <Typography variant="body2" sx={{ color: '#728078' }}>{rangeLabel}</Typography>
            </Stack>
          </Box>
          <Button component={Link} to={{ pathname: '/add/expense', search: location.search }} variant="contained" startIcon={<AddRoundedIcon />} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, borderRadius: 3, px: 2.5, py: 1.2, bgcolor: '#28634c', textTransform: 'none', fontWeight: 700, boxShadow: '0 8px 20px #28634c2e', '&:hover': { bgcolor: '#1e503c' } }}>
            Add expense
          </Button>
        </Stack>

        {!selectedBankAccountId && <Alert severity="info" sx={{ mb: 2 }}>Select a bank account to see your spending overview.</Alert>}
        {(summaryError || trendError || recentError) && <Alert severity="warning" sx={{ mb: 2 }}>Some dashboard details could not be loaded. Try refreshing the page.</Alert>}

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} lg={3}><MetricCard title="Spent in this period" value={summaryLoading ? null : money(Number(summary?.expense_aggregate))} detail="Your net expenses" icon={<TrendingDownRoundedIcon />} color="#28634c" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><MetricCard title="Transactions" value={summaryLoading ? null : (summary?.total_expenses_entry ?? '—')} detail="Recorded in this period" icon={<ReceiptLongRoundedIcon />} color="#5267a2" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><MetricCard title="Needs a tag" value={summaryLoading ? null : (summary?.total_untagged_expenses_entry ?? '—')} detail="Expenses to categorize" icon={<LocalOfferRoundedIcon />} color="#bd7c38" /></Grid>
          <Grid item xs={12} sm={6} lg={3}><MetricCard title="Largest expense" value={summaryLoading ? null : money(Number(summary?.highest_expense_recorded))} detail="Single transaction" icon={<SavingsRoundedIcon />} color="#8b5b8e" /></Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={8}>
            <Card sx={panelSx}>
              <CardContent sx={{ p: { xs: 2, md: 3 }, '&:last-child': { pb: 2 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Box><Typography variant="h6" sx={sectionTitle}>Cash flow</Typography><Typography variant="body2" sx={muted}>Monthly credits and debits for the selected period</Typography></Box>
                  <Chip size="small" label="Monthly" sx={{ bgcolor: '#eff4ee', color: '#426b53', fontWeight: 650 }} />
                </Stack>
                {trendLoading ? <Box sx={{ py: 7 }}><LinearProgress sx={{ maxWidth: 300, mx: 'auto' }} /></Box> : trend.length ? <BarChart
                  height={280}
                  dataset={chartDataset}
                  xAxis={[{ scaleType: 'band', dataKey: 'timeframe', tickLabelStyle: { fill: '#758179', fontSize: 12 } }]}
                  yAxis={[{ valueFormatter: value => `${findCurrency(window.tracker?.userCurrency ?? '')}${Number(value).toLocaleString()}`, tickLabelStyle: { fill: '#758179', fontSize: 11 } }]}
                  series={[
                    { dataKey: 'credit_aggregate', label: 'Money in', color: '#8fb9a0', valueFormatter: value => money(Number(value)) },
                    { dataKey: 'debit_aggregate', label: 'Money out', color: '#df987e', valueFormatter: value => money(Number(value)) },
                  ]}
                  grid={{ horizontal: true }}
                  slotProps={{ legend: { position: { vertical: 'top', horizontal: 'right' } } }}
                  sx={{ mt: 1, '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: '#e7ebe7' }, '& .MuiChartsGrid-line': { stroke: '#edf0ed' } }}
                /> : <EmptyBlock text="No transactions in this date range yet." />}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ ...panelSx, height: '100%' }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={sectionTitle}>Top categories</Typography>
                <Typography variant="body2" sx={{ ...muted, mb: 2.5 }}>Net activity by tag in this period</Typography>
                {trendLoading ? <CircularProgress size={22} /> : tagTotals.length ? <Stack spacing={2.3}>
                  {tagTotals.map(([name, amount], index) => <Box key={name}>
                    <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: .8 }}>
                      <Stack direction="row" spacing={1} alignItems="center" minWidth={0}><Avatar sx={{ width: 25, height: 25, fontSize: 12, bgcolor: ['#e3eee7', '#e9e8f2', '#f5eadc', '#e5edf0'][index], color: '#355747' }}>{name.slice(0, 1).toUpperCase()}</Avatar><Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{name}</Typography></Stack>
                      <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{money(amount)}</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={Math.max(5, amount / tagMax * 100)} sx={{ height: 6, borderRadius: 5, bgcolor: '#eef1ed', '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: ['#78a88d', '#9995bf', '#d2a36f', '#83a9b8'][index] } }} />
                  </Box>)}
                </Stack> : <EmptyBlock text="Categories will appear once your expenses are tagged." />}
                <Button component={Link} to={{ pathname: '/analytics', search: location.search }} endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 3, px: 0, color: '#28634c', textTransform: 'none', fontWeight: 700 }}>Explore analytics</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={panelSx}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Box><Typography variant="h6" sx={sectionTitle}>Recent activity</Typography><Typography variant="body2" sx={muted}>Your latest transactions in this period</Typography></Box>
                  <Button component={Link} to={{ pathname: '/expense', search: location.search }} endIcon={<ArrowForwardRoundedIcon />} sx={{ color: '#28634c', textTransform: 'none', fontWeight: 700 }}>All expenses</Button>
                </Stack>
                {recentLoading ? <LinearProgress /> : recent.length ? <Stack divider={<Divider flexItem sx={{ borderColor: '#edf0ed' }} />}>
                  {recent.map((expense, index) => <RecentRow key={expense.id ?? `${expense.transactionDate}-${index}`} expense={expense} />)}
                </Stack> : <EmptyBlock text="No recent transactions for this period." />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

const panelSx = { borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff' };
const sectionTitle = { fontWeight: 720, color: '#203b30', letterSpacing: '-.02em' };
const muted = { color: '#849087' };

function MetricCard({ title, value, detail, icon, color }: { title: string; value: string | number | null; detail: string; icon: ReactNode; color: string }) {
  return <Card sx={{ ...panelSx, height: '100%' }}><CardContent sx={{ p: 2.4 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box><Typography variant="body2" sx={{ color: '#77847b', fontWeight: 600 }}>{title}</Typography>
        {value === null ? <CircularProgress size={22} sx={{ mt: 1.2 }} /> : <Typography variant="h5" sx={{ mt: .9, fontWeight: 750, letterSpacing: '-.035em', color: '#203b30' }}>{value}</Typography>}
      </Box>
      <Avatar sx={{ bgcolor: `${color}15`, color, width: 42, height: 42 }}>{icon}</Avatar>
    </Stack>
    <Typography variant="caption" sx={{ display: 'block', mt: 1.2, color: '#98a199' }}>{detail}</Typography>
  </CardContent></Card>;
}

function RecentRow({ expense }: { expense: ExpenseItemType }) {
  const isCredit = expense.type === 'CREDIT';
  const amount = Number(isCredit ? expense.credit : expense.debit) || 0;
  const tags = expense.tags?.map(tag => tag.name).join(', ') || 'Uncategorized';
  return <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 1.45 }}>
    <Avatar sx={{ width: 38, height: 38, bgcolor: isCredit ? '#e8f2eb' : '#f8ece7', color: isCredit ? '#43815b' : '#b66f56' }}>{isCredit ? <TrendingUpRoundedIcon fontSize="small" /> : <TrendingDownRoundedIcon fontSize="small" />}</Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" noWrap sx={{ fontWeight: 650, color: '#35483d' }}>{expense.description || 'Transaction'}</Typography><Typography variant="caption" noWrap sx={{ color: '#909b93' }}>{tags} · {dateText(expense.transactionDate)}</Typography></Box>
    <Typography variant="body2" sx={{ fontWeight: 750, color: isCredit ? '#43815b' : '#35483d', whiteSpace: 'nowrap' }}>{isCredit ? '+' : '−'}{money(amount)}</Typography>
  </Stack>;
}

function EmptyBlock({ text }: { text: string }) {
  return <Box sx={{ py: 5, textAlign: 'center' }}><Typography variant="body2" sx={{ color: '#89958c' }}>{text}</Typography></Box>;
}
