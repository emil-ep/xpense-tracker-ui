import React, { useEffect, useState } from "react";
import Stack from "../../components/Stack";
import './home.css'
import ExpenseTable from "../../components/table/ExpenseTable";
import { getExpenses } from "../../api/expensesApi";


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

    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    useEffect(() => {
        
        getExpenses()
            .then((response: ExpenseResponse) => {
                const items = response.data;
                console.log('items', items)
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
            }).finally(() => {
                console.log('finally')
            })
    }, []);

    return (
        <Stack className="homeContainer" direction="row" align="center" justify="center" >
            <Stack className="tableContainer" direction="column" >
                <ExpenseTable rows={expenseItems} header={headers}/>
            </Stack>
        </Stack>
    )
    
}