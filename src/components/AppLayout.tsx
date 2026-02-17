import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography, Button} from "@mui/material";
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

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const fetchUserSettings = useCallback(() => fetchUserSettingsApi(), []);
  const { responseBody: userSettingsResponse } = useApi<FetchUserSettingsResponse>(fetchUserSettings, []);
  const [selectedUserBankAccount, setSelectedUserBankAccount] = useState<string>("");
  const { 
          responseBody : userBankAccountResponse, 
          error: userBankAccountError 
      } = useApi<any>(fetchUserBankAccountsApi, []);

  
   useEffect(() => {
          if (userBankAccountResponse) {
              // Handle user bank account data if needed
              setSelectedUserBankAccount(userBankAccountResponse.data[0]?.id || ""); // Example: select the first bank account by default
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
    setIsSyncing(true);
    try{
      const syncExpenseResponse: any = await apiCaller(syncExpense(selectedUserBankAccount));
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
