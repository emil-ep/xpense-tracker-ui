import './analyticsView.css'

import { Box, CssBaseline, Grid2, ThemeProvider, createTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'

import AnalyticCard from '../../components/cards/AnalyticCard';
import { format } from "date-fns";
import { useDateRange } from '../../context/DateRangeContext';

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
    fromDate: string;
    toDate: string;
}

export const AnalyticsView = () => {

    const [timeframe, setTimeframe] = useState<Timeframe>({ fromDate: '01/01/24', toDate: '01/01/24'});

    const { fromDate, toDate } = useDateRange();

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
                <Grid2 className="gridContainer" container spacing={2}>
                    <Grid2 size={16}>
                        <AnalyticCard 
                            title='Daily Aggregation' 
                            aggregationMode='daily' 
                            metricsToFetch={['credit_aggregate', 'debit_aggregate']} 
                            timeframe={timeframe}
                        />
                    </Grid2>
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
                    <Grid2 size={16}>/
                        <AnalyticCard 
                            title='Tags Aggregate' 
                            aggregationMode='monthly' 
                            metricsToFetch={['tags_aggregate']} 
                            timeframe={timeframe}
                        />
                    </Grid2>
                </Grid2>
            </Box>
        </ThemeProvider>
    )
}