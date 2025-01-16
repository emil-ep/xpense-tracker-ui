import './tagManagementView.css';

import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { FetchTagsResponse, Tag } from "../../api/ApiResponses"; // Assuming you have a `Tag` type
import React, { useCallback, useEffect, useState } from "react";

import TagTable from "../../components/table/tags/TagTable";
import { fetchTagsApi } from "../../api/tagApi";
import { toast } from "react-toastify";
import { useApi } from "../../api/hook/useApi";

const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#669df6' },
      background: { 
        default: 'rgb(5, 30, 52)',
        paper: 'rgb(5, 30, 52)',   
      },
    },
});

const TagManagement = () => {
    const [tagData, setTagData] = useState<Tag[]>([]);

    const fetchTags = useCallback(() => fetchTagsApi(), []);

    const { responseBody } = useApi<FetchTagsResponse>(fetchTags, []);

    useEffect(() => {
        if(responseBody && responseBody.data){
            setTagData(responseBody.data);
        }

    }, [responseBody]);


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box pt="5rem" pr="1rem" pb="2rem" pl="4rem" height="90vh">
                <TagTable 
                    clazzName="tagTable" 
                    tags={tagData} 
                    height="100%"
                />
            </Box>
        </ThemeProvider>
    );
};

export default TagManagement;
