import React from "react"
import './AddExpense.css'
import Stack from "../../components/Stack"

export default function AddExpense(){
    return (
        <Stack className="homeContainer" direction="column">
            <Stack className="uploadContainer" direction="row" justify="center">
                <button className="uploadBtn">Upload your statement</button>
            </Stack>
            
        </Stack>
    )

    // return <></>
}