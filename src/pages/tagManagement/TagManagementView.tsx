import './tagManagementView.css';

import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { FetchTagsResponse, Tag } from "../../api/ApiResponses"; // Assuming you have a `Tag` type
import React, { useCallback, useEffect, useState } from "react";

import TagTable from "../../components/table/tags/TagTable";
import { fetchTagsApi } from "../../api/tagApi";
// import { apiCaller } from "../../api/apicaller";
import { toast } from "react-toastify";
import { useApi } from "../../api/hook/useApi";

// import { updateTagApi } from "../../api/tagApi";



const TagManagement = () => {
    const [tagData, setTagData] = useState<Tag[]>([]);
    const [modifiedTags, setModifiedTags] = useState<Set<string>>(new Set()); // Track modified tags

    const fetchTags = useCallback(() => fetchTagsApi(), []);

    const { responseBody } = useApi<FetchTagsResponse>(fetchTags, []);

    useEffect(() => {
        if(responseBody && responseBody.data){
            console.log('tagData : ', responseBody.data);
            setTagData(responseBody.data);
        }

    }, [responseBody]);

    const handleFieldChange = (field: keyof Tag, value: string, tagId: string) => {
        setTagData((prev) =>
            prev?.map((tag) =>
                tag.id === tagId ? { ...tag, [field]: field === "keywords" ? value.split(",") : value } : tag
            )
        );
        setModifiedTags((prev) => new Set([...prev, tagId])); // Mark tag as modified
    };

    const handleSave = async () => {
        const updates = tagData.filter((tag) => modifiedTags.has(tag.id));
        try {
            // const updatePromises = updates.map((tag) => apiCaller(updateTagApi(tag)));
            // await Promise.all(updatePromises);

            toast("Tags updated successfully!", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
            });

            // Reset modified tags
            setModifiedTags(new Set());
        } catch (err) {
            toast("Failed to update tags", {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
            });
        }
    };

    return (
        <Box pt="4rem" height="100vh">
            <TagTable clazzName="tagTable" tags={tagData} height="100%"/>
        </Box>
        // <Box p={2}>
        //     <Table>
        //         <TableHead>
        //             <TableRow>
        //                 <TableCell>Tag Name</TableCell>
        //                 <TableCell>Keywords</TableCell>
        //             </TableRow>
        //         </TableHead>
        //         <TableBody>
        //             {tagData?.map((tag) => (
        //                 <TableRow key={tag.id}>
        //                     <TableCell>
        //                         <TextField
        //                             fullWidth
        //                             value={tag.name}
        //                             onChange={(e) => handleFieldChange("name", e.target.value, tag.id)}
        //                         />
        //                     </TableCell>
        //                     <TableCell>
        //                         <TextField
        //                             fullWidth
        //                             value={tag.keywords.join(", ")}
        //                             onChange={(e) => handleFieldChange("keywords", e.target.value, tag.id)}
        //                         />
        //                     </TableCell>
        //                 </TableRow>
        //             ))}
        //         </TableBody>
        //     </Table>
        //     <Box mt={2} textAlign="right">
        //         <Button
        //             variant="contained"
        //             color="primary"
        //             onClick={handleSave}
        //             disabled={modifiedTags.size === 0} // Disable if no changes
        //         >
        //             Save
        //         </Button>
        //     </Box>
        // </Box>
    );
};

export default TagManagement;
