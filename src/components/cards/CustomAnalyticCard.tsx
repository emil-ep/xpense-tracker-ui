import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, FormControl, InputLabel,
  ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack,
  TextField, Typography,
} from '@mui/material';
import { Metrics, MetricAggregatioMode, findAggregationModeByValue } from '../../api/ApiRequests';
import { MetricsV2, MetricsV2Response, Tag } from '../../api/ApiResponses';
import { Timeframe } from '../../pages/analytics/AnalyticsView';
import { fetchMetricsV2 } from '../../api/metricsApi';
import { apiCaller } from '../../api/apicaller';
import AnalyticBarChart from '../charts/AnalyticBarChart';
import AnalyticPieChart from '../charts/AnalyticPieChart';
import { findCurrency } from '../../utils/CurrencyUtil';
import SouthEastRoundedIcon from '@mui/icons-material/SouthEastRounded';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import Tooltip from '@mui/material/Tooltip';

export interface CustomAnalyticCardProps {
  timeframe: Timeframe;
  tags?: Tag[];
  bankAccountId: string;
}

const metricOptions: { value: Metrics; label: string }[] = [
  { value: 'credit_aggregate', label: 'Money in' },
  { value: 'debit_aggregate', label: 'Money out' },
  { value: 'expense_aggregate', label: 'Net expenses' },
  { value: 'tags_aggregate', label: 'Activity by tag' },
];
const aggregationModes: MetricAggregatioMode[] = ['daily', 'weekly', 'monthly', 'yearly'];
const emptyMetrics: MetricsV2[] = [];
const systemTags: Tag[] = [
  { id: 'untagged-credit', name: 'UnTagged Credit', color: '#8fb9a0', tagType: 'credit', keywords: [], category: { id: 'untagged', name: 'UnTagged', expense: false }, editable: false },
  { id: 'untagged-debit', name: 'UnTagged Debit', color: '#df987e', tagType: 'debit', keywords: [], category: { id: 'untagged', name: 'UnTagged', expense: true }, editable: false },
];

export default function CustomAnalyticCard({ tags, timeframe, bankAccountId }: CustomAnalyticCardProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<Metrics[]>(['credit_aggregate', 'debit_aggregate']);
  const [aggregationMode, setAggregationMode] = useState<MetricAggregatioMode>('monthly');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSelectionInitialized, setTagSelectionInitialized] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const [metricsResponse, setMetricsResponse] = useState<MetricsV2Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const availableTags = useMemo(() => [...(tags ?? []), ...systemTags], [tags]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    apiCaller<MetricsV2Response>(fetchMetricsV2(aggregationMode, selectedMetrics, timeframe, bankAccountId))
      .then((response) => {
        if (active) setMetricsResponse(response);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [aggregationMode, selectedMetrics, timeframe, bankAccountId]);

  const chartMetrics = useMemo(() => (metricsResponse?.data ?? emptyMetrics).map(item => {
    const { tags_aggregate, ...otherFields } = item;
    const tagValues = (tags_aggregate ?? {}) as Record<string, number>;
    const filtered = Object.fromEntries(Object.entries(tagValues).filter(([name]) => selectedTags.includes(name)));
    return { ...otherFields, ...filtered };
  }), [metricsResponse, selectedTags]);

  const tagTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    (metricsResponse?.data ?? []).forEach(item => {
      Object.entries((item.tags_aggregate ?? {}) as Record<string, number>).forEach(([name, value]) => {
        totals[name] = (totals[name] ?? 0) + Math.abs(Number(value) || 0);
      });
    });
    return Object.entries(totals).sort((first, second) => second[1] - first[1]);
  }, [metricsResponse]);
  const totalTagValue = tagTotals.reduce((sum, [, value]) => sum + value, 0);
  const filteredTagTotals = tagTotals.filter(([name]) => name.toLowerCase().includes(tagSearch.trim().toLowerCase()));

  useEffect(() => {
    if (selectedMetrics.includes('tags_aggregate') && metricsResponse && !tagSelectionInitialized) {
      setSelectedTags(tagTotals.map(([name]) => name));
      setTagSelectionInitialized(true);
    }
  }, [selectedMetrics, metricsResponse, tagSelectionInitialized, tagTotals]);

  const handleMetricsChange = (event: SelectChangeEvent<Metrics[]>) => {
    const value = event.target.value;
    const nextMetrics = typeof value === 'string' ? value.split(',') as Metrics[] : value;
    setSelectedMetrics(nextMetrics);
    if (!nextMetrics.includes('tags_aggregate')) {
      setSelectedTags([]);
      setTagSelectionInitialized(false);
    } else if (!selectedMetrics.includes('tags_aggregate')) {
      setSelectedTags([]);
      setTagSelectionInitialized(false);
    }
  };
  const toggleTag = (tagName: string) => {
    setSelectedTags(current => current.includes(tagName)
      ? current.filter(name => name !== tagName)
      : [...current, tagName]);
  };
  const handleAggregationChange = (event: SelectChangeEvent) => {
    setAggregationMode(findAggregationModeByValue(event.target.value));
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 2.5 }}>
          <Box><Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720, letterSpacing: '-.02em' }}>Shape your analysis</Typography><Typography variant="body2" sx={{ color: '#849087', mt: .4 }}>Pick a combination and compare it across time.</Typography></Box>
          <Typography variant="caption" sx={{ color: '#7f8c83', bgcolor: '#f3f6f2', px: 1.5, py: .75, borderRadius: 2, alignSelf: { xs: 'flex-start', md: 'center' } }}>Updates automatically</Typography>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="metric-select-label">Metrics</InputLabel>
            <Select<Metrics[]> labelId="metric-select-label" multiple value={selectedMetrics} onChange={handleMetricsChange} input={<OutlinedInput label="Metrics" />} renderValue={selected => selected.map(value => metricOptions.find(option => option.value === value)?.label ?? value).join(', ')}>
              {metricOptions.map(option => <MenuItem key={option.value} value={option.value}><Checkbox checked={selectedMetrics.includes(option.value)} sx={{ color: '#9eaca1', '&.Mui-checked': { color: '#43815b' } }} /><ListItemText primary={option.label} /></MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel id="aggregation-select-label">Group by</InputLabel>
            <Select labelId="aggregation-select-label" value={aggregationMode} onChange={handleAggregationChange} input={<OutlinedInput label="Group by" />}>
              {aggregationModes.map(mode => <MenuItem key={mode} value={mode}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        {!selectedMetrics.length && <Alert severity="info" sx={{ mb: 2 }}>Select at least one metric to build a chart.</Alert>}
        {error && <Alert severity="warning" sx={{ mb: 2 }}>Could not load this combination. Try changing the filters.</Alert>}
        {selectedMetrics.includes('tags_aggregate') && <Box sx={{ border: '1px solid #e8ece7', borderRadius: 3, p: { xs: 1.5, md: 2 }, mb: 2, bgcolor: '#fff' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5} sx={{ mb: 1.5 }}>
            <Box><Typography variant="subtitle1" sx={{ color: '#203b30', fontWeight: 720 }}>Tag explorer</Typography><Typography variant="caption" sx={{ color: '#849087' }}>Choose any tags to compare. Every selected tag appears in the charts.</Typography></Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button size="small" onClick={() => setSelectedTags(tagTotals.map(([name]) => name))} sx={{ color: '#28634c', textTransform: 'none' }}>Select all</Button>
              <Button size="small" onClick={() => setSelectedTags([])} sx={{ color: '#718078', textTransform: 'none' }}>Select none</Button>
              <TextField size="small" value={tagSearch} onChange={event => setTagSearch(event.target.value)} placeholder="Find a tag" inputProps={{ 'aria-label': 'Search tags' }} sx={{ width: { xs: '100%', sm: 210 }, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </Stack>
          </Stack>
          <Stack spacing={.5} sx={{ maxHeight: 360, overflowY: 'auto', pr: .5 }}>
            {filteredTagTotals.map(([name, value]) => {
              const tag = availableTags.find(item => item.name === name);
              const selected = selectedTags.includes(name);
              const share = totalTagValue ? Math.round(value / totalTagValue * 100) : 0;
              return <Stack key={name} direction="row" alignItems="center" spacing={1} onClick={() => toggleTag(name)} sx={{ minHeight: 44, px: 1, borderRadius: 2, cursor: 'pointer', bgcolor: selected ? '#eff5f0' : 'transparent', '&:hover': { bgcolor: selected ? '#eff5f0' : '#f7f9f6' } }}>
                <Checkbox size="small" checked={selected} sx={{ p: .5, color: '#aab5ac', '&.Mui-checked': { color: '#43815b' } }} />
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: tag?.color || (() => {
                  const palette = ['#78a88d', '#9995bf', '#d2a36f', '#83a9b8'];
                  return palette[Array.from(name).reduce((sum, character) => sum + character.charCodeAt(0), 0) % palette.length];
                })(), flexShrink: 0 }} />
                <Typography variant="body2" noWrap sx={{ flex: 1, color: '#405147', fontWeight: selected ? 650 : 500 }}>{name}</Typography>
                <Tooltip title={tag?.category?.expense ? 'Expense tag' : 'Non-expense tag'} arrow>
                  <Stack direction="row" alignItems="center" spacing={.25} aria-label={`${share}% ${tag?.category?.expense ? 'expense' : 'non-expense'}`} sx={{ color: tag?.category?.expense ? '#c65353' : '#43815b', minWidth: 54, justifyContent: 'flex-end' }}>
                    {tag?.category?.expense
                      ? <SouthEastRoundedIcon sx={{ fontSize: 16 }} />
                      : <NorthEastRoundedIcon sx={{ fontSize: 16 }} />}
                    <Typography variant="caption" sx={{ color: 'inherit', textAlign: 'right' }}>{share}%</Typography>
                  </Stack>
                </Tooltip>
                <Typography variant="body2" sx={{ color: '#35483d', fontWeight: 650, minWidth: 100, textAlign: 'right' }}>{`${findCurrency(window.tracker?.userCurrency ?? '')} ${value.toLocaleString()}`}</Typography>
              </Stack>;
            })}
            {!filteredTagTotals.length && <Typography variant="body2" sx={{ color: '#849087', p: 2, textAlign: 'center' }}>No matching tags.</Typography>}
          </Stack>
        </Box>}
        <Box sx={{ borderRadius: 3, bgcolor: '#fbfcfa', border: '1px solid #f0f2ef', p: { xs: 1, md: 1.5 }, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ color: '#526157', fontWeight: 700, px: 1, pt: .5 }}>Trend over time</Typography>
          <AnalyticBarChart metrics={chartMetrics} tags={availableTags} loading={loading} tagLimit={null} showLegend={!selectedMetrics.includes('tags_aggregate')} />
        </Box>
        {selectedMetrics.length > 0 && <Box sx={{ borderRadius: 3, bgcolor: '#fbfcfa', border: '1px solid #f0f2ef', p: { xs: 1, md: 1.5 } }}>
          <Typography variant="subtitle2" sx={{ color: '#526157', fontWeight: 700, px: 1, pt: .5 }}>Share of selected activity</Typography>
          <AnalyticPieChart metrics={chartMetrics} tags={availableTags} loading={loading} />
        </Box>}
      </CardContent>
    </Card>
  );
}
