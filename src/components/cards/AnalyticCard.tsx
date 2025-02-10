import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AnalyticBarChart from '../charts/AnalyticBarChart';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { MetricAggregatioMode, Metrics } from '../../api/ApiRequests';
import { MetricsV2, MetricsV2Response } from '../../api/ApiResponses';
import { Timeframe } from '../../pages/analytics/AnalyticsView';
import { Backdrop, CircularProgress, Stack } from '@mui/material';

export interface AnalyticCardProps {
  title?: string;
  aggregationMode: MetricAggregatioMode;
  metricsToFetch: Metrics[];
  timeframe: Timeframe;
}

export default function AnalyticCard({title = '', aggregationMode, metricsToFetch, timeframe}: AnalyticCardProps) {

  const [metrics, setMetrics] = React.useState<MetricsV2[]>([]);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {title}
        </Typography>
        <Box sx={{ width: "100%" }}>
            <AnalyticBarChart metrics={metrics} />
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </React.Fragment>
);

  const fetchMetrics = React.useCallback(() => {
        return fetchMetricsV2(aggregationMode, metricsToFetch, timeframe);
    }, [timeframe]);

  const { responseBody, error, loading } = useApi<MetricsV2Response>(fetchMetrics, []);

  React.useEffect(() => {

        if(responseBody && responseBody.data){

          const results: any[] = [];
          responseBody.data.forEach((item: MetricsV2) => {
            const { tags_aggregate, ...otherFields } = item;
            const resultItem : Record<string, any> = { ...otherFields };
            if(item.tags_aggregate && typeof item.tags_aggregate === "object"){
              Object.entries(item.tags_aggregate).forEach(([key, value]) => {
                resultItem[key] = value;
              });
            }
            results.push(resultItem);
          });
          setMetrics(results);
        }
    }, [responseBody]);

  return (
    <Stack>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ minWidth: 275 }}>
        <Card variant="outlined">{card}</Card>
      </Box>
    </Stack>
    
  );
}
