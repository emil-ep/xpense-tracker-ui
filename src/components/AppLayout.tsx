import React, { useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography} from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import DatePickerMenu from "./DatePickerMenu";
import SyncIcon from '@mui/icons-material/Sync';
import { apiCaller } from "../api/apicaller";
import { syncExpense } from "../api/expensesApi";
import { toast } from "react-toastify";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSyncClick = async () => {
    try{
      const syncExpenseResponse: any = await apiCaller(syncExpense());
      if(syncExpenseResponse.status === 0){
        toast("Sync failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      }else {
        toast("Sync started", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      }
    }catch(err){
      toast("Sync failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
            sx={{marginRight: "1rem"}}
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
