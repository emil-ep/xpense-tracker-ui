import React, { useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography} from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import DatePickerMenu from "./DatePickerMenu";
import SyncIcon from '@mui/icons-material/Sync';
import { apiCaller } from "../api/apicaller";
import { fetchSyncStatus, syncExpense } from "../api/expensesApi";
import { showToast } from "../utils/ToastUtil";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    try{
      const syncExpenseResponse: any = await apiCaller(syncExpense());
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
    }, 10000);
  }

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
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
