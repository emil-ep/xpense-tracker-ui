import { useEffect, useState} from "react"
import { useHeaderMapper } from "../../api/fileMapperApi";
import { useApi } from "../../api/hook/useApi";
import Stack from "../../components/Stack";

export default function ExpenseMapperView({fileName } : { fileName : string}) {

    const [headerIndexMap, setHeaderIndexMap] = useState<Map<string, number>>();
    const [systemHeaders, setSystemHeaders] = useState<string[]>([]);

    const getHeaderMapper = useHeaderMapper(fileName);

    const { responseBody } = useApi<any>(getHeaderMapper, [fileName]);

    useEffect(() => {
        if(responseBody){
            const headers: string[] = responseBody.data.header;
            const headerMap = new Map<string, number>();
            headers.forEach((header: string, index: number) => {
                headerMap.set(header, index);
            });
            setHeaderIndexMap(headerMap);
            setSystemHeaders(responseBody.data.entityMap);
        }
    }, [responseBody]);

    return (
        <Stack direction="column" justify="center" align="center">
            <p>Please map your statement header with xpense tracker entity</p>
            <Stack direction="row" >
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