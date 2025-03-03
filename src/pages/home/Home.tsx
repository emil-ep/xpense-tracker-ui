import './home.css'

import { MetricsV2, MetricsV2Response} from "../../api/ApiResponses";
import React, { useEffect, useState } from "react";
import { getNavigate } from "../../navigation";
import { Stack, Card, CardContent, CircularProgress, Grid, Typography, Grid2 } from '@mui/material';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';

export default function Home(){

    const metricLabels: Record<string, string> = {
        highest_expense_recorded: "Highest Expense Recorded",
        highest_expense_tag: "Highest expense tag",
        total_tagged_expenses_entry: "Total tagged expenses",
        total_untagged_expenses_entry: "Total untagged expenses",
        total_expenses_entry: "Total expenses",
    };
    const metricNames = Object.keys(metricLabels);

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
        <Stack spacing={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Expense Dashboard</Typography>

            {loading ? (
                <Stack alignItems="center">
                    <CircularProgress />
                </Stack>
            ) : (
                <Grid2 container spacing={3}>
                    {Object.entries(metrics).map(([key, value]) => (
                        <Grid2 size={2}>
                            <Card sx={{ minWidth: 250, p: 2, textAlign: "center", boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary">
                                        {metricLabels[key] || key} {/* Show mapped label or fallback to key */}
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">{value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid2>
                    ))}
                </Grid2>
            )}
        </Stack>
    )
    
}