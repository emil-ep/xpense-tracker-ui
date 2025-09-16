import { MetricsV2Response } from "../../api/ApiResponses";
import {  useCallback, useEffect, useState } from "react";
import { Stack, Card, CardContent, CircularProgress, Typography, Grid, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { findCurrency } from "../../utils/CurrencyUtil";

export default function Home(){

    const metricDetails: Record<string, { label: string; description: string; type: string }> = {
        highest_expense_recorded: { label: "Highest Expense Recorded", description: "The maximum amount spent in a single transaction", type: 'AMOUNT' },
        total_expenses_entry: { label: "Total Expenses Entry", description: "Total number of expenses recorded", type : 'COUNT' },
        total_tagged_expenses_entry: { label: "Total Tagged Expenses", description: "Expenses categorized with a tag", type: 'COUNT' },
        total_untagged_expenses_entry: { label: "Total Untagged Expenses", description: "Expenses without a category tag", type: 'COUNT' },
        highest_expense_tag: { label: "Highest Expense Tag", description: "The category with the highest spending", type: 'TAG' },
        highest_credit_recorded: { label: "Highest Credit Recorded", description: "The maximum credited amount in a single transaction", type: 'AMOUNT' },
        highest_credit_recorded_tag: { label: "Highest Credit Recorded Tag", description: "The most credited category", type: 'TAG' },
        first_expense_recorded_date: { label: "First Expense Recorded", description: "Date when the first expense was recorded", type: 'DATE' },
        last_expense_recorded_date: { label: "Last Expense Recorded", description: "Date when the last expense was recorded", type: 'DATE' },
    };

    const metricNames = Object.keys(metricDetails);

    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#a0c4ff' },
        background: { 
          default: '#051e34',
          paper: 'linear-gradient(145deg, #0d1b2a, #152c3e)',  // Subtle gradient
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0c4ff'
        }
      },
    });

    const [metrics, setMetrics] = useState<Record<string, any>>({});

    const fetchMetrics = useCallback(() => {
        return fetchMetricsV2('custom', metricNames, { fromDate: null, toDate: null});
    }, []);
    
    const { responseBody, loading } = useApi<MetricsV2Response>(fetchMetrics, []);

    useEffect(() => {
        if (responseBody && responseBody.data && responseBody.data.length > 0) {
            setMetrics(responseBody.data[0]); 
        }
    }, [responseBody]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    💰 Expense Dashboard
                </Typography>

                {loading ? (
                    <Stack alignItems="center">
                        <CircularProgress />
                    </Stack>
                ) : (
                    <Grid container spacing={3}>
                        {Object.entries(metricDetails)
                            .filter(([key]) => Object.prototype.hasOwnProperty.call(metrics, key))
                            .map(([key, { label, description, type }]) => {
                                const value = metrics[key];

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Card
                                            sx={{
                                                minWidth: 250,
                                                p: 2,
                                                textAlign: "left",
                                                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",  // Soft shadow
                                                borderRadius: "12px",
                                                background: theme.palette.background.paper,
                                                border: "1px solid rgba(255, 255, 255, 0.1)",  // Soft border
                                                mr: 2,  // Right margin
                                                transition: "transform 0.2s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold" color="primary">
                                                    {label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {description}
                                                </Typography>
                                                <Typography variant="h5" fontWeight="bold" color="text.primary">
                                                    {value !== "" ? type === 'AMOUNT' ? `${findCurrency(window.tracker?.userCurrency ?? '')} ${value}`: value : "N/A"}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                    </Grid>
                )}
            </Stack>
        </ThemeProvider>   
    )
}
