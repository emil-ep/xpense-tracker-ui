import * as React from 'react';
import { Box, Card, CardContent, Typography, Backdrop, CircularProgress, Stack } from '@mui/material';
import AnalyticBarChart from '../charts/AnalyticBarChart';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { MetricAggregatioMode, Metrics } from '../../api/ApiRequests';
import { MetricsV2, MetricsV2Response, Tag } from '../../api/ApiResponses';
import { Timeframe } from '../../pages/analytics/AnalyticsView';

export interface AnalyticCardProps {
  title?: string;
  aggregationMode: MetricAggregatioMode;
  metricsToFetch: Metrics[];
  timeframe: Timeframe;
  tags?: Tag[];
}

export default function AnalyticCard({ title = '', aggregationMode, metricsToFetch, timeframe, tags }: AnalyticCardProps) {
  const [metrics, setMetrics] = React.useState<MetricsV2[]>([]);
  const fetchMetrics = React.useCallback(() => {
    return fetchMetricsV2(aggregationMode, metricsToFetch, timeframe);
  }, [timeframe]);

  const { responseBody, loading } = useApi<MetricsV2Response>(fetchMetrics, []);

  React.useEffect(() => {
    if (responseBody && responseBody.data) {
      const results = responseBody.data.map((item) => {
        const { tags_aggregate, ...otherFields } = item;
        return { ...otherFields, ...tags_aggregate };
      });
      setMetrics(results);
    }
  }, [responseBody]);

  return (
    <Stack>
      {/* Loading Spinner */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Styled Analytics Card */}
      <Box sx={{ minWidth: 275 }}>
        <Card
          variant="outlined"
          sx={{
            p: 2,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",  // Soft shadow
            borderRadius: "12px",
            background: "linear-gradient(145deg, #0d1b2a, #152c3e)", // Subtle gradient
            border: "1px solid rgba(255, 255, 255, 0.1)",  // Soft border
          }}
        >
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
              {title}
            </Typography>
            <Box sx={{ width: "100%" }}>
              <AnalyticBarChart metrics={metrics} tags={tags}/>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
