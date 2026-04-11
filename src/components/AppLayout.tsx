import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import DatePickerMenu from "./DatePickerMenu";
import SyncIcon from '@mui/icons-material/Sync';
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
          if (userBankAccountResponse) {
              console.log("User bank accounts fetched successfully", userBankAccountResponse);
          }
          if (userBankAccountError) {
              showToast("Fetching user bank accounts failed");
          }
      }, [userBankAccountResponse, userBankAccountError]);

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
    }, 5000);
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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#003f5c" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 220, mr: 2, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 1 }}>
            <InputLabel sx={{ color: '#fff' }}>Bank Account</InputLabel>
            <Select
              value={selectedBankAccountId}
              onChange={(e) => setSelectedBankAccountId(e.target.value as string)}
              label="Bank Account"
              sx={{ color: '#fff', '& .MuiSvgIcon-root': { color: '#fff' } }}
              displayEmpty
            >
              <MenuItem value="">
                <em style={{ color: '#aaa' }}>Select bank account</em>
              </MenuItem>
              {userBankAccountResponse?.data?.map((account: any) => (
                <MenuItem key={account.id} value={account.id}>
                  {account.name}{account.accountNumber ? ` - ${account.accountNumber}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={() => window.location.href = "/add/expense"} color="inherit">
            Add Expense
          </Button>
          <IconButton
            color="inherit"
            aria-label="sync"
            sx={{
              marginRight: "1rem",
              animation: isSyncing ? "rotate 1s linear infinite" : "none",
              "@keyframes rotate": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
            onClick={handleSyncClick}
          >
            <SyncIcon />
          </IconButton>
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
