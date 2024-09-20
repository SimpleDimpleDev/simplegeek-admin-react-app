import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Snackbar,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { PublicationCreatePreorderForm } from "./preorderForm";
import { PublicationCreateStockForm } from "./stockForm";
import { useCreatePublicationMutation } from "@api/admin/service";
import { useNavigate } from "react-router-dom";

export default function PublicationCreate() {
	const navigate = useNavigate();

	const [createPublication, { isSuccess, isLoading, isError }] = useCreatePublicationMutation();

	// TODO: retrieve productIds to create from product table
	const productIds = undefined;

	const [publicationType, setPublicationType] = useState<"STOCK" | "PREORDER">("STOCK");
	const [publicationTypeChangeTo, setPublicationTypeChangeTo] = useState<"STOCK" | "PREORDER" | null>(null);
	const [formIsDirty, setFormIsDirty] = useState(false);
	const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
	const [successSnackBarOpened, setSuccessSnackBarOpened] = useState(false);
	const [errorSnackBarOpened, setErrorSnackBarOpened] = useState(false);

	useEffect(() => {
		if (isSuccess) {
			setSuccessSnackBarOpened(true);
			setTimeout(() => navigate("/publication/table"), 1500);
		}
	}, [isSuccess, setSuccessSnackBarOpened, navigate]);

	useEffect(() => {
		if (isError) {
			setErrorSnackBarOpened(true);
		}
	}, [isError, setErrorSnackBarOpened]);

	const handleChangePublicationType = (type: "STOCK" | "PREORDER") => {
		if (formIsDirty) {
			setConfirmationIsOpen(true);
			setPublicationTypeChangeTo(type);
		} else {
			setPublicationType(type);
			setPublicationTypeChangeTo(null);
		}
	};

	const handleConfirmPublicationTypeChange = () => {
		if (publicationTypeChangeTo) {
			setPublicationType(publicationTypeChangeTo);
			setPublicationTypeChangeTo(null);
			setFormIsDirty(false);
			setConfirmationIsOpen(false);
		}
	};

	const handleRejectPublicationTypeChange = () => {
		setPublicationTypeChangeTo(null);
		setConfirmationIsOpen(false);
	};

	return (
		<div className="h-100 d-f fd-c px-3 pt-1 pb-4" style={{ minHeight: "100vh" }}>
			{isLoading && (
				<Modal open={true}>
					<div className="w-100v h-100v d-f ai-c jc-c" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
						<CircularProgress />
					</div>
				</Modal>
			)}
			<Snackbar
				open={successSnackBarOpened}
				autoHideDuration={1500}
				onClose={() => setSuccessSnackBarOpened(false)}
				message="Публикация создана!"
			/>

			<Snackbar
				open={errorSnackBarOpened}
				autoHideDuration={1500}
				onClose={() => setErrorSnackBarOpened(false)}
				message="Произошла ошибка при создании публикации"
			/>

			<Dialog open={confirmationIsOpen} onClose={() => handleRejectPublicationTypeChange()}>
				<DialogTitle>Если вы измените тип публикации, то все связанные с ней данные будут удалены.</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleRejectPublicationTypeChange()}>Отмена</Button>
					<Button onClick={() => handleConfirmPublicationTypeChange()}>Подтвердить</Button>
				</DialogActions>
			</Dialog>

			<div className="p-2">
				<Typography variant="h5">Публикация товара</Typography>
			</div>

			<FormControl fullWidth>
				<InputLabel id="publication-type">Тип публикации</InputLabel>
				<Select
					labelId="publication-type"
					label="Тип публикации"
					variant="outlined"
					fullWidth
					value={publicationType}
					onChange={(e) => handleChangePublicationType(e.target.value as "STOCK" | "PREORDER")}
				>
					<MenuItem value="STOCK">Розница</MenuItem>
					<MenuItem value="PREORDER">Предзаказ</MenuItem>
				</Select>
			</FormControl>

			<div className="w-100 d-f p-3 bg-secondary br-3">
				{publicationType === "STOCK" ? (
					<PublicationCreateStockForm
						productIds={productIds}
						onDirty={() => setFormIsDirty(true)}
						onSubmit={createPublication}
					/>
				) : (
					<PublicationCreatePreorderForm onDirty={() => setFormIsDirty(true)} onSubmit={createPublication} />
				)}
			</div>
		</div>
	);
}
