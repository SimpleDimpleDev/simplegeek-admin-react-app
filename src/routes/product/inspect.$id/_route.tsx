import { Button, Divider, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ActionDialog from "@components/ActionDialog";
import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { ProductAdmin } from "@appTypes/Product";
import { getImageUrl } from "@utils/image";
import { useGetProductQuery } from "@api/admin/service";
import { useState } from "react";

export default function ProductInspect() {
	const navigate = useNavigate();
	const params = useParams();
	const productId = params.id;
	if (!productId) throw new Response("No product id provided", { status: 404 });

	// @ts-expect-error ts(2589)
	const { data: product, isLoading: productIsLoading } = useGetProductQuery(
		{ productId },
		{ refetchOnMountOrArgChange: true }
	) as { data: ProductAdmin; isLoading: boolean };

	const [deletionConfirmDialogOpened, setDeletionConfirmDialogOpened] = useState(false);

	const deleteItem = async () => {
		// const response = await serverAdminApiClient.deleteAbstractItem(item.id);
		navigate("/product/table");
	};

	return (
		<>
			<ActionDialog
				title="Удалить товар?"
				helperText="Это действие невозможно  отменить"
				opened={deletionConfirmDialogOpened}
				onClose={() => setDeletionConfirmDialogOpened(false)}
				confirmButton={{
					text: "Удалить",
					onClick: deleteItem,
				}}
				declineButton={{
					text: "Отмена",
					onClick: () => setDeletionConfirmDialogOpened(false),
				}}
			/>

			<LoadingSpinner isLoading={productIsLoading}>
				<div className="h-100 d-f fd-c gap-2 px-3 pt-1 pb-4" style={{ minHeight: "100vh" }}>
					<Button
						onClick={() => navigate("/product/table")}
						sx={{ color: "warning.main", width: "fit-content" }}
					>
						<ChevronLeft />К списку всех товаров
					</Button>
					<div className="p-2">
						<Typography variant="h5">{product.title}</Typography>
					</div>
					<div className="d-f fd-r gap-2" style={{ width: "fit-content" }}>
						<Button onClick={() => navigate(`/product/edit/${product.id}`)} variant="contained">
							Редактировать
						</Button>
						<Button
							onClick={() => setDeletionConfirmDialogOpened(true)}
							variant="contained"
							color="error"
							sx={{ color: "surface.primary" }}
						>
							Удалить
						</Button>
					</div>
					<div className="w-100 d-f fd-r gap-2">
						<div className="w-100 d-f fd-c gap-1 p-3 br-3 bg-primary">
							<div className="d-f fd-c gap-1 py-1">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Категория
								</Typography>
								<Typography variant="subtitle0">{product.category.title}</Typography>
							</div>
							<div className="d-f fd-c gap-1 py-1">
								<Typography variant="body2" sx={{ color: "typography.secondary" }}>
									Есть в каталоге?
								</Typography>
								<Typography variant="subtitle0">{product.isPublished ? "Да" : "Нет"}</Typography>
							</div>
							<Typography variant="subtitle0">Физические свойства</Typography>
							{product.physicalProperties ? (
								<div className="d-f fd-r gap-1">
									<div className="w-100 d-f fd-c gap-1 py-1">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Длина
										</Typography>
										<Typography variant="subtitle0">
											{product.physicalProperties.length || "-"}
										</Typography>
									</div>
									<div className="w-100 d-f fd-c gap-1 py-1">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Ширина
										</Typography>
										<Typography variant="subtitle0">
											{product.physicalProperties.width || "-"}
										</Typography>
									</div>
									<div className="w-100 d-f fd-c gap-1 py-1">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Высота
										</Typography>
										<Typography variant="subtitle0">
											{product.physicalProperties.height || "-"}
										</Typography>
									</div>
									<div className="w-100 d-f fd-c gap-1 py-1">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Масса
										</Typography>
										<Typography variant="subtitle0">
											{product.physicalProperties.mass || "-"}
										</Typography>
									</div>
								</div>
							) : (
								<Typography variant="body2">Неизвестны</Typography>
							)}
						</div>
						<div className="w-100 d-f fd-c gap-1 p-3 br-3 bg-primary">
							<Typography variant="h5">Атрибуты</Typography>
							<div className="d-f fd-c gap-2">
								{product.filterGroups.map((filterGroup) => (
									<div>
										<div className="d-f fd-r jc-sb py-1" key={filterGroup.title}>
											<Typography variant="body1" sx={{ color: "typography.secondary" }}>
												{filterGroup.title}
											</Typography>
											<div>
												{filterGroup.filters.map((filter) => (
													<Typography variant="body1" sx={{ color: "warning.main" }}>
														{filter.value}
													</Typography>
												))}
											</div>
										</div>
										<Divider orientation="horizontal" flexItem />
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="w-100 d-f fd-c gap-3 p-3 pt-2 br-3 bg-primary">
						<Typography variant="h5">Фото товара</Typography>
						<div className="d-f fd-r gap-1" style={{ overflow: "auto" }}>
							{product.images.map((image, index) => (
								<div className="d-f br-2" style={{ width: "300px", height: "300px" }}>
									<img className="contain" src={getImageUrl(image, "medium")} alt={`img-${index}`} />
								</div>
							))}
						</div>
					</div>
					<div className="w-100 d-f fd-c gap-3 p-3 pt-2 br-3 bg-primary">
						<Typography variant="h5">Описание</Typography>
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							{product.description}
						</Typography>
					</div>
				</div>
			</LoadingSpinner>
		</>
	);
}
