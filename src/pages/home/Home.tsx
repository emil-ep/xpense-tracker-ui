import React, { useCallback, useEffect, useState } from "react";
import Stack from "../../components/Stack";
import './home.css'
import ExpenseTable from "../../components/table/ExpenseTable";
import { getExpensesV2 } from "../../api/expensesApi";
import { getNavigate } from "../../navigation";
import { useApi } from "../../api/hook/useApi";
import { ExpenseItemType, PaginatedExpenseResponse } from "../../api/ApiResponses";


const headers = [
    {field: "id"},
    {field: "transactionDate"},
    {field: "description"},
    {field: "type"},
    {field: "amount"},
    {field: 'tags'}
]
export default function Home(){

    const navigate = getNavigate();
    const [expenseItems, setExpenseItems] = useState<ExpenseItemType[]>([]);

    const fetchExpenses = useCallback(() => {
        return getExpensesV2(1, 50);
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

    function navigateToExpense(){
        navigate('/add/expense');
    }

    return (
        <Stack className="homeContainer" direction="row" align="center" justify="center" >
            <Stack className="tableContainer" direction="column">
                <Stack direction="row" justify="flex-end">
                    <button className="addExpenseBtn" onClick={navigateToExpense}> Add Expense</button>
                </Stack>
                <ExpenseTable clazzName="expenseTable" height={500} expenses={expenseItems} />
            </Stack>
        </Stack>
    )
    
}