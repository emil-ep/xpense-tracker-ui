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

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export const card = (
  <React.Fragment>
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        Word of the Day
      </Typography>
      <AnalyticBarChart />
    </CardContent>
    <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions>
  </React.Fragment>
);

export interface AnalyticCardProps {
  aggregationMode : MetricAggregatioMode;
  metrics: Metrics[]
}

export default function AnalyticCard({aggregationMode, metrics}: AnalyticCardProps) {

  const timeframeBody = {
    fromDate: '01/11/24',
    toDate: '16/12/24'
  }

  const fetchMetrics = React.useCallback(() => {
        return fetchMetricsV2(aggregationMode, metrics, timeframeBody);
    }, []);

  const { responseBody, error } = useApi<any>(fetchMetrics, []);

  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
