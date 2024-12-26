import React, { createContext, useContext, useState, useEffect } from "react";
import { subMonths } from "date-fns";

type DateRangeContextType = {
  fromDate: Date | null;
  toDate: Date | null;
  updateDateRange: (from: Date, to: Date) => void;
};

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export const DateRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    const to = new Date();
    const from = subMonths(to, 6);
    setFromDate(from);
    setToDate(to);
  }, []);

  const updateDateRange = (from: Date, to: Date) => {
    setFromDate(from);
    setToDate(to);
  };

  return (
    <DateRangeContext.Provider value={{ fromDate, toDate, updateDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
};
