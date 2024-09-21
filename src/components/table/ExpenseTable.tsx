import React from "react";
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

interface TableProps {
    rows: Object[];
    header: Object[];
}

export default function ExpenseTable({rows, header} : TableProps){

    return (
        <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
            <AgGridReact
                rowData={rows}
                columnDefs={header}
            />
        </div>
)
}