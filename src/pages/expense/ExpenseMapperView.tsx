import { useEffect, useState} from "react"
import { useHeaderMapper } from "../../api/fileMapperApi";
import { useApi } from "../../api/useApi";

export default function ExpenseMapperView({fileName } : { fileName : string}) {

    const [headerIndexMap, setHeaderIndexMap] = useState<Map<string, number>>();

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
        }
    }, [responseBody]);

    return (
        <></>
    )
}