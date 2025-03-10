import './expenseView.css'

import { Backdrop, CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ExpenseItemType, FetchTagsResponse, PaginatedExpenseResponse, Tag, TagCategory, TagCategoryResponse } from '../../api/ApiResponses';
import { useCallback, useEffect, useState } from 'react';

import ExpenseTable from '../../components/table/expenses/ExpenseTable';
import { Stack } from '@mui/material';
import { getExpensesV2 } from '../../api/expensesApi';
import { useApi } from '../../api/hook/useApi';
import { fetchTagCategories, fetchTagsApi } from '../../api/tagApi';
import { Timeframe } from '../analytics/AnalyticsView';
import { useDateRange } from '../../context/DateRangeContext';
import { format } from 'date-fns';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#669df6' },
    background: { 
      default: 'rgb(5, 30, 52)',
      paper: 'rgb(5, 30, 52)',   
    },
  },
});

export const ExpenseView = () => {

    const [expenseItems, setExpenseItems] = useState<ExpenseItemType[]>([]);
    const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
    const[tags, setTags] = useState<Tag[]>([]);

    const [timeframe, setTimeframe] = useState<Timeframe>({ fromDate: '01-01-24', toDate: '01-01-24'});
    
    const { fromDate, toDate } = useDateRange();

    useEffect(() => {
        if (fromDate && toDate) {
            // Fetch analytics data based on the new date range
            const newTimeframe = {
                fromDate: format(fromDate, "dd-MM-yy"),
                toDate: format(toDate, "dd-MM-yy")
            }
            setTimeframe(newTimeframe);
        }
    }, [fromDate, toDate]);

    const fetchExpenses = useCallback(() => {
        return getExpensesV2(1, 50000, timeframe.fromDate, timeframe.toDate);
    }, [timeframe]);

    const { responseBody, error, loading } = useApi<PaginatedExpenseResponse>(fetchExpenses, [timeframe]);
     const { responseBody: tagsResponse, error: tagsError } = useApi<FetchTagsResponse>(fetchTagsApi, []);
    const { responseBody: tagsCategoryResponse, loading: tagLoading } = useApi<TagCategoryResponse>(fetchTagCategories, []);

    useEffect(() => {

        if(responseBody && responseBody.data){
            const items = responseBody.data.expenses;
                items.forEach((element: ExpenseItemType) => {
                    if(element.type === 'CREDIT'){
                        element.amount = element.credit;
                    }else{
                        element.amount = element.debit;
                    }
                }); 
            setExpenseItems(items);
        }
    }, [responseBody]);

    useEffect(() => {
                if(tagsCategoryResponse && tagsCategoryResponse.data){
                    setTagCategories(tagsCategoryResponse.data);
                }
    }, [tagsCategoryResponse]);

    useEffect(() => {
            if(tagsResponse && tagsResponse.data){
                setTags(tagsResponse.data);
            }
        }, [tagsResponse]);

    const isLoading = loading || tagLoading;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack className="expenseContainer" direction="column" alignItems="stretch" justifyContent="center">
                <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <ExpenseTable 
                    clazzName="expenseTableContainer" 
                    height="100%" 
                    pagination={true} 
                    expenses={expenseItems}
                    tagCategories={tagCategories}
                    tags={tags}
                />
            </Stack>
        </ThemeProvider>
    )
}