import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Add } from "@mui/icons-material";
import AdminTable from "@components/ManagementTable";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductGet } from "@appTypes/Product";
import { ProductListFilterSchema } from "@schemas/Product";
import { getImageUrl } from "@utils/image";
import { useGetProductListQuery } from "@api/admin/product";

const columns: GridColDef<ProductGet>[] = [
	{
		field: "title",
		headerName: "Название",
		display: "flex",
		renderCell: (params) => (
			<div className="gap-1 ai-c d-f fd-r">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
					<img src={getImageUrl(params.row.images[0].url, "small")} className="contain" />
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "category", headerName: "Категория", display: "flex", valueGetter: (_, row) => row.category.title },
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

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

	return (
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<div className="p-2 d-f fd-r jc-sb">
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
								<Button
									variant="contained"
									disabled={!selectedItemIds.length}
									onClick={() => {
										const productIdsParam = selectedItemIds
											.map((id) => `productId[]=${id}`)
											.join("&");
										navigate(`/publication/create?${productIdsParam}`);
									}}
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
