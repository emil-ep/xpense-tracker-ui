import { createTheme, CssBaseline, Grid2 } from "@mui/material";
import { ThemeProvider } from "styled-components";
import CustomAnalyticCard from "../../components/cards/CustomAnalyticCard";
import { useDateRange } from '../../context/DateRangeContext';
import { format } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import { useBankAccount } from '../../context/BankAccountContext';
import { Timeframe } from "../analytics/AnalyticsView";
import './customDashboard.css';
import { useApi } from "../../api/hook/useApi";
import { fetchTagsApi } from "../../api/tagApi";
import { FetchTagsResponse } from "../../api/ApiResponses";


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
    const { selectedBankAccountId } = useBankAccount();

    const fetchTags = useCallback(() => {
        if (!selectedBankAccountId) {
            return { url: '', method: 'GET' as 'GET' };
        }
        return fetchTagsApi(selectedBankAccountId);
    }, [selectedBankAccountId]);

    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, [selectedBankAccountId]);

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
                        <CustomAnalyticCard tags={tagsResponse?.data} timeframe={timeframe} bankAccountId={selectedBankAccountId}/>
                    )}
                </Grid2>
            </Grid2>
        </ThemeProvider>
    );
}