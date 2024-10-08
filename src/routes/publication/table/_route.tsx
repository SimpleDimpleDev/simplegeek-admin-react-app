import { Button, Typography } from "@mui/material";
import { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useState } from "react";

import { Add } from "@mui/icons-material";
import AdminTable from "@components/ManagementTable";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { PublicationGet } from "@appTypes/Publication";
import { getImageUrl } from "@utils/image";
import { useGetPublicationListQuery } from "@api/admin/publication";
import { useNavigate } from "react-router-dom";

const columns: GridColDef[] = [
	{
		field: "productTitle",
		headerName: "Товар",
		renderCell: (params) => (
			<div className="gap-1 ai-c d-f fd-r">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden" }}>
					<img className="contain" src={params.row.imageUrl} />
				</div>
				{params.row.productTitle}
			</div>
		),
	},
	{ field: "categoryTitle", headerName: "Категория" },
	{ field: "price", headerName: "Цена", type: "number", renderCell: (params) => `${params.row.price} ₽` },
	{
		field: "preorderTitle",
		headerName: "Предзаказ",
	},
	{
		field: "hasCredit",
		headerName: "Рассрочка",
		type: "boolean",
	},
	{
		field: "quantity",
		headerName: "Количество",
		type: "number",
		renderCell: (params) => (params.row.quantity ? `${params.row.quantity} шт.` : "Неограниченно"),
	},
	{ field: "hasVariations", headerName: "Есть вариации", type: "boolean" },
	{ field: "createdAt", headerName: "Создан", type: "dateTime" },
	{ field: "updatedAt", headerName: "Обновлен", type: "dateTime" },
];

interface TableRowData {
	publicationId: string;
	variationIndex: number | null;
	productTitle: string;
	imageUrl: string;
	categoryTitle: string;
	price: number;
	discount: {
		type: "FIXED" | "PERCENT";
		value: number;
	} | null;
	preorderTitle: string;
	hasCredit: boolean;
	quantity: number | null;
	hasVariations: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const formatPublications = (publications: PublicationGet[]): TableRowData[] => {
	return publications.flatMap((publication) => {
		return publication.items.map((item) => {
			return {
				publicationId: publication.id,
				variationIndex: item.variationIndex,
				productTitle: item.product.title,
				imageUrl: getImageUrl(item.product.images.at(0)?.url || "", "small"),
				categoryTitle: item.product.category.title,
				price: item.price,
				discount: item.discount,
				preorderTitle: publication.preorder?.title || "Розница",
				hasCredit: item.creditInfo ? true : false,
				quantity: item.quantity,
				hasVariations: publication.items.length > 1 ? true : false,
				createdAt: item.createdAt,
				updatedAt: item.updatedAt,
			};
		});
	});
};

export default function PublicationTableRoute() {
	const navigate = useNavigate();

	const { data: publicationsList, isLoading: publicationsListIsLoading } = useGetPublicationListQuery();

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
		<div className="px-3 pt-1 pb-4 h-100v d-f fd-c">
			<div className="p-2 d-f fd-r jc-sb">
				<div>
					<Typography variant="h5">Каталог</Typography>
					<Typography variant="body2" color="typography.secondary">
						Количество публикаций: {formattedPublications?.length}
					</Typography>
				</div>
				<Button variant="contained" onClick={() => navigate("/publication/create")}>
					<Add />
					Добавить публикацию
				</Button>
			</div>
			<LoadingSpinner isLoading={publicationsListIsLoading}>
				{!formattedPublications ? (
					<div className="w-100 h-100v ai-c d-f jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<AdminTable
						columns={columns}
						data={formattedPublications}
						onRowSelect={setSelectedItemIds}
						selectedRows={selectedItemIds}
						getRowId={(item) => {
							const variationString = item.variationIndex !== null ? `?v=${item.variationIndex}` : "";
							return `${item.publicationId}${variationString}`;
						}}
						headerButtons={
							<>
								<Button
									variant="contained"
									disabled={!selectedItemIds.length}
									onClick={() => console.log("disabled", selectedItemIds)}
								>
									{selectedItemIds.length > 1 ? "Скрыть публикацию" : "Скрыть публикации"}
								</Button>
							</>
						}
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
				)}
			</LoadingSpinner>
		</div>
	);
}
