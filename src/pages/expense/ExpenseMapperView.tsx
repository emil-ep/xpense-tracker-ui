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

export default function ExpenseMapperView({ fileName }: { fileName: string }) {
    const navigate = getNavigate();
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
        const result: { [key: string]: number | null | undefined } = {};

        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
            const index = headerIndexMap?.indexOf(selectedHeader);
            if (index !== -1) {
                result[systemHeader] = index;
            }
        }
        try {
            const expensePreviewResponse: ExpensePreviewResponse = await apiCaller(getPreviewApi(fileName, result));
            if (expensePreviewResponse.status === 1) {
                const items = expensePreviewResponse.data;
                items.forEach((element: ExpenseItemType) => {
                    element.amount = element.type === "CREDIT" ? element.credit : element.debit;
                });
                setExpensePreviewItems(items);
            }
            setIsModalOpen(true);
        } catch (err) {
            showToast("Fetching preview failed");
        }
    };

    const handleSaveExpense = async () => {
        const result: { [key: string]: number | null | undefined } = {};
        for (const [systemHeader, selectedHeader] of Object.entries(selectedHeaders)) {
            const index = headerIndexMap?.indexOf(selectedHeader);
            if (index !== -1) {
                result[systemHeader] = index;
            }
        }
        try {
            const expenseSaveResponse: ExpenseSaveResponse = await apiCaller(saveExpense(fileName, result));
            if (expenseSaveResponse.status === 1) {
                showToast("Expense saved!");
                navigate("/home");
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
        }
        if (error) {
            showToast("Fetching expense mapping failed");
        }
    }, [responseBody, error]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "rgb(5, 30, 52)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: 3
            }}
        >
            {/* Title */}
            <Typography variant="h5" sx={{ color: "#fff", marginBottom: 3 }}>
                Map Your Statement Headers with Xpense Tracker
            </Typography>

            {/* Buttons - Moved to Top for Better Visibility */}
            <Stack direction="row" spacing={2} sx={{ marginBottom: 2 }}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#0288d1", "&:hover": { backgroundColor: "#0277bd" } }}
                    onClick={handleVerifyExpense}
                >
                    Verify Expense
                </Button>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#43a047", "&:hover": { backgroundColor: "#388e3c" } }}
                    onClick={handleSaveExpense}
                >
                    Submit Expense
                </Button>
            </Stack>

            {/* Table Container */}
            <TableContainer
                component={Paper}
                sx={{
                    width: "90%",
                    maxWidth: "900px",
                    borderRadius: 2,
                    padding: 2,
                    backgroundColor: "#0A253F",
                    boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.2)"
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#1B3A57" }}>
                            <TableCell sx={{ color: "white" }}><b>System Header</b></TableCell>
                            <TableCell sx={{ color: "white" }}><b>Statement Header</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {systemHeaders.map((header: string) => (
                            <TableRow key={header}>
                                <TableCell sx={{ color: "white" }}>{header}</TableCell>
                                <TableCell>
                                    <Select
                                        fullWidth
                                        value={selectedHeaders[header] || ""}
                                        onChange={(e) => handleSelectionChange(header, e.target.value)}
                                        displayEmpty
                                        sx={{ backgroundColor: "#1B3A57", color: "white", borderRadius: 1 }}
                                    >
                                        <MenuItem value="">
                                            <em style={{ color: "white" }}>Select Header</em>
                                        </MenuItem>
                                        {getAvailableHeaders(selectedHeaders[header])?.map((header) => (
                                            <MenuItem key={header} value={header}>
                                                {header}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Expense Preview Modal */}
            <ExpensePreviewModal isOpen={isModalOpen} onClose={closeModal}>
                <Typography variant="h6">Your Expense Preview</Typography>
                <ExpenseTable expenses={expensePreviewItems} height={500} isPreview={true} tagCategories={[]} tags={[]} />
            </ExpensePreviewModal>
        </Box>
    );
}
