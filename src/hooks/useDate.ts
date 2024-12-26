import { useState, useEffect } from "react";
import { subMonths } from "date-fns";

export const useDateRange = () => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    const to = new Date();
    const from = subMonths(to, 6); // Default: Last 6 months
    setFromDate(from);
    setToDate(to);
  }, []);

  const updateDateRange = (from: Date, to: Date) => {
    setFromDate(from);
    setToDate(to);
  };

  return { fromDate, toDate, updateDateRange };
};
