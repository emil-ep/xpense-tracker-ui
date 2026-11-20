import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { format, isValid, parse, parseISO, subMonths } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateUrlQuery } from '../utils/UrlStateUtil';

type DateRangeContextType = {
  fromDate: Date | null;
  toDate: Date | null;
  updateDateRange: (from: Date, to: Date) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

const getDefaultRange = () => {
  const to = new Date();
  return { from: subMonths(to, 6), to };
};

const parseUrlDate = (value: string | null): Date | null => {
  if (!value) return null;
  const isoDate = parseISO(value);
  if (isValid(isoDate)) return isoDate;
  for (const pattern of ['dd-MM-yy', 'dd/MM/yy', 'dd/MM/yyyy']) {
    const parsedDate = parse(value, pattern, new Date());
    if (isValid(parsedDate)) return parsedDate;
  }
  return null;
};

const getRangeFromSearch = (search: string) => {
  const params = new URLSearchParams(search);
  const from = parseUrlDate(params.get('fromDate'));
  const to = parseUrlDate(params.get('toDate'));
  return from && to && from <= to ? { from, to } : null;
};

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [range, setRange] = useState(() => getRangeFromSearch(location.search) ?? getDefaultRange());

  const updateDateRange = useCallback((from: Date, to: Date) => {
    if (from > to) return;
    setRange({ from, to });
    updateUrlQuery(navigate, location.pathname, location.search, location.hash, {
      fromDate: format(from, 'yyyy-MM-dd'),
      toDate: format(to, 'yyyy-MM-dd'),
    });
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parsedRange = getRangeFromSearch(location.search);
    const nextRange = parsedRange ?? getDefaultRange();
    setRange(previous => previous.from.getTime() === nextRange.from.getTime() && previous.to.getTime() === nextRange.to.getTime()
      ? previous
      : nextRange);

    const canonicalFrom = format(nextRange.from, 'yyyy-MM-dd');
    const canonicalTo = format(nextRange.to, 'yyyy-MM-dd');
    if (params.get('fromDate') !== canonicalFrom || params.get('toDate') !== canonicalTo) {
      updateUrlQuery(navigate, location.pathname, location.search, location.hash, {
        fromDate: canonicalFrom,
        toDate: canonicalTo,
      });
    }
  }, [location.hash, location.pathname, location.search, navigate]);

  return (
    <DateRangeContext.Provider value={{ fromDate: range.from, toDate: range.to, updateDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error('useDateRange must be used within a DateRangeProvider');
  return context;
};
