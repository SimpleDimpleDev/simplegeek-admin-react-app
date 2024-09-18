import { Close } from "@mui/icons-material";
import { Divider, IconButton, Modal, Slide, Typography } from "@mui/material";

type Props = {
    title: string;
    opened: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function ManagementModal({ title, opened, onClose, children }: Props) {
    return (
        <Modal open={opened}>
            <Slide direction="left" in={opened} mountOnEnter unmountOnExit>
                <div className="ps-a h-100 bg-primary" style={{ right: 0, width: 460 }}>
                    <div className="d-f fd-r jc-sb ai-c pl-2 pr-1" style={{ height: 72 }}>
                        <Typography variant="h6">{title}</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </div>
                    <Divider />
                    <div style={{ height: "calc(100% - 72px)" }}>{children}</div>
                </div>
            </Slide>
        </Modal>
    );
}
