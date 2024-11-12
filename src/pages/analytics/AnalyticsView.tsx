import React from 'react'
import './analyticsView.css'
import { Box, createTheme, CssBaseline, Grid2, Paper, ThemeProvider } from '@mui/material'
import AnalyticCard from '../../components/cards/AnalyticCard';


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

export const AnalyticsView = () => {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1}}>
                <Grid2 className="gridContainer" container spacing={2}>
                    <Grid2 size={8}>
                        <AnalyticCard />
                    </Grid2>
                    <Grid2 size={4}>
                        <AnalyticCard />
                    </Grid2>
                    <Grid2 size={4}>
                        <AnalyticCard />
                    </Grid2>
                    <Grid2 size={8}>
                        <AnalyticCard />
                    </Grid2>
                </Grid2>
            </Box>
        </ThemeProvider>
    )
}