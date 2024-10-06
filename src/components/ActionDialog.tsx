import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

type props = {
    title: string;
    helperText?: string;
    opened: boolean;
    onClose: () => void;
    confirmButton: {
        text: string;
        onClick: () => void;
    };
    declineButton: {
        text: string;
        onClick?: () => void;
    };
};

export default function ActionDialog({ title, helperText, opened, onClose, confirmButton, declineButton }: props) {
    return (
        <Dialog sx={{ borderRadius: "24px", "& .MuiPaper-root": { width: "444px" } }} open={opened} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{helperText}</DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        declineButton.onClick?.();
                        onClose();
                    }}
                    sx={{ borderRadius: "8px" }}
                    fullWidth
                    variant="contained"
                    color="secondary"
                >
                    {declineButton.text}
                </Button>
                <Button
                    onClick={() => {
                        confirmButton.onClick();
                    }}
                    sx={{ borderRadius: "8px" }}
                    fullWidth
                    variant="contained"
                >
                    {confirmButton.text}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
