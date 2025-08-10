import { Box, Button, Chip, createTheme, CssBaseline, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { fetchTagsApi } from "../../api/tagApi";
import { useApi } from "../../api/hook/useApi";
import { FetchTagsResponse, FetchUserSettingsResponse, Tag } from "../../api/ApiResponses";
import { fetchUserSettingsApi, updateUserSettingsApi } from "../../api/userSettingsApi";
import { apiCaller } from "../../api/apicaller";
import { showToast } from "../../utils/ToastUtil";

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

export default function Settings() {
    
    const [currency, setCurrency] = useState('');
    const [savingsTags, setSavingsTags] = useState<string[]>([]);
    const [tagData, setTagData] = useState<Tag[]>([]);
    const fetchTags = useCallback(() => fetchTagsApi(), []);
    const fetchUserSettings = useCallback(() => fetchUserSettingsApi(), []);
    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, []);
    const { responseBody: userSettingsResponse } = useApi<FetchUserSettingsResponse>(fetchUserSettings, []);

    useEffect(() => {
        if(tagsResponse && tagsResponse.data){
            setTagData(tagsResponse.data);
        }    
    }, [tagsResponse]);

    useEffect(() => {
        if(userSettingsResponse && userSettingsResponse.data) {
            const currencySetting = userSettingsResponse.data.find(item => item.type === 'CURRENCY');
            if (currencySetting) {
                setCurrency(currencySetting.payload.userCurrency);
            }
            const savingsTagSetting = userSettingsResponse.data.find(item => item.type === 'SAVINGS_TAGS');
            if (savingsTagSetting) {
                setSavingsTags(savingsTagSetting.payload.tags || []);
            }
        }

    }, [userSettingsResponse]);

    const handleSavingsTagsChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setSavingsTags(typeof value === 'string' ? value.split(',') : value as string[]);
    }


    const saveValue = async () => {
        const reqBody = {
            items: [
                { type: 'currency', payload: { userCurrency: currency } },
                { type: 'savingsTags', payload: { tags: savingsTags } }
            ]
        };
        const createTagResponse: any = await apiCaller(updateUserSettingsApi(reqBody));
        if(createTagResponse.status === 1){
            showToast("Settings saved successfully");
        }else{
            showToast("Failed to save settings");
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box p={4} maxWidth={600} display={'flex'} flexDirection='column'>
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
                        onChange={(e) => handleSavingsTagsChange(e)}
                        input={<OutlinedInput label="Select your savings tags" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((tag: string) => (
                                <Chip key={tag} label={tag} />
                            ))}
                            </Box>
                        )}
                    >
                    {tagData.map((tag) => (
                        <MenuItem key={tag.id} value={tag.name} >
                        {tag.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <Button 
                    sx={{ mt : "0.5rem", alignSelf: 'flex-end' }} 
                    variant="contained" 
                    // disabled={!edited} 
                    onClick={saveValue}
                    >
                    Save Settings
                </Button>
            </Box>
        </ThemeProvider>
    )
}