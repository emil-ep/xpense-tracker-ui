import { Box, Button, Chip, createTheme, 
    CssBaseline, FormControl, InputLabel, 
    MenuItem, OutlinedInput, Select, 
    SelectChangeEvent, Stack, TextField, ThemeProvider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { fetchTagCategories } from "../../api/tagApi";
import { useApi } from "../../api/hook/useApi";
import { BankAccount, FetchUserSettingsResponse, TagCategory, TagCategoryResponse, UserBankAccountResponse } from "../../api/ApiResponses";
import { fetchUserSettingsApi, updateUserSettingsApi } from "../../api/userSettingsApi";
import { apiCaller } from "../../api/apicaller";
import { showToast } from "../../utils/ToastUtil";
import { logoutApi } from "../../api/authApi";
import { fetchUserBankAccountsApi } from "../../api/userBankAccountApi";

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
    const [username, setUsername] = useState('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [editingBankAccountIndex, setEditingBankAccountIndex] = useState<number | null>(null);
    const [newBankAccountFormVisible, setNewBankAccountFormVisible] = useState(false);
    const [tempBankAccount, setTempBankAccount] = useState<BankAccount>({ name: '', accountNumber: '', type: '' });
    const [tagCateoryData, setTagCategoryData] = useState<TagCategory[]>([]);
    
    
    const { responseBody: tagsCategoryResponse } = useApi<TagCategoryResponse>(fetchTagCategories, []);
    const fetchUserSettings = useCallback(() => fetchUserSettingsApi(), []);
    const { responseBody: userSettingsResponse } = useApi<FetchUserSettingsResponse>(fetchUserSettings, []);
    const { responseBody: bankAccountsResponse } = useApi<UserBankAccountResponse>(fetchUserBankAccountsApi, []);

    useEffect(() => {
        if(tagsCategoryResponse && tagsCategoryResponse.data){
            setTagCategoryData(tagsCategoryResponse.data);
        }    
    }, [tagsCategoryResponse]);

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
            const usernameSetting = userSettingsResponse.data.find(item => item.type === 'USERNAME');
            if (usernameSetting) {
                setUsername(usernameSetting.payload.username || '');
            }
        }

    }, [userSettingsResponse]);

    useEffect(() => {
        if(bankAccountsResponse && bankAccountsResponse.data) {
            setBankAccounts(bankAccountsResponse.data);
        }
    }, [bankAccountsResponse]);

    const handleSavingsTagsChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;
        setSavingsTags(typeof value === 'string' ? value.split(',') : value as string[]);
    }

    const handleEditBankAccount = (index: number) => {
        setTempBankAccount({ ...bankAccounts[index] });
        setEditingBankAccountIndex(index);
    };

    const handleCancelBankAccountEdit = () => {
        setEditingBankAccountIndex(null);
        setNewBankAccountFormVisible(false);
        setTempBankAccount({ name: '', accountNumber: '', type: '' });
    };

    const handleSaveBankAccount = async () => {
        if (!tempBankAccount.name || !tempBankAccount.accountNumber || !tempBankAccount.type) {
            showToast("Please fill all bank account fields");
            return;
        }

        if (editingBankAccountIndex !== null) {
            const updatedAccounts = [...bankAccounts];
            updatedAccounts[editingBankAccountIndex] = tempBankAccount;
            setBankAccounts(updatedAccounts);
            showToast("Bank account updated successfully");
        } else if (newBankAccountFormVisible) {
            setBankAccounts([...bankAccounts, tempBankAccount]);
            showToast("Bank account added successfully");
        }

        handleCancelBankAccountEdit();
    };

    const handleAddNewBankAccount = () => {
        setNewBankAccountFormVisible(true);
        setTempBankAccount({ name: '', accountNumber: '', type: '' });
    };

    const logout = async () => {
        const response: any = await apiCaller(logoutApi());
        if(response.status === 1){
            localStorage.removeItem("authToken");
            window.location.href = "/login";
            showToast("Logged out successfully");
        }else{
            showToast("Logout failed");
        }
    }


    const saveValue = async () => {
        const reqBody = {
            items: [
                { type: 'currency', payload: { userCurrency: currency } },
                { type: 'savingsTags', payload: { tags: savingsTags } },
                { type: 'username', payload: { username: username } }
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

                {/* User Preferences Section */}
                <Box mb={4}>
                    <Typography variant="h6" mb={2}>
                        User Preferences
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
                        {tagCateoryData.map((tagCategory) => (
                            <MenuItem key={tagCategory.id} value={tagCategory.name} selected={savingsTags.indexOf(tagCategory.name) > -1}>
                                {tagCategory.name}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField 
                        id="username" 
                        label="Username" 
                        variant="outlined" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </FormControl>
                </Box>

                {/* User Bank Account Details Section */}
                <Box mb={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                            Bank Account Details
                        </Typography>
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={handleAddNewBankAccount}
                        >
                            Add New Account
                        </Button>
                    </Box>

                    {/* Display Bank Accounts */}
                    {bankAccounts.map((account, index) => (
                        <Box key={index} mb={3} p={2} sx={{ border: '1px solid #444', borderRadius: '4px' }}>
                            {editingBankAccountIndex === index ? (
                                <Box>
                                    <TextField 
                                        fullWidth
                                        label="Name" 
                                        variant="outlined" 
                                        value={tempBankAccount.name}
                                        onChange={(e) => setTempBankAccount({ ...tempBankAccount, name: e.target.value })}
                                        margin="normal"
                                    />
                                    <TextField 
                                        fullWidth
                                        label="Account Number" 
                                        variant="outlined" 
                                        value={tempBankAccount.accountNumber}
                                        onChange={(e) => setTempBankAccount({ ...tempBankAccount, accountNumber: e.target.value })}
                                        margin="normal"
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Account Type</InputLabel>
                                        <Select
                                            value={tempBankAccount.type}
                                            onChange={(e) => setTempBankAccount({ ...tempBankAccount, type: e.target.value })}
                                            label="Account Type"
                                        >
                                        {tagCateoryData.map((tag) => (
                                            <MenuItem key={tag.id} value={tag.name}>
                                                {tag.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <Stack direction="row" spacing={1} mt={2}>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={handleSaveBankAccount}
                                        >
                                            Save
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            size="small"
                                            onClick={handleCancelBankAccountEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Box>
                            ) : (
                                <Box>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography><strong>Name:</strong> {account.name}</Typography>
                                        <Button 
                                            variant="outlined" 
                                            size="small"
                                            onClick={() => handleEditBankAccount(index)}
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                    <Typography><strong>Account Number:</strong> {account.accountNumber}</Typography>
                                    <Typography><strong>Account Type:</strong> {account.type}</Typography>
                                </Box>
                            )}
                        </Box>
                    ))}

                    {/* New Bank Account Form */}
                    {newBankAccountFormVisible && (
                        <Box p={2} sx={{ border: '1px solid #444', borderRadius: '4px' }}>
                            <TextField 
                                fullWidth
                                label="Name" 
                                variant="outlined" 
                                value={tempBankAccount.name}
                                onChange={(e) => setTempBankAccount({ ...tempBankAccount, name: e.target.value })}
                                margin="normal"
                            />
                            <TextField 
                                fullWidth
                                label="Account Number" 
                                variant="outlined" 
                                value={tempBankAccount.accountNumber}
                                onChange={(e) => setTempBankAccount({ ...tempBankAccount, accountNumber: e.target.value })}
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    value={tempBankAccount.type}
                                    onChange={(e) => setTempBankAccount({ ...tempBankAccount, type: e.target.value })}
                                    label="Account Type"
                                >
                                {tagCateoryData.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.name}>
                                        {tag.name}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button 
                                    variant="contained" 
                                    size="small"
                                    onClick={handleSaveBankAccount}
                                >
                                    Save
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={handleCancelBankAccountEdit}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    )}
                </Box>
                <Stack direction={"row"} spacing={2}>
                    <Button 
                        sx={{ mt : "0.5rem", alignSelf: 'flex-start' }} 
                        variant="contained" 
                        color="error"
                        // disabled={!edited} 
                        onClick={logout}
                        >
                        Logout
                    </Button>
                    <Button 
                        sx={{ mt : "0.5rem", alignSelf: 'flex-end' }} 
                        variant="contained" 
                        // disabled={!edited} 
                        onClick={saveValue}
                        >
                        Save Settings
                    </Button>
                </Stack>
                
            </Box>
        </ThemeProvider>
    )
}