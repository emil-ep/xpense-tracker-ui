import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "styled-components";
import CustomAnalyticCard from "../../components/cards/CustomAnalyticCard";


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


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CustomAnalyticCard />
        </ThemeProvider>
    );
}