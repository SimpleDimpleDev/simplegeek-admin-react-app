import { Button, Typography } from "@mui/material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import AdminTable from "@routes/table";
import { ChevronLeft } from "@mui/icons-material";
import { DateFormatter } from "@utils/format";
import { GridColDef } from "@mui/x-data-grid";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useGetPublicationQuery } from "@api/admin/service";
import { useState } from "react";

const cols: GridColDef[] = [
	{
		field: "title",
		headerName: "Товар",
		renderCell: (params) => (
			<div className="d-f fd-r gap-1 ai-c">
				<div style={{ height: 40, width: 40, borderRadius: 6, overflow: "hidden" }}>
					<img className="contain" src={params.row.imageUrl} />
				</div>
				{params.row.title}
			</div>
		),
	},
	{ field: "isActive", headerName: "Активен", type: "boolean" },
	{ field: "price", headerName: "Цена", type: "number", renderCell: (params) => `${params.row.price} ₽` },
	{
		field: "quantity",
		headerName: "Количество",
		type: "number",
		renderCell: (params) => `${params.row.quantity} шт.`,
	},
	{
		field: "discount",
		headerName: "Скидка",
		type: "number",
		renderCell: (params) => (params.row.discount ? `${params.row.discount} %` : "-"),
	},
	{
		field: "hasCredit",
		headerName: "Рассрочка",
		type: "boolean",
	},
];

export default function PublicationInspect() {
	const navigate = useNavigate();
	const params = useParams();
	const publicationId = params.id;
	if (!publicationId) {
		throw new Response("No publication id provided", { status: 404 });
	}
	const [searchParams] = useSearchParams();
	const variationIndexParamString = searchParams.get("v");
	const variationIndexParam = variationIndexParamString ? parseInt(variationIndexParamString) : undefined;

	const { data: publication, isLoading: publicationIsLoading } = useGetPublicationQuery({ publicationId });

	const variations = publication?.items || [];
	const singleVariation = variations.length === 1;
	const [variationIndex, setVariationIndex] = useState<number>(variationIndexParam ?? 0);

	const currentVariation = variations[variationIndex];

	return (
		<div className="h-100 d-f fd-c gap-2 px-3 py-4 pb-4" style={{ minHeight: "100vh" }}>
			<Button
				onClick={() => navigate("/catalog-item/table")}
				sx={{ color: "warning.main", width: "fit-content" }}
			>
				<ChevronLeft />К списку товаров каталога
			</Button>
			<div className="p-2">
				<Typography variant="h5">Публикация</Typography>
			</div>

			<LoadingSpinner isLoading={publicationIsLoading}>
				{!publication ? (
					<div className="w-100 h-100v d-f ai-c jc-c">
						<Typography variant="h5">Что-то пошло не так</Typography>
					</div>
				) : (
					<>
						<div className="w-100 d-f fd-c gap-1 p-3 br-3 bg-primary">
							<div className="d-f fd-c gap-1 py-1">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Ссылка
								</Typography>
								<Typography variant="subtitle0">{publication.link}</Typography>
							</div>
							<div className="d-f fd-c gap-1 py-1">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Категория
								</Typography>
								<Typography variant="subtitle0">
									{publication.items.at(0)?.product.category.title}
								</Typography>
							</div>
							<div className="d-f fd-c gap-1 py-1">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Дата публикации
								</Typography>
								<Typography variant="subtitle0">
									{DateFormatter.DDMMYYYY(publication.createdAt)}
								</Typography>
							</div>
						</div>
						<div>Current variation product title: {currentVariation?.product.title}</div>
						{!singleVariation && (
							<>
								<Typography variant="h6">Вариации</Typography>
								<AdminTable
									columns={cols}
									data={variations}
									onRowSelect={(newIds) => {
										console.log("newIds", newIds);
										const newId = newIds.filter((i) => i !== variationIndex).at(0);
										console.log("newId", newId);
										if (newId !== undefined) {
											setVariationIndex(newId as number);
										}
									}}
									selectedRows={[variationIndex]}
									headerButtons={<></>}
								/>
							</>
						)}
					</>
				)}
			</LoadingSpinner>
		</div>
	);
}
