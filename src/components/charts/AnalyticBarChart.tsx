
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2, Tag } from '../../api/ApiResponses';
import { Box } from '@mui/material';
import { CREDIT_AGGREGATE_COLOR, DEBIT_AGGREGATE_COLOR } from '../../utils/MetricUtil';
import { findCurrency } from '../../utils/CurrencyUtil';

interface Metrics {
  metrics: MetricsV2[] | undefined;
  tags?: Tag[];
  loading?: boolean;
  showLegend?: boolean;
}

export default function AnalyticBarChart({metrics, tags, loading = false, showLegend = true} : Metrics) {

  const metricKeys: string[] = Array.from(
    new Set(metrics?.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe')))
  );

  function generateRandomHexColor(metricKey: string): string {
    if(metricKey === 'credit_aggregate'){
      return CREDIT_AGGREGATE_COLOR;
    } else if(metricKey === 'debit_aggregate') {
      return DEBIT_AGGREGATE_COLOR;
    } else{
      const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
      return color;
    }
  }

    // Create series data for each metric
  const series = metricKeys.map(metricKey => {
    const matchingTag = tags?.find(tag => tag.name === metricKey);
    const color = matchingTag?.color || generateRandomHexColor(metricKey);

    const data = {
      // @ts-expect-error metrics key would be same type
      data: metrics.map(metric => Math.abs(metric[metricKey]) || 0),
      label: `${metricKey.replace('_aggregate', '').toUpperCase()} (${findCurrency(window.tracker?.userCurrency ?? 'USD')})`,
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
          valueFormatter: (value) => `₹${value.toLocaleString()}`
        }]}
        slotProps={{
          legend: { hidden: !showLegend }
        }}
        series={series}
        sx={{
          paddingBlockStart: "1rem"
        }}
        height={300}
        loading={loading}
      />
        </Box>
  );
}
