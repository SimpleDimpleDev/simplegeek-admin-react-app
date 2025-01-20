import { Add, ChevronLeft } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminTable from "@components/ManagementTable";
import { CreditInfo } from "@appTypes/Payment";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PreorderGet } from "@appTypes/Preorder";
import { ProductGet } from "@appTypes/Product";
import { PublicationGet } from "@appTypes/Publication";
import { getImageUrl } from "@utils/image";
import { useGetPreorderQuery } from "@api/admin/preorder";
import { useGetPublicationListQuery } from "@api/admin/publication";

interface TableRowData {
	link: string;
	publicationId: string;
	variationIndex: number | null;
	product: ProductGet;
	price: number;
	discount: {
		type: "FIXED" | "PERCENTAGE";
		value: number;
	} | null;
	preorder: PreorderGet | null;
	creditInfo: CreditInfo | null;
	quantity: number | null;
	orderedQuantity: number;
	createdAt: Date;
	updatedAt: Date;
}

const columns: GridColDef<TableRowData>[] = [
	{
		field: "product",
		headerName: "Товар",
		display: "flex",
		valueGetter: (_, row) => row.product.title,
		renderCell: (params) => (
			<div className="gap-1 ai-c d-f fd-r">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
					<img
						className="contain"
						src={
							params.row.product.images.at(0)
								? getImageUrl(params.row.product.images[0].url, "small")
								: ""
						}
					/>
				</div>
				<Typography
					variant="body2"
					sx={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						WebkitLineClamp: 2,
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						maxWidth: "500px",
						color: "black",
					}}
				>
					{params.row.product.title}
				</Typography>
			</div>
		),
	},
	{
		field: "link",
		headerName: "Ссылка",
		display: "flex",
	},
	{
		field: "category",
		headerName: "Категория",
		display: "flex",
		valueGetter: (_, row) => row.product.category.title,
	},
	{
		field: "price",
		headerName: "Цена",
		display: "flex",
		type: "number",
		renderCell: (params) => `${params.row.price} ₽`,
	},
	// {
	// 	field: "type",
	// 	headerName: "Тип",
	// 	display: "flex",
	// 	valueGetter: (_, row) => {
	// 		if (!row.preorder) return "Розница";
	// 		return `Предзаказ: ${row.preorder.title}`;
	// 	},
	// },
	// {
	// 	field: "credit",
	// 	headerName: "Рассрочка",
	// 	display: "flex",
	// 	type: "boolean",
	// 	valueGetter: (_, row) => {
	// 		return !!row.creditInfo;
	// 	},
	// },
	{
		field: "quantity",
		headerName: "Остаток",
		display: "flex",
		type: "number",
		valueGetter: (_, row) => {
			if (row.quantity === null) return "∞";
			return row.quantity - row.orderedQuantity;
		},
		renderCell: (params) => {
			const quantity = params.row.quantity;
			if (quantity === null) return "∞";
			const restQuantity = quantity - params.row.orderedQuantity;
			if (restQuantity === 0)
				return (
					<Typography variant="body2" color="error">
						Нет в наличии
					</Typography>
				);
			return `${restQuantity} шт.`;
		},
	},
	{ field: "createdAt", headerName: "Создан", display: "flex", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", display: "flex", type: "dateTime" },
];

const formatPublications = (publications: PublicationGet[]): TableRowData[] => {
	return publications.flatMap((publication) => {
		return publication.items.map((item) => {
			return {
				link: publication.link,
				publicationId: publication.id,
				variationIndex: item.variationIndex,
				product: item.product,
				price: item.price,
				discount: item.discount,
				preorder: publication.preorder,
				creditInfo: item.creditInfo,
				quantity: item.quantity,
				orderedQuantity: item.orderedQuantity,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			};
		});
	});
};

export default function PreorderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const preorderId = params.id;
	if (!preorderId) throw new Response("No preorder id provided", { status: 404 });

	const { data: preorder, isLoading: preorderIsLoading } = useGetPreorderQuery({ preorderId });

	const { data: publicationsList, isLoading: publicationsListIsLoading } = useGetPublicationListQuery({ preorderId });

	const formattedPublications = useMemo(
		() => (publicationsList ? formatPublications(publicationsList.items) : undefined),
		[publicationsList]
	);

	const [selectedItemIds, setSelectedItemIds] = useState<GridRowSelectionModel>([]);

	const selectedPublication = useMemo(() => {
		if (selectedItemIds.length !== 1) return null;
		const selectedItemId = selectedItemIds[0];
		return (
			publicationsList?.items.find((publication) => {
				const selectedItemIdParts =
					typeof selectedItemId === "string" ? selectedItemId.split("?") : [selectedItemId];
				const publicationId = selectedItemIdParts[0];
				return publication.id === publicationId;
			}) || null
		);
	}, [selectedItemIds, publicationsList]);

	return (
		<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
			<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
				<ChevronLeft />
				Назад
			</Button>
			<LoadingSpinner isLoading={preorderIsLoading}>
				{!preorder ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<>
						<div className="p-2 d-f fd-r jc-sb">
							<div>
								<Typography variant="h5">Предзаказ {preorder.title}</Typography>
								<Typography variant="body2" color="typography.secondary">
									Количество публикаций: {formattedPublications?.length}
								</Typography>
							</div>
							<Button
								variant="contained"
								onClick={() => navigate(`/publication/create/preorder/${preorder.id}`)}
							>
								<Add />
								Добавить публикацию
							</Button>
						</div>
					</>
				)}
			</LoadingSpinner>
			<LoadingSpinner isLoading={publicationsListIsLoading}>
				{!formattedPublications ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Не удалось загрузить публикации предзаказа</Typography>
					</div>
				) : (
					<>
						<AdminTable
							columns={columns}
							data={formattedPublications}
							onRowSelect={setSelectedItemIds}
							selectedRows={selectedItemIds}
							getRowId={(item) => {
								const variationString = item.variationIndex !== null ? `?v=${item.variationIndex}` : "";
								return `${item.publicationId}${variationString}`;
							}}
							leftHeaderButtons={
								<>
									<Button
										variant="contained"
										disabled={!selectedPublication}
										onClick={() => {
											navigate(`/publication/inspect/${selectedItemIds.at(0)}`);
										}}
									>
										Подробнее
									</Button>
								</>
							}
						/>
					</>
				)}
			</LoadingSpinner>
		</div>
	);
}
