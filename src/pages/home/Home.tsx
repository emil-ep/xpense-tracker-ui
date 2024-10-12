import React, { useEffect, useState } from "react";
import Stack from "../../components/Stack";
import './home.css'
import ExpenseTable from "../../components/table/ExpenseTable";
import { getExpenses } from "../../api/expensesApi";
import { useNavigate } from 'react-router-dom';


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

interface ExpenseItem{
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

    const navigate = useNavigate();
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    useEffect(() => {
        getExpenses()
            .then((response: ExpenseResponse) => {
                const items = response.data;
                items.forEach((element: ExpenseItem) => {
                    if(element.type === 'CREDIT'){
                        element.amount = element.credit;
                    }else{
                        element.amount = element.debit;
                    }
                });
                setExpenseItems(items);
            })
            .catch((err) => {
                console.error('error occurred', err);
            });
    }, []);

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