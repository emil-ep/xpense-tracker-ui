
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2 } from '../../api/ApiResponses';
import { Box } from '@mui/material';

interface Metrics {
  metrics: MetricsV2[];
}

export default function AnalyticBarChart({metrics} : Metrics) {

  if (!metrics || metrics.length === 0) {
    // Return null or a loader/message if metrics is not available
    return <div>Loading chart data...</div>;
  }


  const metricKeys: string[] = Object.keys(metrics[0]).filter(key => key !== 'timeframe');

    // Create series data for each metric
    const series = metricKeys.map(metricKey => ({
      //@ts-expect-error metrics key would be same type
        data: metrics.map(metric=> metric[metricKey]),
        label: metricKey.replace('_aggregate', '').toUpperCase(), // Label formatting
    }));
  return (
    <Box
      sx={{
        width: "100%", // Ensure the chart takes full width of its parent
        height: 300, // Set height explicitly
      }}
    >
      <BarChart
      xAxis={[{ scaleType: 'band', data: metrics?.map(metric => metric.timeframe) }]}
      series={series}
      height={300}
    />
    </Box>
  );
}
