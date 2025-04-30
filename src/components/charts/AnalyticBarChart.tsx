
import { BarChart } from '@mui/x-charts/BarChart';
import { MetricsV2, Tag } from '../../api/ApiResponses';
import { Box } from '@mui/material';

interface Metrics {
  metrics: MetricsV2[] | undefined;
  tags?: Tag[];
}

export default function AnalyticBarChart({metrics, tags} : Metrics) {

  if (!metrics || metrics.length === 0) {
    return <div>Loading chart data...</div>;
  }


  const metricKeys: string[] = Array.from(
    new Set(metrics.flatMap(obj => Object.keys(obj).filter(key => key !== 'timeframe')))
  );

  function generateRandomHexColor(): string {
    const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    console.log(`Generated color: ${color}`);
    return color;
  }

    // Create series data for each metric
  const series = metricKeys.map(metricKey => {
    const matchingTag = tags?.find(tag => tag.name === metricKey);
    const color = matchingTag?.color || generateRandomHexColor();

    return {
      // @ts-expect-error metrics key would be same type
      data: metrics.map(metric => metric[metricKey]),
      label: metricKey.replace('_aggregate', '').toUpperCase(),
      color,
    };
  });
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
