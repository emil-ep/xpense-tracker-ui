import { useEffect, useState} from "react"
import { useExpensePreview, useHeaderMapper } from "../../api/fileMapperApi";
import { useApi } from "../../api/hook/useApi";
import Stack from "../../components/Stack";
import './ExpenseMapperView.css';

export default function ExpenseMapperView({fileName } : { fileName : string}) {

    const [headerIndexMap, setHeaderIndexMap] = useState<string[]>();
    const [systemHeaders, setSystemHeaders] = useState<string[]>([]);
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: string]: string }>({});

    const getHeaderMapper = useHeaderMapper(fileName);

    const { responseBody } = useApi<any>(getHeaderMapper, [fileName]);

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

    const handleVerifyExpense = () => {
        const result: { [key: string]: number | null | undefined} = {};

        // Map each system header to the index of the selected statement header.
        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
        const index = headerIndexMap?.indexOf(selectedHeader);
        if (index !== -1) {
            result[systemHeader] = index;
        }
        }
        // const getExpensePreview = useExpensePreview(fileName, result)
        // const {responseBody} = useApi<any>(getExpensePreview, [fileName, result]) 
    };


    useEffect(() => {
        if(responseBody){
            const headers: string[] = responseBody.data.header;            
            setHeaderIndexMap(headers);
            setSystemHeaders(responseBody.data.entityMap);
        }
    }, [responseBody]);

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
        </Stack>
    )
}