import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Snackbar,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { LoadingOverlay } from "@components/LoadingOverlay";
import { PreorderGet } from "@appTypes/Preorder";
import { PublicationCreatePreorderForm } from "./preorderForm";
import { PublicationCreateStockForm } from "./stockForm";
import { useCreatePublicationMutation } from "@api/admin/publication";
import { useGetCategoryListQuery } from "@api/admin/category";
import { useGetProductListQuery } from "@api/admin/product";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";

export default function PublicationCreateRoute() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const productIds = useMemo(() => searchParams.getAll("productId[]"), [searchParams]);

	const { data: productList, isLoading: productListIsLoading } = useGetProductListQuery();
	const { data: categoryList, isLoading: categoryListIsLoading } = useGetCategoryListQuery();
	// TODO: fetch preorderList
	const { data: preorderList, isLoading: preorderListIsLoading } = {
		data: { items: [] as PreorderGet[] },
		isLoading: true,
	};
	const [createPublication, { isSuccess, isLoading, isError, error }] = useCreatePublicationMutation();

	const [publicationType, setPublicationType] = useState<"STOCK" | "PREORDER">("STOCK");
	const [publicationTypeChangeTo, setPublicationTypeChangeTo] = useState<"STOCK" | "PREORDER" | null>(null);
	const [formIsDirty, setFormIsDirty] = useState(false);
	const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();

	const showLoadingOverlay = isLoading;

	useMutationFeedback({
		title: "Создание публикации",
		isSuccess,
		isError,
		error,
		feedbackFn: showSnackbarMessage,
		successAction: () => {
			setTimeout(() => navigate("/publication/table"), 1500);
		},
	});

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
		<>
			<LoadingOverlay isOpened={showLoadingOverlay} />
			<Snackbar open={snackbarOpened} autoHideDuration={1500} onClose={closeSnackbar} message={snackbarMessage} />

			<Dialog open={confirmationIsOpen} onClose={() => handleRejectPublicationTypeChange()}>
				<DialogTitle>Если вы измените тип публикации, то все связанные с ней данные будут удалены.</DialogTitle>
				<DialogActions>
					<Button onClick={() => handleRejectPublicationTypeChange()}>Отмена</Button>
					<Button onClick={() => handleConfirmPublicationTypeChange()}>Подтвердить</Button>
				</DialogActions>
			</Dialog>

			<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
				<div className="p-2">
					<Typography variant="h5">Публикация товара</Typography>
				</div>

				<div className="section">
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
				</div>

				{publicationType === "STOCK" ? (
					<PublicationCreateStockForm
						productList={productList}
						productListIsLoading={productListIsLoading}
						categoryList={categoryList}
						categoryListIsLoading={categoryListIsLoading}
						productIds={productIds}
						onDirty={() => setFormIsDirty(true)}
						onSubmit={createPublication}
					/>
				) : (
					<PublicationCreatePreorderForm
						productList={productList}
						productListIsLoading={productListIsLoading}
						categoryList={categoryList}
						categoryListIsLoading={categoryListIsLoading}
						preorderList={preorderList}
						preorderListIsLoading={preorderListIsLoading}
						onDirty={() => setFormIsDirty(true)}
						onSubmit={createPublication}
					/>
				)}
			</div>
		</>
	);
}
