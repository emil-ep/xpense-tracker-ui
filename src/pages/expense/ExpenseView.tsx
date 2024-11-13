import { useCallback, useEffect, useState } from 'react';
import './expenseView.css'
import { ExpenseItemType, PaginatedExpenseResponse } from '../../api/ApiResponses';
import { getExpensesV2 } from '../../api/expensesApi';
import { useApi } from '../../api/hook/useApi';
import ExpenseTable from '../../components/table/ExpenseTable';
import { Stack } from '@mui/material';

export const ExpenseView = () => {

    const [expenseItems, setExpenseItems] = useState<ExpenseItemType[]>([]);

    const fetchExpenses = useCallback(() => {
        return getExpensesV2(1, 100);
    }, []);

    const { responseBody, error } = useApi<PaginatedExpenseResponse>(fetchExpenses, []);


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

    return (
       <Stack className="expenseContainer" direction="column" alignItems="stretch" justifyContent="center">
        <ExpenseTable clazzName="expenseTableContainer" height="100%" pagination={true} expenses={expenseItems}/>
       </Stack>
    )
}