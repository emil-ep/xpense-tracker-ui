import * as React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress } from '@mui/material';
import AnalyticBarChart from '../charts/AnalyticBarChart';
import { useApi } from '../../api/hook/useApi';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { MetricAggregatioMode, Metrics } from '../../api/ApiRequests';
import { MetricsV2, MetricsV2Response, Tag } from '../../api/ApiResponses';
import { Timeframe } from '../../pages/analytics/AnalyticsView';
import { Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export interface AnalyticCardProps {
  title?: string;
  subtitle?: string;
  aggregationMode: MetricAggregatioMode;
  metricsToFetch: Metrics[];
  timeframe: Timeframe;
  tags?: Tag[];
  tooltipText?: string;
  showLegend?: boolean;
  bankAccountId: string;
}

export default function AnalyticCard({ title = '', subtitle, aggregationMode, metricsToFetch, timeframe, tags, tooltipText, showLegend, bankAccountId }: AnalyticCardProps) {
  const [metrics, setMetrics] = React.useState<MetricsV2[]>([]);
  const fetchMetrics = React.useCallback(() => {
    return fetchMetricsV2(aggregationMode, metricsToFetch, timeframe, bankAccountId);
  }, [timeframe, bankAccountId, aggregationMode, metricsToFetch]);

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
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff' }}>
      <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: 46 }}>
          <Box>
            <Typography sx={{ color: '#203b30', fontWeight: 720, letterSpacing: '-.02em' }}>{title}</Typography>
            {subtitle && <Typography variant="body2" sx={{ color: '#849087', mt: .4 }}>{subtitle}</Typography>}
          </Box>
          {tooltipText && <Tooltip title={tooltipText} arrow placement="left">
            <IconButton size="small" aria-label={`About ${title}`} sx={{ color: '#89958c' }}><InfoOutlinedIcon fontSize="small" /></IconButton>
          </Tooltip>}
        </Box>
        {loading && <LinearProgress sx={{ mt: 1, borderRadius: 2, '& .MuiLinearProgress-bar': { bgcolor: '#43815b' } }} />}
        <Box sx={{ width: '100%', mt: 1 }}>
          <AnalyticBarChart metrics={metrics} tags={tags} showLegend={showLegend} loading={loading} />
        </Box>
      </CardContent>
    </Card>
  );
}
