import React, { useState } from "react";
import { AppBar, Toolbar, Box, CssBaseline, IconButton, Typography } from "@mui/material";
import NavigationDrawer from "./NavigationDrawer";
import MenuIcon from '@mui/icons-material/Menu';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
          {/* Additional actions like user profile, notifications, etc., can go here */}
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
