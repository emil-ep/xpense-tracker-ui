import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { apiCaller } from "../../api/apicaller";
import { deleteExpense } from "../../api/expensesApi";
import { showToast } from "../../utils/ToastUtil";

interface DeleteExpenseDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete?: () => void;
    
}

export default function DeleteExpenseDialog({ open, onClose, onDelete }: DeleteExpenseDialogProps) {

    return (
        <Dialog open={open} >
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onDelete}
                    // disabled={!file}
                    variant="contained"
                    color="primary"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}