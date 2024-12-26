import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { subMonths, format } from 'date-fns';
import { useDateRange } from "../context/DateRangeContext";

export default function DatePickerMenu() {

const { fromDate, toDate, updateDateRange } = useDateRange(); 
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [customDateMode, setCustomDateMode] = useState(false);
const [selectedRange, setSelectedRange] = useState<string>('Select Date Range');

useEffect(() => {
    const to = new Date();
    const from = subMonths(to, 6); // Last 6 months
    updateDateRange(from, to);
    setSelectedRange('Last 6 Months');
}, []);

const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
    setCustomDateMode(false);
};

const handlePresetRange = (months: number, label: string) => {
    const to = new Date();
    const from = subMonths(to, months);
    updateDateRange(from, to);
    setSelectedRange(label);
    handleClose();
  };

const handleCustomDateSelect = () => {
    if (fromDate && toDate) {
      const formattedRange = `${format(fromDate, 'dd/MM/yyyy')} to ${format(toDate, 'dd/MM/yyyy')}`;
      setSelectedRange(formattedRange);
    }
    handleClose();
};

return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleMenuOpen}
        >
            {selectedRange}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handlePresetRange(1, 'Last 1 month')}>Last 1 Month</MenuItem>
            <MenuItem onClick={() => handlePresetRange(2, 'Last 2 month')}>Last 2 Months</MenuItem>
            <MenuItem onClick={() => handlePresetRange(6, 'Last 6 month')}>Last 6 Months</MenuItem>
            <MenuItem onClick={() => handlePresetRange(12, 'Last 1 year')}>Last 1 Year</MenuItem>
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
                onChange={(newValue: any) => updateDateRange(newValue!, toDate!)}
                slotProps={{ textField: { fullWidth: true } }}
                />
                
                <DatePicker
                label="To"
                value={toDate}
                onChange={(newValue: any) => updateDateRange(fromDate!, newValue!)}
                slotProps={{ textField: { fullWidth: true } }}
                />
                
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCustomDateSelect}
                    disabled={!fromDate || !toDate}
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