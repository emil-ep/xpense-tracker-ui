import { Box, Card, CardContent, Checkbox, createTheme, CssBaseline, ListItemText, MenuItem, OutlinedInput, Select, Stack, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";
import { MetricsV2 } from "../../api/ApiResponses";
import AnalyticBarChart from "../charts/AnalyticBarChart";


export default function CustomAnalyticCard() {

    const expenseMetrics = ['credit_aggregate', 'debit_aggregate', 'tags_aggregate'];
    const aggregationModes = ['monthly', 'weekly', 'yearly'];
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
    const [selectedAggregationModes, setSelectedAggregationModes] = useState<string[]>([]);
    const [metrics, setMetrics] = useState<MetricsV2[]>([]);

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack>
          <Box sx={{ minWidth: 275 }}>
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
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <Select
                      labelId="metric-select-label"
                      multiple
                      value={selectedMetrics}
                      input={<OutlinedInput label="Select Options" />}
                  > 
                    {expenseMetrics.map((metric) => (
                      <MenuItem key={metric} value={metric}>
                        <Checkbox checked={selectedMetrics.indexOf(metric) > -1}></Checkbox>
                        <ListItemText primary={metric} />
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                      labelId="timeframe-select-label"
                      value={aggregationModes}
                      input={<OutlinedInput label="Select Options" />}
                  > 
                    {aggregationModes.map((mode) => (
                      <MenuItem key={mode} value={mode}>
                        <Checkbox checked={selectedAggregationModes.indexOf(mode) > -1}></Checkbox>
                        <ListItemText primary={mode} />
                      </MenuItem>
                    ))}
                  </Select>
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