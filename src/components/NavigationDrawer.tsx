import './navigationDrawer.css'

import { BarChart, Home, KeyboardArrowDown } from "@mui/icons-material";
import StyleIcon from '@mui/icons-material/Style';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { Box, Divider, Drawer, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import React, { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const data = [
  { icon: <Home />, label: 'Home', path: '/home' },
  { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Expenses', path: '/expense' },
  { icon: <StyleIcon />, label: 'Tags', path: '/tagManagement'},
  { icon: <BarChart />, label: 'View Analytics', path: '/analytics'},
  { icon: <DashboardCustomizeIcon />, label: 'Custom Dashboard', path: '/customDashboard'},
  { icon: <SettingsIcon />, label: 'Settings', path: '/settings' },
  { icon: <AccountBalanceWalletOutlinedIcon />, label: 'Mutual Funds', path: '/mutualFunds' },
];

interface NavigationDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, toggleDrawer }) => {
    const [openSubMenu, setOpenSubMenu] = useState(true);
    const location = useLocation();

  return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#1f4b3a',
            color: '#fff',
            borderRight: '1px solid rgba(255,255,255,.12)',
            backgroundImage: 'linear-gradient(180deg, #1f4b3a 0%, #193f31 100%)',
          },
        }}
      >
        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
          <ListItemButton component={Link} to={{ pathname: '/home', search: location.search }} onClick={toggleDrawer} sx={{ px: 0, py: 1, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,.08)' } }}>
            <ListItemIcon sx={{ minWidth: 48, mr: 1 }}>
              <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', borderRadius: 2, bgcolor: 'rgba(255,255,255,.12)' }}>
                <img src="/images/wallet-icon-custom-3.svg" alt="" className="appIcon" />
              </Box>
            </ListItemIcon>
            <ListItemText primary="Xpense Tracker" secondary="Personal finance" primaryTypographyProps={{ fontSize: 16, fontWeight: 750, letterSpacing: '-.02em' }} secondaryTypographyProps={{ fontSize: 12, color: 'rgba(255,255,255,.65)' }} />
          </ListItemButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,.14)' }} />
        <Box sx={{ px: 1.5, py: 2, flex: 1 }}>
            <ListItemButton
              onClick={() => setOpenSubMenu(!openSubMenu)}
              sx={{
                px: 1.5,
                py: 1,
                mb: 1,
                borderRadius: 2,
                color: 'rgba(255,255,255,.72)',
                '&:hover': { bgcolor: 'rgba(255,255,255,.08)' },
              }}
            >
              <ListItemText primary="Workspace" primaryTypographyProps={{ fontSize: 12, fontWeight: 750, letterSpacing: '.1em', textTransform: 'uppercase' }} />
              <KeyboardArrowDown
                sx={{
                  transition: 'transform .2s',
                  transform: openSubMenu ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </ListItemButton>
            {openSubMenu &&
              data.map((item) => (
                <ListItemButton
                  key={item.label}
                  selected={location.pathname === item.path}
                  sx={{
                    py: 1.15,
                    px: 1.5,
                    mb: .5,
                    minHeight: 44,
                    borderRadius: 2,
                    borderLeft: location.pathname === item.path ? '3px solid #b8d9c2' : '3px solid transparent',
                    color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,.78)',
                    '& .MuiListItemIcon-root': { color: location.pathname === item.path ? '#cce4d1' : 'rgba(255,255,255,.65)' },
                    '&.Mui-selected': { bgcolor: 'rgba(255,255,255,.14)' },
                    '&.Mui-selected:hover, &:hover': { bgcolor: 'rgba(255,255,255,.11)', color: '#fff' },
                  }}
                  component={Link}
                  to={{ pathname: item.path, search: location.search }}
                  onClick={toggleDrawer}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 1.5, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: location.pathname === item.path ? 700 : 550 }}
                  />
                </ListItemButton>
              ))}
        </Box>
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255,255,255,.12)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.55)' }}>Spend thoughtfully. Track clearly.</Typography>
        </Box>
      </Drawer>
  );
};

export default NavigationDrawer;
