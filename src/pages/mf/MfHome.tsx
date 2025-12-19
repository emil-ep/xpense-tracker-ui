import { Card, 
  CardContent, 
  createTheme, 
  CssBaseline, 
  Grid, 
  Stack, 
  Typography, 
  ThemeProvider, 
  TextField, 
  Pagination} 
  from "@mui/material";

import './mfHome.css'
import { MutualFundSearchResponse } from "../../api/ApiResponses";
import { useApi } from "../../api/hook/useApi";
import { searchMutualFundApi } from "../../api/mutualFundApi";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";


export default function MfHome(){

  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  
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
    //A debounced function to handle search input, to reduce API calls
    const debouncedSetSearch = useCallback(
      debounce((value: string) => {
        setSearch(value);
      }, 400),
      []
    );

    const fetchMutualFunds = useCallback(() => {
        return searchMutualFundApi(page, 20, search);
    }, [search, page]);

    const {responseBody, loading } = useApi<MutualFundSearchResponse>(fetchMutualFunds);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack spacing={3} sx={{ p: 3, mt: 8 }} alignItems="center">
                <TextField 
                  fullWidth
                  label="Search Mutual Funds"
                  variant="outlined"
                  sx={{mb: 2}}
                  onChange={(e) => debouncedSetSearch(e.target.value)}
                />
                <Grid container rowSpacing={2}>
                  {Object.entries(responseBody?.data?.content || {})
                .map(([key, { code, name }]) => {
                    return (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                        <Card
                            sx={{
                                minWidth: 250,
                                maxHeight: 150,
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
                              <Typography variant="h6" fontWeight="bold" color="primary" noWrap={true}>
                                  {name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap={true} sx={{ mb: 1 }}>
                                  {name}
                              </Typography>
                            </CardContent>
                        </Card>
                      </Grid>
                      );
                      })}
                  </Grid>
                  <Pagination count={responseBody?.data?.totalPages} onChange={handlePageChange}/>
              </Stack>
        </ThemeProvider>
    )
}