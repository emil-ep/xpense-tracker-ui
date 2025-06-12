import { PieChart } from '@mui/x-charts/PieChart';
import { MetricsV2, Tag } from '../../api/ApiResponses';
import { Box, Stack, Typography } from '@mui/material';
import { CREDIT_AGGREGATE_COLOR, DEBIT_AGGREGATE_COLOR } from '../../utils/MetricUtil';

interface Metrics {
  metrics: MetricsV2[] | undefined;
  tags?: Tag[];
  loading?: boolean;
}

export default function AnalyticPieChart({ metrics, tags, loading = false }: Metrics) {
  const today = new Date();

  const metricKeys: string[] = Array.from(
    new Set(metrics?.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe')))
  );

  function generateRandomHexColor(metricKey: string): string {
    if (metricKey === 'credit_aggregate') return CREDIT_AGGREGATE_COLOR;
    if (metricKey === 'debit_aggregate') return DEBIT_AGGREGATE_COLOR;
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  }

  const data = metricKeys.map(metricKey => {
    //@ts-expect-error
    const total = metrics?.reduce((acc, metric) => acc + Math.abs(metric[metricKey] || 0), 0) ?? 0;
    const matchingTag = tags?.find(tag => tag.name === metricKey);
    const color = matchingTag?.color || generateRandomHexColor(metricKey);
    const label = metricKey.replace('_aggregate', '').toUpperCase();

    return {
      id: metricKey,
      value: total,
      label,
      color,
    };
  });

  return (
    <Box sx={{ width: '100%', position: 'relative', minHeight: 300 }}>
      <Stack direction="row" spacing={4} alignItems="center" justifyContent="center">
        <PieChart
          series={[
            {
              data: data,
              innerRadius: 40,
              outerRadius: 100,
              paddingAngle: 3,
              cornerRadius: 3,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { additionalRadius: -10, color: 'gray' },
            },
          ]}
          width={300}
          height={300}
          colors={data.map(d => d.color)}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          legend={{ hidden: true }}
          loading={loading}
        />

        {/* Custom Legend */}
        <Stack spacing={1}>
          {data.map(item => (
            <Stack key={item.id} direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
              <Typography variant="body2">
                {item.label}: ₹{item.value.toLocaleString()}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
