import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import DatePickerMenu from "./DatePickerMenu";
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import { apiCaller } from "../api/apicaller";
import { fetchSyncStatus, syncExpense } from "../api/expensesApi";
import { showToast } from "../utils/ToastUtil";
import { useApi } from "../api/hook/useApi";
import { FetchUserSettingsResponse } from "../api/ApiResponses";
import { fetchUserSettingsApi } from "../api/userSettingsApi";
import { fetchUserBankAccountsApi } from "../api/userBankAccountApi";
import { useBankAccount } from "../context/BankAccountContext";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fetchUserSettings = useCallback(() => fetchUserSettingsApi(), []);
  const { responseBody: userSettingsResponse } = useApi<FetchUserSettingsResponse>(fetchUserSettings, []);
  const { 
          responseBody : userBankAccountResponse, 
          error: userBankAccountError 
      } = useApi<any>(fetchUserBankAccountsApi, []);
  const { selectedBankAccountId, setSelectedBankAccountId } = useBankAccount();

  
   useEffect(() => {
          if (userBankAccountResponse?.data?.length > 0 &&
              (!selectedBankAccountId || !userBankAccountResponse.data.some((account: any) => account.id === selectedBankAccountId))) {
              setSelectedBankAccountId(userBankAccountResponse.data[0].id);
          }
          if (userBankAccountError) {
              showToast("Fetching user bank accounts failed");
          }
      }, [userBankAccountResponse, userBankAccountError, selectedBankAccountId, setSelectedBankAccountId]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSyncClick = async () => {
    if (!selectedBankAccountId) {
      showToast("Please select a bank account before syncing.");
      return;
    }
    setIsSyncing(true);
    try{
      const syncExpenseResponse: any = await apiCaller(syncExpense(selectedBankAccountId));
      if(syncExpenseResponse.status === 0){
        showToast("Sync Failed");
        setIsSyncing(false);
      }else {
        showToast("Sync started, refresh after 10 seconds");
        pollSyncStatus(syncExpenseResponse.data.requestId);
      }
    }catch(err){
      showToast("Sync failed");
      setIsSyncing(false);
    }
  }

  const pollSyncStatus = (requestId: string) => {
    const intervalId = setInterval(async () => {
      try{
        const syncStatusResponse: any = await apiCaller(fetchSyncStatus(requestId));
        if(syncStatusResponse.status === 1){
          const syncStatus = syncStatusResponse.data.status;
          if(syncStatus === 'COMPLETED'){
            clearInterval(intervalId);
            showToast("Sync completed");
            setIsSyncing(false);
          }
        }else{
          clearInterval(intervalId);
          showToast("Sync failed");
          setIsSyncing(false);
        }
      }catch(err){
        clearInterval(intervalId);
        showToast("Sync failed");
        setIsSyncing(false);
      }
    }, 3000);
  }

  useEffect(() => {
    (window as any).tracker = (window as any).tracker ?? {};

    if (userSettingsResponse && userSettingsResponse.data) {
      const currencySetting = userSettingsResponse.data.find(item => item.type === 'CURRENCY');
      if (currencySetting) {
        (window as any).tracker.userCurrency = currencySetting.payload.userCurrency;
      }

      const savingsTagSetting = userSettingsResponse.data.find(item => item.type === 'SAVINGS_TAGS');
      if (savingsTagSetting) {
        (window as any).tracker.savingsTags = savingsTagSetting.payload.tags || [];
      }

      const usernameSetting = userSettingsResponse.data.find(item => item.type === 'USERNAME');
      if (usernameSetting) {
        (window as any).tracker.username = usernameSetting.payload.username || '';
      }
    }
  }, [userSettingsResponse]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1f4b3a', color: '#fff', boxShadow: '0 4px 18px rgba(24, 56, 45, .16)' }}>
        <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, gap: { xs: .75, md: 1.5 }, px: { xs: 1.5, md: 3 } }}>
          <IconButton
            edge="start"
            aria-label="open navigation"
            onClick={toggleDrawer}
            sx={{ color: '#fff', borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.1)' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: { sm: 145, md: 220 }, flexGrow: 1 }}>
            <Typography variant="subtitle1" component="div" sx={{ color: '#fff', fontWeight: 750, lineHeight: 1.2, letterSpacing: '-.02em' }}>Xpense Tracker</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>Your finances, in view</Typography>
          </Box>
          <FormControl variant="outlined" size="small" sx={{ minWidth: { xs: 145, sm: 205, md: 245 }, maxWidth: 300, flexGrow: { xs: 1, sm: 0 }, '& .MuiOutlinedInput-root': { bgcolor: '#f7f9f6', borderRadius: 2, color: '#30473a', '& fieldset': { borderColor: '#e2e9e2' }, '&:hover fieldset': { borderColor: '#a9c2ae' }, '&.Mui-focused fieldset': { borderColor: '#43815b' } } }}>
            <Select
              value={selectedBankAccountId ?? ''}
              onChange={(e) => setSelectedBankAccountId(e.target.value as string)}
              displayEmpty
              startAdornment={<AccountBalanceRoundedIcon sx={{ mr: 1, color: '#6d9077', fontSize: 19 }} />}
            >
              <MenuItem value="">
                <em style={{ color: '#849087' }}>Select account</em>
              </MenuItem>
              {userBankAccountResponse?.data?.map((account: any) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}{account.accountNumber ? ` - ${account.accountNumber}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            aria-label="sync"
            startIcon={<SyncRoundedIcon sx={{ animation: isSyncing ? 'toolbarSync 1s linear infinite' : 'none', '@keyframes toolbarSync': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />}
            onClick={handleSyncClick}
            sx={{ minWidth: { xs: 42, sm: 90 }, px: { xs: 1, sm: 1.5 }, borderRadius: 2, borderColor: 'rgba(255,255,255,.42)', color: '#fff', textTransform: 'none', fontWeight: 650, '&:hover': { bgcolor: 'rgba(255,255,255,.1)', borderColor: 'rgba(255,255,255,.75)' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{isSyncing ? 'Syncing' : 'Sync'}</Box>
          </Button>
          <DatePickerMenu />
        </Toolbar>
      </AppBar>
      <NavigationDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      {userSettingsResponse && 
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {children}
      </Box> }
    </Box>
  );
};

export default AppLayout;
