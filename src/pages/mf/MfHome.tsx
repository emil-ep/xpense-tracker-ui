import { Card, CardContent, createTheme, CssBaseline, Grid, Stack, Typography, ThemeProvider } from "@mui/material";

import './mfHome.css'
import { MutualFundSearchResponse } from "../../api/ApiResponses";
import { useApi } from "../../api/hook/useApi";
import { searchMutualFundApi } from "../../api/mutualFundApi";
import { useCallback } from "react";


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

    const fetchMutualFunds = useCallback(() => {
        return searchMutualFundApi(1, 20, '');
    }, []);

    const {responseBody, loading } = useApi<MutualFundSearchResponse>(fetchMutualFunds, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack spacing={3} sx={{ p: 3, mt: 8 }}>
                <Grid container spacing={3}>
                  {Object.entries(responseBody?.data?.content || {})
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
                            }}>
                            <CardContent>
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                  {name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {name}
                              </Typography>
                            </CardContent>
                        </Card>
                      </Grid>
                      );
                      })}
                  </Grid>
              </Stack>
        </ThemeProvider>
    )
}