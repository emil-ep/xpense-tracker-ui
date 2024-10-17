import { useCallback, useEffect, useState} from "react"
import { getHeaderMapperConfig, getPreviewApi} from "../../api/fileMapperApi";
import { useApi } from "../../api/hook/useApi";
import Stack from "../../components/Stack";
import './ExpenseMapperView.css';
import { apiCaller } from "../../api/apicaller";
import { ExpensePreviewModal } from "./ExpensePreviewModal";
import ExpenseTable from "../../components/table/ExpenseTable";
import { ExpenseItemType, ExpensePreviewResponse } from "../../api/ApiResponses";
import { toast } from 'react-toastify';
import { EXPENSE_HEADERS } from "../../constants/ExpenseConstants";


export default function ExpenseMapperView({fileName } : { fileName : string}) {

    const [headerIndexMap, setHeaderIndexMap] = useState<string[]>();
    const [systemHeaders, setSystemHeaders] = useState<string[]>([]);
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: string]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [expensePreviewItems, setExpensePreviewItems] = useState<ExpenseItemType[]>([]);


    const headerMapperGetApi = useCallback(() => getHeaderMapperConfig(fileName), [fileName]);

    const { responseBody, error } = useApi<any>(headerMapperGetApi, [fileName]);

    const handleSelectionChange = (systemHeader: string, selectedHeader: string) => {
        setSelectedHeaders((prev) => ({
        ...prev,
        [systemHeader]: selectedHeader,
        }));
    };

    const getAvailableHeaders = (currentSelection: string | undefined) => {
        return headerIndexMap?.filter(
        (header) => !Object.values(selectedHeaders).includes(header) || header === currentSelection
        );
    };

    const handleVerifyExpense = async () => {
        const result: { [key: string]: number | null | undefined} = {};

        // Map each system header to the index of the selected statement header.
        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
        const index = headerIndexMap?.indexOf(selectedHeader);
        if (index !== -1) {
            result[systemHeader] = index;
        }
        }
        try{
            const expensePreviewResponse: ExpensePreviewResponse = await apiCaller(getPreviewApi(fileName, result));
            if(expensePreviewResponse.status === 1){
                const items = expensePreviewResponse.data;
                items.forEach((element: ExpenseItemType) => {
                    if(element.type === 'CREDIT'){
                        element.amount = element.credit;
                    }else{
                        element.amount = element.debit;
                    }
                });
                setExpensePreviewItems(items);
            }
            setIsModalOpen(true);
        }catch(err){
            toast("Fetching preview failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if(responseBody){
            const headers: string[] = responseBody.data.header;            
            setHeaderIndexMap(headers);
            setSystemHeaders(responseBody.data.entityMap);
        }
        if(error){
            toast("Fetching expense mapping failed", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "dark",
            });
        }
    }, [responseBody, error]);

    return (
        <Stack direction="column" justify="center" align="center">
            <h1>Please map your statement header with xpense tracker entity</h1>
            <Stack direction="row" className="tableContainer">
                <table>
                    <thead>
                        <tr>
                            <th>System Header</th>
                            <th>Statement Header</th>
                        </tr>
                    </thead>
                    <tbody>
                        {systemHeaders.map((header: string) => (
                            <tr key={header}>
                                <td>{header}</td>
                                <td>
                                    <select id={header}
                                        value={selectedHeaders[header] || ""}
                                        onChange={(e) => handleSelectionChange(header, e.target.value)}
                                    >
                                        <option value="">
                                            Select Item
                                        </option>
                                        {getAvailableHeaders(selectedHeaders[header])?.map((header) => (
                                            <option key={header} value={header}>
                                                {header}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Stack>
            <button className="verifyBtn" type="submit" onClick={handleVerifyExpense}>
                Verify Expense
            </button>
            <ExpensePreviewModal isOpen={isModalOpen} onClose={closeModal}>
                <h2>Your Expense Preview</h2>
                <ExpenseTable rows={expensePreviewItems} header={EXPENSE_HEADERS}/>
            </ExpensePreviewModal>
        </Stack>
    )
}