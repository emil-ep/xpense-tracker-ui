import { 
  Box, 
  Card, 
  CardContent, 
  Checkbox, 
  createTheme, 
  CssBaseline, 
  FormControl, 
  InputLabel, 
  ListItemText, 
  MenuItem, 
  OutlinedInput, 
  Select, 
  SelectChangeEvent, 
  Stack, 
  ThemeProvider, 
  Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MetricsV2, MetricsV2Response, Tag } from "../../api/ApiResponses";
import AnalyticBarChart from "../charts/AnalyticBarChart";
import { fetchMetricsV2 } from "../../api/metricsApi";
// import { useApi } from "../../api/hook/useApi";
import { findAggregationModeByValue, MetricAggregatioMode } from "../../api/ApiRequests";
import { Timeframe } from "../../pages/analytics/AnalyticsView";
import { apiCaller } from "../../api/apicaller";
// import { set } from "date-fns";


export interface CustomAnalyticCardProps {
  timeframe: Timeframe;
  tags?: Tag[];
}

export default function CustomAnalyticCard({ tags, timeframe} : CustomAnalyticCardProps) {

  const expenseMetrics = ['credit_aggregate', 'debit_aggregate', 'tags_aggregate'];
  const aggregationModes = ['daily','monthly', 'weekly', 'yearly'];
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#669df6' },
      background: { 
        default: 'rgb(5, 30, 52)',
        paper: 'rgb(5, 30, 52)',   
      },
    },
  });

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedAggregationMode, setSelectedAggregationMode] = useState<MetricAggregatioMode>('yearly');
  const [metrics, setMetrics] = useState<MetricsV2[] | undefined>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [metricsApiResponse, setMetricsApiResponse] = useState<MetricsV2Response | null>(null);

  const onChangeMetrics = async (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newMetrics = typeof value === 'string' ? value.split(',') : (value as string[]);
    setSelectedMetrics(newMetrics);
    const responseBody: MetricsV2Response = await apiCaller(fetchMetricsV2(selectedAggregationMode, newMetrics, timeframe));
    setMetricsApiResponse(responseBody);
  };
  

  
  const onChangeAggregationMode = async (event: SelectChangeEvent) => {
    const { value } = event.target;
    const newAggregationMode = findAggregationModeByValue(value);
    setSelectedAggregationMode(newAggregationMode);
    const responseBody: MetricsV2Response = await apiCaller(fetchMetricsV2(newAggregationMode, selectedMetrics, timeframe));
    setMetricsApiResponse(responseBody);
  };

  const onChangeSelectedTags = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const newTags = typeof value === 'string' ? value.split(',') : (value as string[]);
    setSelectedTags(newTags);
    const results = metricsApiResponse?.data.map((item) => {
    const { tags_aggregate, ...otherFields } = item;
    const validTagsAggregate = tags_aggregate && typeof tags_aggregate === 'object'
      ? tags_aggregate
      : {};
    const filteredTags = Object.keys(validTagsAggregate)
      .filter((key) => newTags.includes(key))
      .reduce((acc, key) => {
        //@ts-ignore
        acc[key] = validTagsAggregate[key];
        return acc;
      }, {} as Record<string, number>);
      return { ...otherFields, ...filteredTags };
    });
    setMetrics(results);
  }

  useEffect(() => {
    if (metricsApiResponse && metricsApiResponse.data) {
      const results = metricsApiResponse.data.map((item) => {
        const { tags_aggregate, ...otherFields } = item;
        const validTagsAggregate = tags_aggregate && typeof tags_aggregate === 'object'
          ? tags_aggregate
          : {};
        const filteredTags = Object.keys(validTagsAggregate)
          .filter((key) => selectedTags.includes(key))
          .reduce((acc, key) => {
            //@ts-ignore
            acc[key] = validTagsAggregate[key];
            return acc;
          }, {} as Record<string, number>);
        return { ...otherFields, ...filteredTags };
      });
      setMetrics(results);
    }
  }, [metricsApiResponse]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack>
        <Box>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",  // Soft shadow
              borderRadius: "12px",
              background: "linear-gradient(145deg, #0d1b2a, #152c3e)", // Subtle gradient
              border: "1px solid rgba(255, 255, 255, 0.1)",  // Soft border
            }}
          >
            <CardContent>
              <Typography gutterBottom variant="h6">
                Choose categories
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Stack spacing={3} direction={"row"}>
                  <FormControl fullWidth>
                    <InputLabel id='metric-select-label'>Select Metrics</InputLabel>
                    <Select<string[]>
                      labelId="metric-select-label"
                      multiple
                      value={selectedMetrics}
                      onChange={onChangeMetrics}
                      renderValue={(selected) => selected.length > 0 ? `${selected.length} selected` : 'Select Options'}
                      input={<OutlinedInput label="Select Options" />}
                    > 
                      {expenseMetrics.map((metric) => (
                        <MenuItem key={metric} value={metric}>
                          <Checkbox checked={selectedMetrics.indexOf(metric) > -1}></Checkbox>
                          <ListItemText primary={metric} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id='aggregation-select-label'>Select Aggregation Mode</InputLabel>
                    <Select
                      labelId="timeframe-select-label"
                      value={selectedAggregationMode}
                      onChange={onChangeAggregationMode}
                      input={<OutlinedInput label="Select Options" />}
                    > 
                      {aggregationModes.map((mode) => (
                        <MenuItem key={mode} value={mode}>
                            <ListItemText primary={mode} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {selectedMetrics.includes('tags_aggregate') && (
                    <FormControl fullWidth>
                      <InputLabel id='tags-select-label'>Select Tags</InputLabel>
                      <Select
                        labelId="tags-select-label"
                        multiple
                        value={selectedTags}
                        onChange={onChangeSelectedTags}
                        renderValue={(selected) => selected.length > 0 ? `${selected.length} selected` : 'Select Options'}
                        input={<OutlinedInput label="Select Options" />}
                      > 
                        {tags?.map((tag) => (
                          <MenuItem key={tag.id} value={tag.name}>
                            <Checkbox checked={selectedTags.indexOf(tag.name) > -1}></Checkbox>
                            <ListItemText primary={tag.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}    
                </Stack>
              </Box>
              <Box sx={{ width: "100%" }}>
                  <AnalyticBarChart metrics={metrics} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}