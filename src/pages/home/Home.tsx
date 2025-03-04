import {  MetricsV2Response} from "../../api/ApiResponses";
import React, { useEffect, useState } from "react";
import { getNavigate } from "../../navigation";
import { Stack, Card, CardContent, CircularProgress, Typography, Grid2, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { AttachMoney, BarChart, Category, PriceCheck, TrendingUp } from '@mui/icons-material';

export default function Home(){

    const metricDetails: Record<string, { label: string; icon: React.ElementType; color: string }> = {
        highest_expense_recorded: { label: "Highest Expense Recorded", icon: TrendingUp, color: "#ff4d4d" },
        total_expenses_entry: { label: "Total Expenses Entry", icon: BarChart, color: "#ffa31a" },
        total_tagged_expenses_entry: { label: "Total Tagged Expenses Entry", icon: Category, color: "#1a75ff" },
        total_untagged_expenses_entry: { label: "Total Untagged Expenses Entry", icon: PriceCheck, color: "#4db8ff" },
        highest_expense_tag: { label: "Highest Expense Tag", icon: AttachMoney, color: "#33cc33" },
        highest_credit_recorded: { label: "Highest Credit Recorded", icon: TrendingUp, color: "#ff4d4d" },
        highest_credit_recorded_tag: { label: "Highest Credit Recorded Tag", icon: AttachMoney, color: "#33cc33" },
    };
    const metricNames = Object.keys(metricDetails);

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


    const navigate = getNavigate();
   const [metrics, setMetrics] = useState<Record<string, any>>({});

    const fetchMetrics = React.useCallback(() => {
            return fetchMetricsV2('custom', metricNames, { fromDate: null, toDate: null});
        }, []);
    
      const { responseBody, error, loading } = useApi<MetricsV2Response>(fetchMetrics, []);

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
                    <Grid2 container spacing={3}>
                        {Object.entries(metricDetails)
                            .filter(([key]) => metrics.hasOwnProperty(key)) // Only include available metrics
                            .map(([key, { label, icon: Icon, color }]) => {
                                const value = metrics[key];

                                return (
                                    <Grid2  key={key}>
                                        <Card
                                            sx={{
                                                minWidth: 250,
                                                p: 3,
                                                textAlign: "center",
                                                boxShadow: 4,
                                                borderRadius: "12px",
                                                background: `linear-gradient(135deg, ${color}, #333)`,
                                                color: "#fff",
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Icon sx={{ fontSize: 50, color: "white", mb: 1 }} />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {label}
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {value !== "" ? value : "N/A"}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                );
                            })}
                    </Grid2>
                )}
            </Stack>
        </ThemeProvider>   
    )
}