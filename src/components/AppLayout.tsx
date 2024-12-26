import React, { useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography, Button, Menu, MenuItem, TextField } from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCustomDateMode(false); // Reset custom date mode when closing
  };

  const handlePresetSelect = (months: number) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - months);
    setFromDate(pastDate);
    setToDate(now);
    handleMenuClose();
  };

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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleMenuOpen}
            >
              Select Date Range
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => handlePresetSelect(1)}>Last 1 Month</MenuItem>
              <MenuItem onClick={() => handlePresetSelect(2)}>Last 2 Months</MenuItem>
              <MenuItem onClick={() => handlePresetSelect(6)}>Last 6 Months</MenuItem>
              <MenuItem onClick={() => handlePresetSelect(12)}>Last 1 Year</MenuItem>
              <MenuItem
                onClick={() => setCustomDateMode(true)}
              >
                Custom Date
              </MenuItem>
              {customDateMode && (
                <Box sx={{ p: 2 }}>
                  <DatePicker
                    label="From"
                    value={fromDate}
                    onChange={(newValue: any) => setFromDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                   
                  <DatePicker
                    label="To"
                    value={toDate}
                    onChange={(newValue: any) => setToDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                 
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleMenuClose}
                    sx={{ mt: 1 }}
                  >
                    Apply
                  </Button>
                </Box>
              )}
            </Menu>
          </LocalizationProvider>
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
