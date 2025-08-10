import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

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