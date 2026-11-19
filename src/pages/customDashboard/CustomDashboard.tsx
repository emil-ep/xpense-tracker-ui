import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import { format } from 'date-fns';
import { useDateRange } from '../../context/DateRangeContext';
import { useBankAccount } from '../../context/BankAccountContext';
import { Timeframe } from '../analytics/AnalyticsView';
import { useApi } from '../../api/hook/useApi';
import { fetchTagsApi } from '../../api/tagApi';
import { FetchTagsResponse } from '../../api/ApiResponses';
import CustomAnalyticCard from '../../components/cards/CustomAnalyticCard';
import './customDashboard.css';

export default function CustomDashboard() {
    const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
    const { fromDate, toDate } = useDateRange();
    const { selectedBankAccountId } = useBankAccount();

    const fetchTags = useCallback(() => selectedBankAccountId
        ? fetchTagsApi(selectedBankAccountId)
        : { url: '', method: 'GET' as const }, [selectedBankAccountId]);
    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, [selectedBankAccountId]);

    useEffect(() => {
        setTimeframe(fromDate && toDate ? {
            fromDate: format(fromDate, 'dd/MM/yy'),
            toDate: format(toDate, 'dd/MM/yy'),
        } : null);
    }, [fromDate, toDate]);

    return (
        <Box className="customDashboardPage">
            <Box className="customDashboardContent">
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: .75 }}>
                    <DashboardCustomizeRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                    <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Build your own view</Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Custom dashboard</Typography>
                <Typography variant="body2" sx={{ color: '#849087', mt: .75, mb: 3 }}>Choose the metrics and time scale that help you make sense of your money.</Typography>

                {!selectedBankAccountId
                    ? <Box className="customDashboardNotice">Select a bank account to build your dashboard.</Box>
                    : timeframe && <CustomAnalyticCard tags={tagsResponse?.data} timeframe={timeframe} bankAccountId={selectedBankAccountId} />}
            </Box>
        </Box>
    );
}
