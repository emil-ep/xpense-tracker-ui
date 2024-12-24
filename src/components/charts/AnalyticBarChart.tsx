import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2 } from '../../api/ApiResponses';

interface Metrics {
  metrics: MetricsV2[];
}

export default function AnalyticBarChart({metrics} : Metrics) {

  const metricKeys: string[] = Object.keys(metrics[0]).filter(key => key !== 'timeframe');

    // Create series data for each metric
    const series = metricKeys.map(metricKey => ({
      //@ts-expect-error metrics key would be same type
        data: metrics.map(metric=> metric[metricKey]),
        label: metricKey.replace('_aggregate', '').toUpperCase(), // Label formatting
    }));
  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: metrics?.map(metric => metric.timeframe) }]}
      series={series}
      width={500}
      height={300}
    />
  );
}
