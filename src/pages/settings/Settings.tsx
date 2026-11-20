import { Alert, Box, Button, Card, CardContent, Chip, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import Google from '@mui/icons-material/Google';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useCallback, useEffect, useState } from "react";
import { fetchTagCategories } from "../../api/tagApi";
import { useApi } from "../../api/hook/useApi";
import { BankAccount, FetchUserSettingsResponse, TagCategory, TagCategoryResponse, UserBankAccountResponse } from "../../api/ApiResponses";
import { fetchUserSettingsApi, updateUserSettingsApi } from "../../api/userSettingsApi";
import { apiCaller } from "../../api/apicaller";
import { showToast } from "../../utils/ToastUtil";
import { logoutApi } from "../../api/authApi";
import { fetchBankAccountTypes, fetchUserBankAccountsApi, upsertUserBankAccountApi } from "../../api/userBankAccountApi";

const currencies = ['USD', 'EUR', 'INR', 'JPY', 'GBP'];
const panelSx = { borderRadius: 4, border: '1px solid #e8ece7', boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', bgcolor: '#fff' };

export default function Settings() {
    
    const [currency, setCurrency] = useState('');
    const [savingsTags, setSavingsTags] = useState<string[]>([]);
    const [username, setUsername] = useState('');
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [editingBankAccountIndex, setEditingBankAccountIndex] = useState<number | null>(null);
    const [newBankAccountFormVisible, setNewBankAccountFormVisible] = useState(false);
    const [tempBankAccount, setTempBankAccount] = useState<BankAccount>({ name: '', accountNumber: '', type: '' });
    const [tagCateoryData, setTagCategoryData] = useState<TagCategory[]>([]);
    const [bankAccountTypes, setBankAccountTypes] = useState<string[]>([]);
    const [googleDriveStatus, setGoogleDriveStatus] = useState<string>("");
    
    
    const { responseBody: tagsCategoryResponse } = useApi<TagCategoryResponse>(fetchTagCategories, []);
    const { responseBody: bankAccountTypeResponse } = useApi<any>(fetchBankAccountTypes, []);
    const fetchUserSettings = useCallback(() => fetchUserSettingsApi(), []);
    const { responseBody: userSettingsResponse } = useApi<FetchUserSettingsResponse>(fetchUserSettings, []);
    const { responseBody: bankAccountsResponse } = useApi<UserBankAccountResponse>(fetchUserBankAccountsApi, []);


    useEffect(() => {
        if(bankAccountTypeResponse && bankAccountTypeResponse.data){
            setBankAccountTypes(bankAccountTypeResponse.data);
        }    
    }, [bankAccountTypeResponse]);

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
        const params = new URLSearchParams(window.location.search);
        const driveConnected = params.get("driveConnected");
        const driveError = params.get("driveError");

        const clearDriveStatusParams = () => {
            params.delete("driveConnected");
            params.delete("driveError");
            const query = params.toString();
            window.history.replaceState({}, document.title, `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
        };

        if (driveConnected === "true") {
            setGoogleDriveStatus("Google Drive connected successfully. Backup sync is now enabled.");
            showToast("Google Drive connected successfully");
            clearDriveStatusParams();
        } else if (driveError) {
            setGoogleDriveStatus("Google Drive connection failed. Please try again.");
            showToast("Google Drive connection failed");
            clearDriveStatusParams();
        }
    }, []);

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

        console.log("Saving bank account:", tempBankAccount);
        const upsertBankAccountResponse: any = await apiCaller(upsertUserBankAccountApi(tempBankAccount));
        if(upsertBankAccountResponse.status !== 1){
            showToast("Failed to save bank account");
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

    const handleGoogleDriveLogin = () => {
        const googleDriveAuthUrl = `${process.env.REACT_APP_API_BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin + '/settings?driveConnected=true')}`;
        window.location.href = googleDriveAuthUrl;
    }

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
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f6f3', px: { xs: 2, md: 4 }, pt: { xs: 10, md: 11 }, pb: 5, color: '#202b27' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}>
                    <SettingsRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                    <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Make it yours</Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Settings</Typography>
                <Typography variant="body2" sx={{ color: '#849087', mt: .75, mb: 3 }}>Manage your preferences, connected services, and accounts.</Typography>

                <Grid container spacing={2} alignItems="stretch">
                    <Grid item xs={12} lg={5}>
                        <Card sx={panelSx}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>Preferences</Typography>
                                <Typography variant="body2" sx={{ color: '#849087', mt: .4, mb: 2 }}>Personalize how your activity is displayed and categorized.</Typography>
                                <Stack spacing={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Display currency</InputLabel>
                                        <Select value={currency} onChange={event => setCurrency(event.target.value)} label="Display currency">
                                            {currencies.map(cur => <MenuItem key={cur} value={cur}>{cur}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Savings categories</InputLabel>
                                        <Select multiple value={savingsTags} onChange={handleSavingsTagsChange} input={<OutlinedInput label="Savings categories" />} renderValue={selected => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .5 }}>{selected.map(tag => <Chip key={tag} size="small" label={tag} sx={{ bgcolor: '#e9f1eb', color: '#426b53' }} />)}</Box>}>
                                            {tagCateoryData.map(category => <MenuItem key={category.id} value={category.name}>{category.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <TextField label="Your name" value={username} onChange={event => setUsername(event.target.value)} fullWidth />
                                    <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={saveValue} sx={{ alignSelf: 'flex-start', borderRadius: 2.5, bgcolor: '#28634c', px: 2.5, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1e503c' } }}>Save preferences</Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ ...panelSx, mt: 2 }}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}><Google sx={{ color: '#5267a2' }} /><Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>Google Drive</Typography></Stack>
                                <Typography variant="body2" sx={{ color: '#849087', mb: 2 }}>Connect Drive to keep your backup data in sync.</Typography>
                                <Button variant="outlined" startIcon={<Google />} onClick={handleGoogleDriveLogin} sx={{ borderColor: '#cbd9ce', color: '#28634c', borderRadius: 2, textTransform: 'none', fontWeight: 650 }}>Connect Google Drive</Button>
                                {googleDriveStatus && <Alert severity={googleDriveStatus.includes('failed') ? 'error' : 'success'} sx={{ mt: 2 }}>{googleDriveStatus}</Alert>}
                            </CardContent>
                        </Card>
                        <Button startIcon={<LogoutRoundedIcon />} onClick={logout} sx={{ mt: 2, color: '#a34f4f', textTransform: 'none', fontWeight: 650 }}>Log out</Button>
                    </Grid>

                    <Grid item xs={12} lg={7}>
                        <Card sx={panelSx}>
                            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Box><Stack direction="row" spacing={1} alignItems="center"><AccountBalanceRoundedIcon sx={{ color: '#43815b' }} /><Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>Bank accounts</Typography></Stack><Typography variant="body2" sx={{ color: '#849087', mt: .5 }}>Manage the accounts linked to your transactions.</Typography></Box>
                                    {!newBankAccountFormVisible && editingBankAccountIndex === null && <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={handleAddNewBankAccount} sx={{ borderColor: '#cbd9ce', color: '#28634c', borderRadius: 2, textTransform: 'none', whiteSpace: 'nowrap' }}>Add account</Button>}
                                </Stack>

                                {bankAccounts.map((account, index) => <Card key={account.id ?? index} variant="outlined" sx={{ mb: 1.5, borderColor: '#edf0ed', borderRadius: 3, boxShadow: 'none' }}>
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        {editingBankAccountIndex === index ? <BankAccountForm
                                            account={tempBankAccount}
                                            bankAccountTypes={bankAccountTypes}
                                            onChange={setTempBankAccount}
                                            onSave={handleSaveBankAccount}
                                            onCancel={handleCancelBankAccountEdit}
                                        /> : <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
                                            <Box><Typography variant="subtitle1" sx={{ color: '#30473a', fontWeight: 700 }}>{account.name}</Typography><Typography variant="body2" sx={{ color: '#718078', mt: .25 }}>{account.type} · {account.accountNumber}</Typography></Box>
                                            <Button size="small" onClick={() => handleEditBankAccount(index)} sx={{ color: '#28634c', textTransform: 'none', fontWeight: 650 }}>Edit details</Button>
                                        </Stack>}
                                    </CardContent>
                                </Card>)}
                                {bankAccounts.length === 0 && !newBankAccountFormVisible && <Typography variant="body2" sx={{ color: '#849087', py: 2 }}>No bank accounts added yet.</Typography>}
                                {newBankAccountFormVisible && <Card variant="outlined" sx={{ borderColor: '#dfe8e0', borderRadius: 3, bgcolor: '#fbfcfa', boxShadow: 'none' }}><CardContent><Typography variant="subtitle1" sx={{ color: '#30473a', fontWeight: 700, mb: 1 }}>Add a bank account</Typography><BankAccountForm account={tempBankAccount} bankAccountTypes={bankAccountTypes} onChange={setTempBankAccount} onSave={handleSaveBankAccount} onCancel={handleCancelBankAccountEdit} /></CardContent></Card>}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

function BankAccountForm({ account, bankAccountTypes, onChange, onSave, onCancel }: { account: BankAccount; bankAccountTypes: string[]; onChange: (account: BankAccount) => void; onSave: () => void; onCancel: () => void }) {
    return <Stack spacing={1.5}>
        <TextField label="Account name" value={account.name} onChange={event => onChange({ ...account, name: event.target.value })} fullWidth />
        <TextField label="Account number" value={account.accountNumber} onChange={event => onChange({ ...account, accountNumber: event.target.value })} fullWidth />
        <FormControl fullWidth><InputLabel>Account type</InputLabel><Select value={account.type} onChange={event => onChange({ ...account, type: event.target.value })} label="Account type">{bankAccountTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}</Select></FormControl>
        <Stack direction="row" spacing={1}><Button variant="contained" onClick={onSave} sx={{ bgcolor: '#28634c', textTransform: 'none', '&:hover': { bgcolor: '#1e503c' } }}>Save account</Button><Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none' }}>Cancel</Button></Stack>
    </Stack>;
}
