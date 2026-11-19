
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2, Tag } from '../../api/ApiResponses';
import { Box } from '@mui/material';
import { findCurrency } from '../../utils/CurrencyUtil';
import CompactChartAxisTooltip from './CompactChartAxisTooltip';

interface Metrics {
  metrics: MetricsV2[] | undefined;
  tags?: Tag[];
  loading?: boolean;
  showLegend?: boolean;
  tagLimit?: number | null;
}

export default function AnalyticBarChart({metrics, tags, loading = false, showLegend = true, tagLimit = 4} : Metrics) {
  const rows = metrics ?? [];
  const knownMetrics = ['credit_aggregate', 'debit_aggregate', 'expense_aggregate'];
  const allKeys = Array.from(new Set(rows.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe'))));
  const fixedKeys = knownMetrics.filter(key => allKeys.includes(key));
  const tagKeys = allKeys.filter(key => !knownMetrics.includes(key));
  const rankedTags = tagKeys
    .map(key => ({ key, total: rows.reduce((sum, row) => {
      const value = Number((row as unknown as Record<string, unknown>)[key]);
      return sum + (Number.isFinite(value) ? Math.abs(value) : 0);
    }, 0) }))
    .sort((first, second) => second.total - first.total);
  const visibleTagKeys = (tagLimit === null ? rankedTags : rankedTags.slice(0, tagLimit)).map(item => item.key);
  const hiddenTagKeys = tagLimit === null ? [] : rankedTags.slice(tagLimit).map(item => item.key);
  const metricKeys = [...fixedKeys, ...visibleTagKeys, ...(hiddenTagKeys.length ? ['other_tags'] : [])];

  function generateRandomHexColor(metricKey: string): string {
    if (metricKey === 'credit_aggregate') return '#8fb9a0';
    if (metricKey === 'debit_aggregate') return '#df987e';
    if (metricKey === 'expense_aggregate') return '#5267a2';
    const palette = ['#78a88d', '#9995bf', '#d2a36f', '#83a9b8'];
    const hash = Array.from(metricKey).reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return palette[hash % palette.length];
  }

    // Create series data for each metric
  const series = metricKeys.map(metricKey => {
    const matchingTag = tags?.find(tag => tag.name === metricKey);
    const color = matchingTag?.color || generateRandomHexColor(metricKey);
    const values = rows.map(row => {
      if (metricKey === 'other_tags') {
        return hiddenTagKeys.reduce((sum, key) => {
          const value = Number((row as unknown as Record<string, unknown>)[key]);
          return sum + (Number.isFinite(value) ? Math.abs(value) : 0);
        }, 0);
      }
      const value = Number((row as unknown as Record<string, unknown>)[metricKey]);
      return Number.isFinite(value) ? Math.abs(value) : 0;
    });
    const labels: Record<string, string> = {
      credit_aggregate: 'Money in',
      debit_aggregate: 'Money out',
      expense_aggregate: 'Net expenses',
      other_tags: 'Other tags',
    };
    const data = {
      data: values,
      label: `${labels[metricKey] ?? metricKey} (${findCurrency(window.tracker?.userCurrency ?? 'USD')})`,
      color,
    }
    return data;
  });
  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
      }}
        >
      <BarChart
        xAxis={[{ scaleType: 'band', data: metrics?.map(metric => metric.timeframe) }]}
        yAxis={[{
          valueFormatter: (value) => `${findCurrency(window.tracker?.userCurrency ?? '')} ${value.toLocaleString()}`
        }]}
        slotProps={{
          legend: { hidden: !showLegend, position: { vertical: 'top', horizontal: 'right' } }
        }}
        tooltip={{
          slots: { axisContent: CompactChartAxisTooltip },
          slotProps: { popper: { sx: { zIndex: 1500, maxWidth: 'calc(100vw - 24px)', pointerEvents: 'auto' } } },
        }}
        series={series}
        sx={{
          paddingBlockStart: '1rem',
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: '#e7ebe7' },
          '& .MuiChartsGrid-line': { stroke: '#edf0ed' },
        }}
        height={300}
        loading={loading}
      />
        </Box>
  );
}
