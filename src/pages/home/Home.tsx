import React, { useEffect, useState } from "react";
import Stack from "../../components/Stack";
import './home.css'
import ExpenseTable from "../../components/table/ExpenseTable";
import { getExpensesV2 } from "../../api/expensesApi";
import { getNavigate } from "../../navigation";
import { useApi } from "../../api/hook/useApi";


const headers = [
    {field: "id"},
    {field: "transactionDate"},
    {field: "description"},
    {field: "type"},
    {field: "amount"},
]

interface ExpenseResponse {
    data: ExpenseItem[]
}

export interface ExpenseItem{
    id: string;
    transactionDate: string;
    description: string;
    bankReferenceNo: string;
    debit: number;
    credit: number;
    closingBalance: number;
    type: string;
    amount?: number;
}

export default function Home(){

    const navigate = getNavigate();
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    const { responseBody, error } = useApi<any>(getExpensesV2, []);

    useEffect(() => {

        if(responseBody && responseBody.data){
            const items = responseBody.data;
                items.forEach((element: ExpenseItem) => {
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
        navigate('/expense');
    }

    return (
        <Stack className="homeContainer" direction="row" align="center" justify="center" >
            <Stack className="tableContainer" direction="column">
                <Stack direction="row" justify="flex-end">
                    <button className="addExpenseBtn" onClick={navigateToExpense}> Add Expense</button>
                </Stack>
                <ExpenseTable rows={expenseItems} header={headers}/>
            </Stack>
        </Stack>
    )
    
}