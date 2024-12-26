import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { subMonths, format } from 'date-fns';


export default function DatePickerMenu() {

const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
const [customDateMode, setCustomDateMode] = useState(false);
const [fromDate, setFromDate] = useState<Date | null>(null);
const [toDate, setToDate] = useState<Date | null>(null);
const [selectedRange, setSelectedRange] = useState<string>('Select Date Range');

useEffect(() => {
    const to = new Date();
    const from = subMonths(to, 6); // Last 6 months
    setFromDate(from);
    setToDate(to);
    setSelectedRange('Last 6 Months');
}, []);

const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};

const handleMenuClose = () => {
    setAnchorEl(null);
    setCustomDateMode(false); // Reset custom date mode when closing
};

const updateDateRange = (months: number, label: string) => {
    const to = new Date();
    const from = subMonths(to, months);
    setFromDate(from);
    setToDate(to);
    console.log('from :', from);
    console.log('to :', to);
    setSelectedRange(label);
    handleClose();
  };

const handleCustomDateSelect = () => {
    if (fromDate && toDate) {
      const formattedRange = `${format(fromDate, 'MM/dd/yyyy')} to ${format(toDate, 'MM/dd/yyyy')}`;
      setSelectedRange(formattedRange);
    }
    handleClose();
};

return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Button
            variant="contained"
            color="secondary"
            onClick={handleMenuOpen}
        >
            {selectedRange}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => updateDateRange(1, 'Last 1 month')}>Last 1 Month</MenuItem>
            <MenuItem onClick={() => updateDateRange(2, 'Last 2 month')}>Last 2 Months</MenuItem>
            <MenuItem onClick={() => updateDateRange(6, 'Last 6 month')}>Last 6 Months</MenuItem>
            <MenuItem onClick={() => updateDateRange(12, 'Last 1 year')}>Last 1 Year</MenuItem>
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