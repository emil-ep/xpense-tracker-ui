
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2 } from '../../api/ApiResponses';
import { Box } from '@mui/material';

interface Metrics {
  metrics: MetricsV2[] | undefined;
}

export default function AnalyticBarChart({metrics} : Metrics) {

  if (!metrics || metrics.length === 0) {
    return <div>Loading chart data...</div>;
  }


  const metricKeys: string[] = Array.from(
    new Set(metrics.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe')))
  );


    // Create series data for each metric
    const series = metricKeys.map(metricKey => ({
      //@ts-expect-error metrics key would be same type
        data: metrics.map(metric=> metric[metricKey]),
        label: metricKey.replace('_aggregate', '').toUpperCase(), // Label formatting
    }));
  return (
    <Box
      sx={{
        width: "100%",// Ensure the chart takes full width of its parent
        height: 300,
      }}
    >
      <BarChart
        xAxis={[{ scaleType: 'band', data: metrics?.map(metric => metric.timeframe) }]}
        series={series}
        sx={{
          paddingBlockStart: "1rem"
        }}
        height={300}
      />
    </Box>
  );
}
