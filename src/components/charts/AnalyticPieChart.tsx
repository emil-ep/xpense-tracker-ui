import { PieChart } from '@mui/x-charts/PieChart';
import { MetricsV2, Tag } from '../../api/ApiResponses';
import { Box, Stack, Typography } from '@mui/material';
import { CREDIT_AGGREGATE_COLOR, DEBIT_AGGREGATE_COLOR } from '../../utils/MetricUtil';
import { findCurrency } from '../../utils/CurrencyUtil';

interface Metrics {
  metrics: MetricsV2[] | undefined;
  tags?: Tag[];
  loading?: boolean;
}

export default function AnalyticPieChart({ metrics, tags, loading = false }: Metrics) {
  const metricKeys: string[] = Array.from(
    new Set(metrics?.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe')))
  );

  function generateRandomHexColor(metricKey: string): string {
    if (metricKey === 'credit_aggregate') return CREDIT_AGGREGATE_COLOR;
    if (metricKey === 'debit_aggregate') return DEBIT_AGGREGATE_COLOR;
    const palette = ['#78a88d', '#9995bf', '#d2a36f', '#83a9b8'];
    const hash = Array.from(metricKey).reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return palette[hash % palette.length];
  }

  const allData = metricKeys.map(metricKey => {
    //@ts-expect-error
    const total = metrics?.reduce((acc, metric) => acc + metric[metricKey] || 0, 0) || 0;
    const matchingTag = tags?.find(tag => tag.name === metricKey);
    const color = matchingTag?.color || generateRandomHexColor(metricKey);
    const label = metricKey.replace('_aggregate', '').toUpperCase();
    return {
      id: metricKey,
      value: Math.abs(total) || 0, 
      label,
      color,
    };
  });
  const visibleData = [...allData].sort((first, second) => second.value - first.value);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 2 }} alignItems="center" justifyContent="center">
        <PieChart
          series={[
            {
              data: visibleData,
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
          colors={visibleData.map(d => d.color)}
          margin={{ top: 4, bottom: 4, left: 4, right: 4 }}
          legend={{ hidden: true }}
          loading={loading}
        />

        {/* Custom Legend */}
        <Stack spacing={.75} sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 230 }, maxHeight: { xs: 180, md: 260 }, overflowY: 'auto', pr: 1 }}>
          {visibleData.map(item => (
            <Stack key={item.id} direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 10, height: 10, flexShrink: 0, bgcolor: item.color, borderRadius: '50%' }} />
              <Typography variant="caption" noWrap sx={{ color: '#526157' }}>
                {item.label}: {findCurrency(window.tracker?.userCurrency ?? '')} {item.value.toLocaleString()}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
