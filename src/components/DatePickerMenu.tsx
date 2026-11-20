import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Button, Divider, Grid, Popover, Stack, Typography } from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { useState } from 'react';
import { useDateRange } from '../context/DateRangeContext';

const presets = [
  { months: 0, label: 'This month', range: 'Current Month' },
  { months: 1, label: 'Last month', range: 'Last 1 Month' },
  { months: 2, label: 'Last 2 months', range: 'Last 2 Months' },
  { months: 3, label: 'Last 3 months', range: 'Last 3 Months' },
  { months: 6, label: 'Last 6 months', range: 'Last 6 Months' },
  { months: 12, label: 'Last year', range: 'Last 1 Year' },
];

export default function DatePickerMenu() {
  const { fromDate, toDate, updateDateRange } = useDateRange();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 6 Months');
  const [draftFromDate, setDraftFromDate] = useState<Date | null>(fromDate);
  const [draftToDate, setDraftToDate] = useState<Date | null>(toDate);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDraftFromDate(fromDate);
    setDraftToDate(toDate);
    setCustomDateMode(false);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCustomDateMode(false);
  };

  const handlePresetRange = (months: number, label: string) => {
    const today = new Date();
    const from = months === 0 ? startOfMonth(today) : startOfMonth(subMonths(today, months));
    const to = months === 0 ? today : endOfMonth(subMonths(today, 1));
    updateDateRange(from, to);
    setSelectedRange(label);
    handleClose();
  };

  const handleCustomDateApply = () => {
    if (!draftFromDate || !draftToDate || draftFromDate > draftToDate) return;
    updateDateRange(draftFromDate, draftToDate);
    setSelectedRange(`${format(draftFromDate, 'MMM d, yyyy')} – ${format(draftToDate, 'MMM d, yyyy')}`);
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button
        variant="outlined"
        onClick={handleMenuOpen}
        startIcon={<CalendarMonthRoundedIcon />}
        endIcon={<KeyboardArrowDownRoundedIcon />}
        aria-haspopup="dialog"
        aria-expanded={Boolean(anchorEl)}
        sx={{
          minWidth: { xs: 42, sm: 180 },
          width: { xs: 42, sm: 'auto' },
          maxWidth: { xs: 42, sm: 280 },
          px: { xs: 1, sm: 1.5 },
          borderColor: '#d6e2d8',
          borderRadius: 2.5,
          color: '#426b53',
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { borderColor: '#a9c2ae', bgcolor: '#f1f6f1' },
          '& .MuiButton-startIcon': { color: '#6d9077', mr: { xs: 0, sm: 1 } },
          '& .MuiButton-endIcon': { display: { xs: 'none', sm: 'inline-flex' } },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedRange}</Box>
      </Button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1, width: { xs: 'calc(100vw - 24px)', sm: 390 }, maxWidth: 390, p: 2, borderRadius: 3, border: '1px solid #e8ece7', boxShadow: '0 16px 42px rgba(23, 48, 35, .2)' } }}
      >
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: '#203b30', fontWeight: 750 }}>Choose a date range</Typography>
            <Typography variant="caption" sx={{ color: '#849087' }}>Update the activity shown across your pages.</Typography>
          </Box>
          <Grid container spacing={1}>
            {presets.map(preset => <Grid item xs={6} key={preset.range}>
              <Button fullWidth onClick={() => handlePresetRange(preset.months, preset.range)} sx={{ justifyContent: 'flex-start', px: 1.25, py: 1, borderRadius: 2, bgcolor: '#f4f7f3', color: '#405147', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#e8f1e9', color: '#28634c' } }}>{preset.label}</Button>
            </Grid>)}
          </Grid>
          <Divider />
          {!customDateMode ? <Button onClick={() => setCustomDateMode(true)} startIcon={<CalendarMonthRoundedIcon />} sx={{ justifyContent: 'flex-start', color: '#28634c', textTransform: 'none', fontWeight: 700 }}>Choose custom dates</Button> : <Stack spacing={1.5}>
            <DatePicker
              label="From"
              value={draftFromDate}
              maxDate={draftToDate ?? undefined}
              onChange={value => setDraftFromDate(value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            <DatePicker
              label="To"
              value={draftToDate}
              minDate={draftFromDate ?? undefined}
              onChange={value => setDraftToDate(value)}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
            {draftFromDate && draftToDate && draftFromDate > draftToDate && <Typography variant="caption" sx={{ color: '#b94a48' }}>End date must be on or after start date.</Typography>}
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={() => setCustomDateMode(false)} sx={{ color: '#718078', textTransform: 'none' }}>Back</Button>
              <Button variant="contained" onClick={handleCustomDateApply} disabled={!draftFromDate || !draftToDate || draftFromDate > draftToDate} sx={{ borderRadius: 2, bgcolor: '#28634c', textTransform: 'none', '&:hover': { bgcolor: '#1e503c' } }}>Apply range</Button>
            </Stack>
          </Stack>}
        </Stack>
      </Popover>
    </LocalizationProvider>
  );
}
