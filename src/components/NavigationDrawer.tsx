import './navigationDrawer.css'

import { BarChart, Home, KeyboardArrowDown } from "@mui/icons-material";
import StyleIcon from '@mui/icons-material/Style';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Link } from "react-router-dom";

const drawerWidth = 240;

const data = [
  { icon: <Home />, label: 'Home', path: '/home' },
  { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Expenses', path: '/expense' },
  { icon: <StyleIcon />, label: 'Tags', path: '/tagManagement'},
  { icon: <BarChart />, label: 'View Analytics', path: '/analytics'},
  { icon: <DashboardCustomizeIcon />, label: 'Custom Dashboard', path: '/customDashboard'},
  { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
  { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Mutual Funds', path: '/mutualFunds' },
];

const FireNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

interface NavigationDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, toggleDrawer }) => {

    const [openSubMenu, setOpenSubMenu] = useState(true);

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'dark',
          primary: { main: 'rgb(102, 157, 246)' },
          background: { paper: 'rgb(5, 30, 52)' },
        },
      })}
    >
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <FireNav component="nav" disablePadding>
          <ListItemButton component={Link} to="/home" onClick={toggleDrawer}>
            <ListItemIcon sx={{ fontSize: 20 }}>
                <img src="/images/wallet-icon-custom-3.svg" alt="Expense-icon" className="appIcon"></img>
            </ListItemIcon>
            <ListItemText
              sx={{ my: 0 }}
              primary="Xpense Tracker"
              primaryTypographyProps={{
                fontSize: 18,
                fontWeight: 'medium',
                letterSpacing: 0,
              }}
            />
          </ListItemButton>
          <Divider />
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56 }} component={Link} to="/home" onClick={toggleDrawer}>
              <ListItemIcon>
                <Home color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{
                  color: 'primary',
                  fontWeight: 'medium',
                  variant: 'body2',
                }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <Box
            sx={{
              bgcolor: openSubMenu ? 'rgba(71, 98, 130, 0.2)' : null,
              pb: openSubMenu ? 2 : 0,
            }}
          >
            <ListItemButton
              onClick={() => setOpenSubMenu(!openSubMenu)}
              sx={{
                px: 3,
                pt: 2.5,
                pb: openSubMenu ? 0 : 2.5,
                '&:hover, &:focus': {
                  '& svg': { opacity: openSubMenu ? 1 : 0 },
                },
              }}
            >
              <ListItemText
                primary="Navigation"
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: 'medium',
                  lineHeight: '20px',
                  mb: '2px',
                }}
                secondary="Explore options"
                secondaryTypographyProps={{
                  noWrap: true,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: openSubMenu ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.5)',
                }}
                sx={{ my: 0 }}
              />
              <KeyboardArrowDown
                sx={{
                  mr: -1,
                  opacity: openSubMenu ? 1 : 0,
                  transition: '0.2s',
                  transform: openSubMenu ? 'rotate(-180deg)' : 'rotate(0)',
                }}
              />
            </ListItemButton>
            {openSubMenu &&
              data.map((item) => (
                <ListItemButton
                  key={item.label}
                  sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
                  component={Link}
                  to={item.path}
                  onClick={toggleDrawer}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                  />
                </ListItemButton>
              ))}
          </Box>
        </FireNav>
      </Drawer>
    </ThemeProvider>
  );
};

export default NavigationDrawer;