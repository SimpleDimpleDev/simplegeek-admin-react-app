import { Add, DriveFolderUpload } from "@mui/icons-material";
import { Autocomplete, Button, Snackbar, TextField, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminTable from "@components/ManagementTable";
import { ExcelUploadModal } from "@routes/publication/table/ExcelUpload";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductGet } from "@appTypes/Product";
import { ProductListFilterSchema } from "@schemas/Product";
import { getImageUrl } from "@utils/image";
import { useGetPreorderListQuery } from "@api/admin/preorder";
import { useGetProductListQuery } from "@api/admin/product";
import { useMutationFeedback } from "@hooks/useMutationFeedback";
import { useSnackbar } from "@hooks/useSnackbar";
import { useUploadExcelMutation } from "@api/admin/utils";

const columns: GridColDef<ProductGet>[] = [
	{
		field: "title",
		headerName: "Название",
		display: "flex",
		renderCell: (params) => (
			<div className="gap-1 ai-c d-f fd-r">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
					<img
						src={params.row.images.at(0) ? getImageUrl(params.row.images[0].url, "small") : ""}
						className="contain"
					/>
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "category", headerName: "Категория", display: "flex", valueGetter: (_, row) => row.category.title },
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

type PublicationTarget =
	| {
			label: string;
			type: "STOCK";
	  }
	| {
			label: string;
			type: "PREORDER";
			preorderId: string;
	  };

export default function ProductTableRoute() {
	const navigate = useNavigate();

	const { filterString } = useParams();

	const productListFilter = useMemo(() => {
		let filter;
		if (filterString !== undefined) {
			const filterParseResult = ProductListFilterSchema.safeParse(filterString);
			if (filterParseResult.success) {
				filter = filterParseResult.data;
			}
		}
		return filter;
	}, [filterString]);

	const {
		data: productList,
		isLoading: productListIsLoading,
		isFetching: productListIsFetching,
	} = useGetProductListQuery({
		filter: productListFilter,
	});

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedProduct = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return productList?.items.find((product) => product.id === selectedItemId) || null;
	}, [selectedItemIds, productList]);

	const [publicationTarget, setPublicationTarget] = useState<PublicationTarget>({ type: "STOCK", label: "розницу" });
	const { data: preorderList } = useGetPreorderListQuery();

	const publicationTargets: PublicationTarget[] = useMemo(() => {
		const targets = [{ label: "розницу", type: "STOCK" } as PublicationTarget];
		if (preorderList?.items.length) {
			targets.push(
				...preorderList.items.map(
					(preorder) =>
						({
							label: `${preorder.title}`,
							type: "PREORDER",
							preorderId: preorder.id,
						} as PublicationTarget)
				)
			);
		}
		return targets;
	}, [preorderList]);

	const [excelUploadOpen, setExcelUploadOpen] = useState(false);
	const [uploadExcel, { isSuccess: uploadExcelIsSuccess, isError: uploadExcelIsError, error: uploadExcelError }] =
		useUploadExcelMutation();

	const { snackbarOpened, snackbarMessage, showSnackbarMessage, closeSnackbar } = useSnackbar();
	const closeExcelUpload = useCallback(() => setExcelUploadOpen(false), []);

	useMutationFeedback({
		title: "Загрузка Excel",
		isSuccess: uploadExcelIsSuccess,
		isError: uploadExcelIsError,
		error: uploadExcelError,
		feedbackFn: showSnackbarMessage,
		successAction: closeExcelUpload,
	});

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<Snackbar open={snackbarOpened} message={snackbarMessage} onClose={closeSnackbar} autoHideDuration={3000} />
			<ExcelUploadModal open={excelUploadOpen} onClose={() => setExcelUploadOpen(false)} onSubmit={uploadExcel} />
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Товары</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {productList?.items.length}
					</Typography>
				</div>
				<div className="gap-2 d-f fd-r">
					<Button variant="contained" onClick={() => setExcelUploadOpen(true)}>
						<DriveFolderUpload />
						Загрузить Excel
					</Button>
					<Button variant="contained" onClick={() => navigate("/product/create")}>
						<Add />
						Добавить товар
					</Button>
				</div>
			</div>

			<LoadingSpinner isLoading={productListIsLoading || productListIsFetching}>
				{!productList ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={productList?.items}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						headerButtons={
							<>
								<div className="gap-05 w-100 ai-c d-f fd-r jc-fe">
									<Button
										sx={{ width: "max-content", flexShrink: 0 }}
										fullWidth
										variant="contained"
										disabled={!selectedItemIds.length}
										onClick={() => {
											const productIdsParam = selectedItemIds
												.map((id) => `productId[]=${id}`)
												.join("&");
											navigate(
												`/publication/create/${
													publicationTarget.type === "STOCK"
														? "stock/"
														: `preorder/${publicationTarget.preorderId}/`
												}?${productIdsParam}`
											);
										}}
									>
										{selectedItemIds.length > 1
											? "Опубликовать вариативный товар"
											: "Опубликовать товар"}
									</Button>
									<Typography variant="subtitle0">в</Typography>
									<Autocomplete
										sx={{
											width: "24%"
										}}
										options={publicationTargets}
										renderInput={(params) => <TextField {...params} label="цель публикации" />}
										getOptionLabel={(option) => option.label}
										value={publicationTarget}
										onChange={(_, value) => {
											setPublicationTarget(value as PublicationTarget);
										}}
									/>
								</div>
							</>
						}
						leftHeaderButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedProduct}
									onClick={() => navigate(`/product/inspect/${selectedProduct?.id}`)}
								>
									Подробнее
								</Button>
								<Button
									variant="contained"
									disabled={!selectedProduct}
									onClick={() => navigate(`/product/edit/${selectedProduct?.id}`)}
								>
									Редактировать
								</Button>
							</>
						}
					/>
				)}
			</LoadingSpinner>
		</div>
	);
}
