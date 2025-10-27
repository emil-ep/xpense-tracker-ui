import { Card, CardContent, createTheme, CssBaseline, Grid, Grid2, Stack, Typography } from "@mui/material";
import { ThemeProvider } from "styled-components";

import './mfHome.css'
import { MutualFundSchemeDetail } from "../../api/ApiResponses";


const items: MutualFundSchemeDetail[] = [
  {
    code: "MF001",
    category: "Equity",
    fundHouse: "ABC Mutual Funds",
    name: "ABC Equity Fund",
    type: "Open-Ended",
    payload: [
      {
        date: "2023-01-01",
        nav: "15.25"
      },
    ],
  },
  {
    code: "MF002",
    category: "Debt",
    fundHouse: "XYZ Mutual Funds",
    name: "XYZ Debt Fund",
    type: "Close-Ended",
    payload: [
      {
        date: "2023-01-01",
        nav: "10.75"
      },
    ],
  },
]

export default function MfHome(){

    const theme = createTheme({
          palette: {
            mode: 'dark',
            primary: { main: '#a0c4ff' },
            background: { 
              default: '#051e34',
              paper: 'linear-gradient(145deg, #0d1b2a, #152c3e)',  // Subtle gradient
            },
            text: {
              primary: '#ffffff',
              secondary: '#a0c4ff'
            }
          },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack className='mfContainer' spacing={3} sx={{ p: 3, mt: 8 }}>
                <div>TEST</div>
                <Grid2 container spacing={3}>
                        {Object.entries(items)
                            .map(([key, { code, name }]) => {

                                return (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Card
                                            sx={{
                                                minWidth: 250,
                                                p: 2,
                                                textAlign: "left",
                                                boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",  // Soft shadow
                                                borderRadius: "12px",
                                                background: theme.palette.background.paper,
                                                border: "1px solid rgba(255, 255, 255, 0.1)",  // Soft border
                                                mr: 2,  // Right margin
                                                transition: "transform 0.2s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.4)",
                                                }
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold" color="primary">
                                                    {name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                    {name}
                                                </Typography>
                                                {/* <Typography variant="h5" fontWeight="bold" color="text.primary">
                                                    {name !== "" ? type === 'AMOUNT' ? `${findCurrency(window.tracker?.userCurrency ?? '')} ${value}`: value : "N/A"}
                                                </Typography> */}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                    </Grid2>
            </Stack>
            
        </ThemeProvider>
    )
}