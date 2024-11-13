import React from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ExpenseItemType, Tag } from "../../api/ApiResponses";

interface TableProps {
    clazzName?: string;
    expenses: ExpenseItemType[]
    pagination?: boolean,
    height: number | string

}


export default function ExpenseTable({clazzName, expenses, pagination, height} : TableProps){

    const tagCellRenderer = (props: any) => {
        return (
            <div>
                {props.value.map((tag: Tag, index: number) => (
                <button 
                    key={index} 
                    className="tag-button" 
                >
                    {tag.name}
                </button>
                ))}
            </div>
        );
    };  

    const headers: Object[] = [
        {field: "id"},
        {field: "transactionDate"},
        {field: "description"},
        {field: "type"},
        {field: "amount"},
        {field: 'tags', cellRenderer: tagCellRenderer, sortable: false}
    ];

    
    return (
        <div
        className={`ag-theme-quartz ${clazzName}`} // applying the Data Grid theme
        style={{ height: height}} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                pagination={pagination? pagination : undefined}
                paginationPageSize={20}
                paginationPageSizeSelector={[20, 50, 100]}
                rowData={expenses}
                columnDefs={headers}
            />
        </div>
)
}