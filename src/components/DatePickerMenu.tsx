import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useState } from "react";


export default function DatePickerMenu() {

const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [customDateMode, setCustomDateMode] = useState(false);
const [fromDate, setFromDate] = useState<Date | null>(null);
const [toDate, setToDate] = useState<Date | null>(null);



const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
};

const handlePresetSelect = (months: number) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - months);
    setFromDate(pastDate);
    setToDate(now);
    handleMenuClose();
};

const handleMenuClose = () => {
    setAnchorEl(null);
    setCustomDateMode(false); // Reset custom date mode when closing
};

return (
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
)
}