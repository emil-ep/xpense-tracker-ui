import './expenseView.css'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ExpenseItemType, PaginatedExpenseResponse, TagCategory, TagCategoryResponse } from '../../api/ApiResponses';
import { useCallback, useEffect, useState } from 'react';

import ExpenseTable from '../../components/table/expenses/ExpenseTable';
import { Stack } from '@mui/material';
import { getExpensesV2 } from '../../api/expensesApi';
import { useApi } from '../../api/hook/useApi';
import { fetchTagCategories } from '../../api/tagApi';

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

    const fetchExpenses = useCallback(() => {
        return getExpensesV2(1, 500);
    }, []);

    const { responseBody, error } = useApi<PaginatedExpenseResponse>(fetchExpenses, []);
    const { responseBody: tagsCategoryResponse } = useApi<TagCategoryResponse>(fetchTagCategories, []);

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

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Stack className="expenseContainer" direction="column" alignItems="stretch" justifyContent="center">
                <ExpenseTable 
                    clazzName="expenseTableContainer" 
                    height="100%" 
                    pagination={true} 
                    expenses={expenseItems}
                    tagCategories={tagCategories}
                />
            </Stack>
        </ThemeProvider>
    )
}