import { Box, Chip, createTheme, CssBaseline, FormControl, InputLabel, MenuItem, OutlinedInput, Select, ThemeProvider, Typography } from "@mui/material";
import { useState } from "react";

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

const currencies = ['USD', 'EUR', 'INR', 'JPY', 'GBP'];
const allTags = ['Travel', 'Groceries', 'Rent', 'Utilities', 'Savings'];

export default function Settings() {
    
    const [currency, setCurrency] = useState('USD');
    const [savingsTags, setSavingsTags] = useState<string[]>([]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box p={4} maxWidth={600}>
                <Typography variant="h5" mb={4}>
                    Settings
                </Typography>

                {/* Currency Select */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select your currency</InputLabel>
                    <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    label="Select your currency"
                    >
                    {currencies.map((cur) => (
                        <MenuItem key={cur} value={cur}>
                        {cur}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                {/* Savings Tag Multi-Select */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Select your savings tags</InputLabel>
                    <Select
                    multiple
                    value={savingsTags}
                    onChange={(e) => setSavingsTags(e.target.value as string[])}
                    input={<OutlinedInput label="Select your savings tags" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((tag) => (
                            <Chip key={tag} label={tag} />
                        ))}
                        </Box>
                    )}
                    >
                    {allTags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                        {tag}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Box>
        </ThemeProvider>
    )
}