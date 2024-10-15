import { useEffect, useState} from "react"
import { useHeaderMapper } from "../../api/fileMapperApi";
import { useApi } from "../../api/hook/useApi";
import Stack from "../../components/Stack";
import './ExpenseMapperView.css';

export default function ExpenseMapperView({fileName } : { fileName : string}) {

    const [headerIndexMap, setHeaderIndexMap] = useState<string[]>();
    const [systemHeaders, setSystemHeaders] = useState<string[]>([]);

    const getHeaderMapper = useHeaderMapper(fileName);

    const { responseBody } = useApi<any>(getHeaderMapper, [fileName]);

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
                                    <select id={header}>
                                        <option value="">
                                            Select Item
                                        </option>
                                        {headerIndexMap?.map((header: string) => (
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
        </Stack>
    )
}