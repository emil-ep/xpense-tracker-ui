import './analyticsView.css';

import { useCallback, useEffect, useState } from 'react';
import { Box, Chip, Grid2, Stack, Typography } from '@mui/material';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { format } from 'date-fns';
import AnalyticCard from '../../components/cards/AnalyticCard';
import { useDateRange } from '../../context/DateRangeContext';
import { useBankAccount } from '../../context/BankAccountContext';
import { useApi } from '../../api/hook/useApi';
import { FetchTagsResponse, Tag } from '../../api/ApiResponses';
import { fetchTagsApi } from '../../api/tagApi';

export interface Timeframe {
    fromDate: string | null;
    toDate: string | null;
}

export const AnalyticsView = () => {
    const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const { fromDate, toDate } = useDateRange();
    const { selectedBankAccountId } = useBankAccount();

    const fetchTags = useCallback(() => selectedBankAccountId
        ? fetchTagsApi(selectedBankAccountId)
        : { url: '', method: 'GET' as const }, [selectedBankAccountId]);
    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, [selectedBankAccountId]);

    useEffect(() => {
        if (tagsResponse?.data) setTags(tagsResponse.data);
    }, [tagsResponse]);

    useEffect(() => {
        if (fromDate && toDate) {
            setTimeframe({ fromDate: format(fromDate, 'dd/MM/yy'), toDate: format(toDate, 'dd/MM/yy') });
        } else {
            setTimeframe(null);
        }
    }, [fromDate, toDate]);

    return (
        <Box className="analyticsPage">
            <Box className="analyticsContent">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
                    <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}>
                            <InsightsRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                            <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Your financial patterns</Typography>
                        </Stack>
                        <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Analytics</Typography>
                        <Typography variant="body2" sx={{ color: '#849087', mt: .75 }}>Explore cash flow, spending trends, and activity by tag.</Typography>
                    </Box>
                    {fromDate && toDate && <Chip icon={<InsightsRoundedIcon />} label={`${format(fromDate, 'MMM d')} – ${format(toDate, 'MMM d, yyyy')}`} sx={{ bgcolor: '#e9f1eb', color: '#426b53', fontWeight: 650, borderRadius: 2 }} />}
                </Stack>

                {!selectedBankAccountId ? <Box className="analyticsNotice">Select a bank account to explore your analytics.</Box> : timeframe && <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, lg: 8 }}>
                        <AnalyticCard
                            title="Monthly cash flow"
                            subtitle="Money in and out, month by month"
                            aggregationMode="monthly"
                            metricsToFetch={['credit_aggregate', 'debit_aggregate']}
                            timeframe={timeframe}
                            bankAccountId={selectedBankAccountId}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, lg: 4 }}>
                        <AnalyticCard
                            title="Spending trend"
                            subtitle="Net expenses, month by month"
                            aggregationMode="monthly"
                            metricsToFetch={['expense_aggregate']}
                            timeframe={timeframe}
                            bankAccountId={selectedBankAccountId}
                            tooltipText="Expenses exclude transactions in your configured savings categories."
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <AnalyticCard
                            title="Yearly overview"
                            subtitle="Compare your cash flow across years"
                            aggregationMode="yearly"
                            metricsToFetch={['credit_aggregate', 'debit_aggregate']}
                            timeframe={timeframe}
                            bankAccountId={selectedBankAccountId}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <AnalyticCard
                            title="Weekly rhythm"
                            subtitle="See how activity moves week to week"
                            aggregationMode="weekly"
                            metricsToFetch={['credit_aggregate', 'debit_aggregate']}
                            timeframe={timeframe}
                            bankAccountId={selectedBankAccountId}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <AnalyticCard
                            title="Activity by tag"
                            subtitle="Compare net tagged activity across the selected period"
                            aggregationMode="monthly"
                            metricsToFetch={['tags_aggregate']}
                            timeframe={timeframe}
                            tags={tags}
                            showLegend={false}
                            bankAccountId={selectedBankAccountId}
                            tooltipText="Tag values show the absolute difference between credits and debits for each tag."
                        />
                    </Grid2>
                </Grid2>}
            </Box>
        </Box>
    );
};
