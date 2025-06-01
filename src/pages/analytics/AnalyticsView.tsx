import './analyticsView.css'

import { Box, CssBaseline, Grid2, ThemeProvider, createTheme } from '@mui/material'
import { useEffect, useState } from 'react'

import AnalyticCard from '../../components/cards/AnalyticCard';
import { format } from "date-fns";
import { useDateRange } from '../../context/DateRangeContext';
import { useApi } from '../../api/hook/useApi';
import { FetchTagsResponse, Tag } from '../../api/ApiResponses';
import { fetchTagsApi } from '../../api/tagApi';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#669df6' },
    background: { 
      default: 'rgb(5, 30, 52)',
      paper: 'rgb(5, 30, 52)',   
    },
  },
});

export interface Timeframe {
    fromDate: string | null;
    toDate: string | null;
}

export const AnalyticsView = () => {

    const [timeframe, setTimeframe] = useState<Timeframe | null>(null);
    const[tags, setTags] = useState<Tag[]>([]);

    const { fromDate, toDate } = useDateRange();

    const { responseBody: tagsResponse, error: tagsError } = useApi<FetchTagsResponse>(fetchTagsApi, []);

    useEffect(() => {
        if(tagsResponse && tagsResponse.data){
            setTags(tagsResponse.data);
        }
    }, [tagsResponse]);

    useEffect(() => {
        if (fromDate && toDate) {
            // Fetch analytics data based on the new date range
            const newTimeframe = {
                fromDate: format(fromDate, "dd/MM/yy"),
                toDate: format(toDate, "dd/MM/yy")
            }
            setTimeframe(newTimeframe);
        }
    }, [fromDate, toDate]);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1}}>
                {timeframe && (

                    <Grid2 className="gridContainer" container spacing={2}>
                        <Grid2 size={6}>
                            <AnalyticCard 
                                title='Monthly Aggregation' 
                                aggregationMode='monthly' 
                                metricsToFetch={['credit_aggregate', 'debit_aggregate']} 
                                timeframe={timeframe}
                            />
                        </Grid2>
                        <Grid2 size={6}>
                            <AnalyticCard 
                                title='Weekly Aggregation' 
                                aggregationMode='weekly' 
                                metricsToFetch={['credit_aggregate', 'debit_aggregate']} 
                                timeframe={timeframe}
                            />
                        </Grid2>
                        <Grid2 size={4}>/
                            <AnalyticCard 
                                title='Yearly Aggregation' 
                                aggregationMode='yearly' 
                                metricsToFetch={['credit_aggregate', 'debit_aggregate']} 
                                timeframe={timeframe}
                            />
                        </Grid2>
                        <Grid2 size={4}>/
                            <AnalyticCard 
                                title='Expense aggregation' 
                                aggregationMode='monthly' 
                                metricsToFetch={['expense_aggregate']} 
                                timeframe={timeframe}
                                tooltipText='Expense is calculated as the sum of all debits - any expense having tag category "Mutual Fund Savings, Salary, Own Account, Other Savings"'
                            />
                        </Grid2>
                        <Grid2 size={16}>/
                            <AnalyticCard 
                                title='Tags Aggregate' 
                                aggregationMode='monthly' 
                                metricsToFetch={['tags_aggregate']} 
                                timeframe={timeframe}
                                tags={tags}
                            />
                        </Grid2>
                    </Grid2>
                )}
            </Box>
        </ThemeProvider>
    )
}