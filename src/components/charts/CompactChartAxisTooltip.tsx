import { Box, Paper, Stack, Typography } from '@mui/material';
import { ChartsAxisContentProps } from '@mui/x-charts/ChartsTooltip';
import { getLabel } from '@mui/x-charts/internals';

export default function CompactChartAxisTooltip(props: ChartsAxisContentProps) {
  const { series, dataIndex, axisValue, axis } = props;
  if (dataIndex == null) return null;

  const axisFormatter = axis.valueFormatter ?? (value => value.toLocaleString());
  const entries = series.filter(item => item.type === 'bar').map(item => {
    // Bar series share the selected x-axis index, so the tooltip can list each value for that period.
    const value = Number(item.data[dataIndex]);
    const formattedValue = Number.isFinite(value) ? value.toLocaleString() : '—';
    return {
      id: item.id,
      label: getLabel((item as { label?: string | ((location: 'tooltip') => string) }).label, 'tooltip') || String(item.id),
      value: formattedValue,
      color: item.getColor(dataIndex),
    };
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  const maxTooltipHeight = Math.min(window.innerHeight * 0.72, 600);
  const rowHeight = 32;
  const needsTwoColumns = entries.length * rowHeight + 62 > maxTooltipHeight && window.innerWidth >= 720;

  return (
    <Paper elevation={0} sx={{ display: 'grid', gridTemplateColumns: needsTwoColumns ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', width: needsTwoColumns ? 'min(680px, calc(100vw - 32px))' : 'min(360px, calc(100vw - 32px))', maxHeight: maxTooltipHeight, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch', touchAction: 'pan-y', borderRadius: 3, border: '1px solid #e4ebe5', bgcolor: '#fff', boxShadow: '0 16px 42px rgba(23, 48, 35, .2)' }}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1, gridColumn: '1 / -1', px: 1.75, py: 1.25, bgcolor: '#edf4ef', borderBottom: '1px solid #e4ebe5' }}>
        <Typography variant="caption" sx={{ color: '#738078', fontWeight: 650, letterSpacing: '.04em' }}>PERIOD</Typography>
        <Typography variant="subtitle2" sx={{ color: '#203b30', fontWeight: 750 }}>{axisValue == null ? '' : axisFormatter(axisValue, { location: 'tooltip' })}</Typography>
      </Box>
      <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: needsTwoColumns ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)', columnGap: 1, p: .75 }}>
        {entries.map(entry => <Stack key={entry.id} direction="row" alignItems="center" spacing={1} sx={{ minHeight: rowHeight, px: 1, borderRadius: 1.5, '&:hover': { bgcolor: '#f6f8f6' } }}>
          <Box sx={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, bgcolor: entry.color }} />
          <Typography variant="body2" noWrap sx={{ color: '#536158', flex: 1, minWidth: 0, fontSize: 13 }}>{entry.label}</Typography>
          <Typography variant="body2" sx={{ color: '#203b30', fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', fontSize: 13 }}>{entry.value}</Typography>
        </Stack>)}
      </Box>
    </Paper>
  );
}
