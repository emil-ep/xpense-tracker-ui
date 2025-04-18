import { createTheme, CssBaseline, OutlinedInput, Select, ThemeProvider } from "@mui/material";


export default function CustomAnalyticCard() {
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
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Select
                labelId="metric-select-label"
                multiple
                value={[1, 2, 3]}
                input={<OutlinedInput label="Select Options" />}
                >

            </Select>
        </ThemeProvider>
    );
}