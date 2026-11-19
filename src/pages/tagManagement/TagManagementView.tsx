import './tagManagementView.css';

import { useCallback, useEffect, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { FetchTagsResponse, Tag, TagCategory, TagCategoryResponse } from '../../api/ApiResponses';
import TagTable from '../../components/table/tags/TagTable';
import { fetchTagCategories, fetchTagsApi } from '../../api/tagApi';
import { useApi } from '../../api/hook/useApi';
import { useBankAccount } from '../../context/BankAccountContext';

const TagManagement = () => {
    const [tagData, setTagData] = useState<Tag[]>([]);
    const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
    const { selectedBankAccountId } = useBankAccount();

    const fetchTags = useCallback(() => selectedBankAccountId
        ? fetchTagsApi(selectedBankAccountId)
        : { url: '', method: 'GET' as const }, [selectedBankAccountId]);
    const { responseBody: tagsResponse } = useApi<FetchTagsResponse>(fetchTags, [selectedBankAccountId]);
    const { responseBody: tagsCategoryResponse } = useApi<TagCategoryResponse>(fetchTagCategories, []);

    useEffect(() => {
        if (tagsResponse?.data) setTagData(tagsResponse.data);
    }, [tagsResponse]);

    useEffect(() => {
        if (tagsCategoryResponse?.data) setTagCategories(tagsCategoryResponse.data);
    }, [tagsCategoryResponse]);

    const expenseTags = tagData.filter(tag => tag.category?.expense).length;

    return (
        <Box className="tagManagementPage">
            <Box className="tagManagementContent">
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .75 }}>
                    <LocalOfferRoundedIcon sx={{ color: '#43815b', fontSize: 21 }} />
                    <Typography variant="overline" sx={{ color: '#6f8175', fontWeight: 700, letterSpacing: '.12em' }}>Organize your transactions</Typography>
                </Stack>
                <Typography variant="h4" sx={{ color: '#18382d', fontWeight: 750, letterSpacing: '-.04em' }}>Tags</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1, mb: 2.5 }}>
                    <Chip size="small" label={`${tagData.length} tags`} sx={{ bgcolor: '#e9f1eb', color: '#426b53', fontWeight: 650 }} />
                    <Chip size="small" label={`${tagCategories.length} categories`} sx={{ bgcolor: '#f0eef5', color: '#70628d', fontWeight: 650 }} />
                    <Chip size="small" label={`${expenseTags} expense tags`} sx={{ bgcolor: '#f8ece7', color: '#a15f4a', fontWeight: 650 }} />
                </Stack>
                <TagTable
                    clazzName="tagManagementGrid"
                    tags={tagData}
                    height="min(66vh, 680px)"
                    tagCategories={tagCategories}
                />
            </Box>
        </Box>
    );
};

export default TagManagement;
