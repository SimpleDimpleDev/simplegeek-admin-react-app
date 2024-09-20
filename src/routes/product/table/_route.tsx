import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate, useSubmit } from "react-router-dom";

import { Add } from "@mui/icons-material";
import AdminTable from "@routes/table";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { getImageUrl } from "@utils/image";
import { useGetProductListQuery } from "@api/admin/service";

const columns: GridColDef[] = [
	{
		field: "title",
		headerName: "Название",
		renderCell: (params) => (
			<div className="d-f fd-r gap-1 ai-c">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden" }}>
					<img src={getImageUrl(params.row.images[0], "small")} className="contain" />
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "category", headerName: "Категория" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
	{ field: "isPublished", headerName: "Есть в публикации", type: "boolean" },
];

export default function ProductTable() {
	const submit = useSubmit();
	const navigate = useNavigate();

	const { data: productList, isLoading: productListIsLoading } = useGetProductListQuery();

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedProduct = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return productList?.items.find((product) => product.id === selectedItemId) || null;
	}, [selectedItemIds, productList]);
	
	return (
		<div className="h-100v d-f fd-c px-3 pt-1 pb-4">
			<div className="d-f fd-r jc-sb p-2">
				<div>
					<Typography variant="h5">Товары</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество: {productList?.items.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => navigate("/product/create")}>
					<Add />
					Добавить товар
				</Button>
			</div>

			<LoadingSpinner isLoading={productListIsLoading}>
				{!productList ? (
					<div className="w-100 h-100v d-f ai-c jc-c">
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
								<Button
									variant="contained"
									disabled={!selectedItemIds.length}
									onClick={() =>
										submit(
											{ productIds: JSON.stringify(selectedItemIds) },
											{ method: "post", action: "/admin/publication/create" }
										)
									}
								>
									{selectedItemIds.length > 1
										? "Опубликовать вариативный товар"
										: "Опубликовать товар"}
								</Button>
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
