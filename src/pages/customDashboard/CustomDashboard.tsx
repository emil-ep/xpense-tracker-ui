import { createTheme, CssBaseline, Grid2 } from "@mui/material";
import { ThemeProvider } from "styled-components";
import CustomAnalyticCard from "../../components/cards/CustomAnalyticCard";
import { useDateRange } from '../../context/DateRangeContext';
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Timeframe } from "../analytics/AnalyticsView";
import './customDashboard.css';


export default function CustomDashboard() {

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
    const [timeframe, setTimeframe] = useState<Timeframe | null>(null);

    const { fromDate, toDate } = useDateRange();

    useEffect(() => {
        if (fromDate && toDate) {
            // Fetch analytics data based on the new date range
            const newTimeframe = {
                fromDate: format(fromDate, "dd/MM/yy"),
                toDate: format(toDate, "dd/MM/yy")
            }
            setTimeframe(newTimeframe);
        }
    }, [fromDate, toDate]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid2 className="gridContainer" container spacing={2}>
                <Grid2 size={12}>
                    {timeframe && (
                        <CustomAnalyticCard timeframe={timeframe}/>
                    )}
                </Grid2>
            </Grid2>
        </ThemeProvider>
    );
}