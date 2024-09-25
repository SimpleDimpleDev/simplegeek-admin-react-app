import { CircularProgress, Modal } from "@mui/material";

interface Props {
	isOpened: boolean;
}

export const LoadingOverlay: React.FC<Props> = ({ isOpened }) => {
	return (
		<Modal open={isOpened}>
			<div className="w-100v h-100v d-f ai-c jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
				<CircularProgress />
			</div>
		</Modal>
	);
};
