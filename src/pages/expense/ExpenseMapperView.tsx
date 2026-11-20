import "./ExpenseMapperView.css";
import { ExpenseItemType, ExpensePreviewResponse, ExpenseSaveResponse } from "../../api/ApiResponses";
import { getHeaderMapperConfig, getPreviewApi } from "../../api/fileMapperApi";
import { useCallback, useEffect, useState } from "react";

import { ExpensePreviewModal } from "./modal/ExpensePreviewModal";
import ExpenseTable from "../../components/table/expenses/ExpenseTable";
import { apiCaller } from "../../api/apicaller";
import { getNavigate } from "../../navigation";
import { saveExpense } from "../../api/expensesApi";
import { useApi } from "../../api/hook/useApi";
import { showToast } from "../../utils/ToastUtil";

import {
    Box,
    Alert,
    Button,
    MenuItem,
    Select,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { fetchUserBankAccountsApi } from "../../api/userBankAccountApi";

export default function ExpenseMapperView({ fileName }: { fileName: string }) {
    const navigate = getNavigate();
    const [headerIndexMap, setHeaderIndexMap] = useState<string[]>();
    const [systemHeaders, setSystemHeaders] = useState<string[]>([]);
    const [selectedHeaders, setSelectedHeaders] = useState<{ [key: string]: string }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expensePreviewItems, setExpensePreviewItems] = useState<ExpenseItemType[]>([]);
    const [possibleMatches, setPossibleMatches] = useState<{ [key: string]: string }>({});
    const [headerStartIndex, setHeaderRowIndex] = useState<number>(0);
    const [selectedUserBankAccount, setSelectedUserBankAccount] = useState<string>("");
    const [hasCurrentPreview, setHasCurrentPreview] = useState(false);

    const headerMapperGetApi = useCallback(() => getHeaderMapperConfig(fileName), [fileName]);

    const { responseBody, error } = useApi<any>(headerMapperGetApi, [fileName]);

    const { 
        responseBody : userBankAccountResponse, 
        error: userBankAccountError 
    } = useApi<any>(fetchUserBankAccountsApi, []);

    const handleSelectionChange = (systemHeader: string, selectedHeader: string) => {
        setHasCurrentPreview(false);
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
        if (!selectedUserBankAccount) {
            showToast("Please select a bank account before verifying expenses");
            return;
        }

        const result: { [key: string]: number | null | undefined | string } = {};

        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
            const index = headerIndexMap?.indexOf(selectedHeader);
            if (index !== -1) {
                result[systemHeader] = index;
            }
        }
        result.headerStartIndex = headerStartIndex;
        result.bankAccountId = selectedUserBankAccount;
        try {
            const expensePreviewResponse: ExpensePreviewResponse = await apiCaller(getPreviewApi(fileName, result));
            if (expensePreviewResponse.status === 1) {
                const items = expensePreviewResponse.data;
                items.forEach((element: ExpenseItemType) => { 
                    element.amount = element.type === "CREDIT" ? element.credit : element.debit;
                });
                setExpensePreviewItems(items);
                setHasCurrentPreview(true);
                setIsModalOpen(true);
            } else {
                setHasCurrentPreview(false);
                showToast("Could not prepare the transaction preview");
            }
        } catch (err) {
            setHasCurrentPreview(false);
            showToast("Fetching preview failed");
        }
    };

    const handleSaveExpense = async () => {
        if (!hasCurrentPreview) {
            showToast("Preview the transactions before saving");
            return;
        }
        if (!selectedUserBankAccount) {
            showToast("Please select a bank account before submitting expenses");
            return;
        }

        const result: { [key: string]: number | null | undefined | string } = {};
        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
            const index = headerIndexMap?.indexOf(selectedHeader);
            if (index !== -1) {
                result[systemHeader] = index;
            }
        }
        result.headerStartIndex = headerStartIndex;
        result.bankAccountId = selectedUserBankAccount;
        try {
            const expenseSaveResponse: ExpenseSaveResponse = await apiCaller(saveExpense(fileName, result));
            if (expenseSaveResponse.status === 1) {
                showToast("Expense saved!");
                navigate({ pathname: "/home", search: window.location.search });
            }
        } catch (err) {
            showToast("Saving expense failed");
        }
    };

    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (responseBody) {
            setHeaderIndexMap(responseBody.data.header);
            setSystemHeaders(responseBody.data.entityMap);
            setPossibleMatches(responseBody.data.possibleMatches);
            // Initialize selectedHeaders with possibleMatches
            setSelectedHeaders(responseBody.data.possibleMatches || {});
            setHeaderRowIndex(responseBody.data.headerStartIndex || 0);
        }
        if (error) {
            showToast("Fetching expense mapping failed");
        }
    }, [responseBody, error]);

    useEffect(() => {
        if (userBankAccountError) {
            showToast("Fetching user bank accounts failed");
        }
    }, [userBankAccountError]);

    return (
        <Box sx={{ mt: 1 }}>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: '#203b30', fontWeight: 720 }}>2. Match your statement columns</Typography>
                <Typography variant="body2" sx={{ color: '#849087', mt: .4 }}>Confirm which statement column contains each transaction field.</Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 }, mb: 2, borderRadius: 3, borderColor: '#e8ece7', bgcolor: '#fff' }}>
                <Typography variant="body2" sx={{ color: '#536158', fontWeight: 650, mb: 1 }}>Save these transactions to</Typography>
                <Select
                    fullWidth
                    value={selectedUserBankAccount}
                    onChange={(e) => {
                        setSelectedUserBankAccount(e.target.value);
                        setHasCurrentPreview(false);
                    }}
                    displayEmpty
                    sx={{ bgcolor: '#fff', borderRadius: 2, color: '#30473a' }}
                >
                    <MenuItem value="">
                        <em style={{ color: '#8a978e' }}>Select a bank account</em>
                    </MenuItem>
                    {userBankAccountResponse?.data?.map((account: any) => (
                        <MenuItem key={account.id} value={account.id}>
                            {account.name} - {account.accountNumber}
                        </MenuItem>
                    ))}
                </Select>
            </Paper>

            {possibleMatches && Object.keys(possibleMatches).length > 0 && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Auto-matched {Object.keys(possibleMatches).length} statement fields. Please review the matches below.
            </Alert>}
            <TableContainer component={Paper} sx={{ border: '1px solid #e8ece7', borderRadius: 3, boxShadow: '0 8px 24px rgba(35, 55, 43, .045)', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 560, width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f3f6f2' }}>
                            <TableCell sx={{ color: '#65756b', fontWeight: 750, fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', borderColor: '#edf0ed' }}>Transaction field</TableCell>
                            <TableCell sx={{ color: '#65756b', fontWeight: 750, fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', borderColor: '#edf0ed' }}>Statement column</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {systemHeaders.map((header: string) => (
                            <TableRow key={header} hover>
                                <TableCell sx={{ color: '#405147', fontWeight: 600, borderColor: '#edf0ed' }}>{header}</TableCell>
                                <TableCell sx={{ borderColor: '#edf0ed' }}>
                                    <Select
                                        fullWidth
                                        size="small"
                                        value={selectedHeaders[header] || ''}
                                        onChange={(e) => handleSelectionChange(header, e.target.value)}
                                        displayEmpty
                                        sx={{ bgcolor: '#fff', borderRadius: 2, color: '#405147' }}
                                    >
                                        <MenuItem value=""><em>Select a column</em></MenuItem>
                                        {getAvailableHeaders(selectedHeaders[header])?.map((header) => <MenuItem key={header} value={header}>{header}</MenuItem>)}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {!hasCurrentPreview && <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                Preview the transactions before saving. If you change the bank account or any column mapping, preview them again.
            </Alert>}
            {hasCurrentPreview && <Alert severity="success" sx={{ mt: 2, borderRadius: 2 }}>
                Preview complete. You can now save these transactions.
            </Alert>}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1.5} sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleVerifyExpense} sx={{ borderColor: '#cbd9ce', color: '#28634c', borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}>Preview transactions</Button>
                <Button variant="contained" disabled={!hasCurrentPreview} onClick={handleSaveExpense} sx={{ bgcolor: '#28634c', borderRadius: 2.5, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#1e503c' } }}>Save transactions</Button>
            </Stack>

            {/* Expense Preview Modal */}
            <ExpensePreviewModal isOpen={isModalOpen} onClose={closeModal}>
                <Typography variant="h6">Your Expense Preview</Typography>
                <ExpenseTable expenses={expensePreviewItems} height={500} isPreview={true} tagCategories={[]} tags={[]} />
            </ExpensePreviewModal>
        </Box>
    );
}
