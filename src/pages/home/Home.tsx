import React from "react";
import Stack from "../../components/Stack";
import './home.css'
import ExpenseTable from "../../components/table/ExpenseTable";


const items = [
    {
        serialNo: 1,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 2,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 3,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 4,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    {
        serialNo: 5,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 6,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 7,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 8,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    {
        serialNo: 9,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 10,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 11,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 12,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    {
        serialNo: 13,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 14,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 15,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 16,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    {
        serialNo: 17,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 18,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 19,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 20,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    {
        serialNo: 21,
        date: '2/1/19',
        description: 'Salary',
        type: 'Credit',
        amount: 'Rs 20000'
    },
    {
        serialNo: 22,
        date: '3/1/19',
        description: 'Grocery',
        type: 'debit',
        amount: 'Rs 20'
    },
    {
        serialNo: 23,
        date: '4/1/19',
        description: 'Milk',
        type: 'Debit',
        amount: 'Rs 28'
    },
    {
        serialNo: 24,
        date: '5/1/19',
        description: 'rent',
        type: 'debit',
        amount: 'Rs 2500'
    },
    

];

const headers = [
    {field: "serialNo"},
    {field: "date"},
    {field: "description"},
    {field: "type"},
    {field: "amount"},
]

export default function Home(){

    return (
        <Stack className="homeContainer" direction="row" align="center" justify="center" >
            <Stack className="tableContainer" direction="column" >
                <ExpenseTable rows={items} header={headers}/>
            </Stack>
        </Stack>
    )
    
}