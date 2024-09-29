import { Button, Divider, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import ActionDialog from "@components/ActionDialog";
import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { getImageUrl } from "@utils/image";
import { useGetProductQuery } from "@api/admin/product";
import { useState } from "react";

export default function ProductInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const productId = params.id;
	if (!productId) throw new Response("No product id provided", { status: 404 });

	const { data: product, isLoading: productIsLoading } = useGetProductQuery(
		{ productId },
		{ refetchOnMountOrArgChange: true }
	);

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
				<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
					<Button
						onClick={() => navigate(-1)}
						sx={{ color: "warning.main", width: "fit-content" }}
					>
						<ChevronLeft />Назад
					</Button>
					{!product ? (
						<div className="w-100 h-100v ai-c d-f jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>
							<div className="p-2">
								<Typography variant="h5">{product.title}</Typography>
							</div>
							<div className="gap-2 d-f fd-r" style={{ width: "fit-content" }}>
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
							<div className="gap-2 w-100 d-f fd-r">
								<div className="gap-1 bg-primary p-3 w-100 br-3 d-f fd-c">
									<div className="gap-1 py-1 d-f fd-c">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Категория
										</Typography>
										<Typography variant="subtitle0">{product.category.title}</Typography>
									</div>
									<div className="gap-1 py-1 d-f fd-c">
										<Typography variant="body2" sx={{ color: "typography.secondary" }}>
											Есть в каталоге?
										</Typography>
										<Typography variant="subtitle0">
											{product.isPublished ? "Да" : "Нет"}
										</Typography>
									</div>
									<Typography variant="subtitle0">Физические свойства</Typography>
									{product.physicalProperties ? (
										<div className="gap-1 d-f fd-r">
											<div className="gap-1 py-1 w-100 d-f fd-c">
												<Typography variant="body2" sx={{ color: "typography.secondary" }}>
													Длина
												</Typography>
												<Typography variant="subtitle0">
													{product.physicalProperties.length || "-"}
												</Typography>
											</div>
											<div className="gap-1 py-1 w-100 d-f fd-c">
												<Typography variant="body2" sx={{ color: "typography.secondary" }}>
													Ширина
												</Typography>
												<Typography variant="subtitle0">
													{product.physicalProperties.width || "-"}
												</Typography>
											</div>
											<div className="gap-1 py-1 w-100 d-f fd-c">
												<Typography variant="body2" sx={{ color: "typography.secondary" }}>
													Высота
												</Typography>
												<Typography variant="subtitle0">
													{product.physicalProperties.height || "-"}
												</Typography>
											</div>
											<div className="gap-1 py-1 w-100 d-f fd-c">
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
								<div className="gap-1 bg-primary p-3 w-100 br-3 d-f fd-c">
									<Typography variant="h5">Атрибуты</Typography>
									<div className="gap-2 d-f fd-c">
										{product.filterGroups.map((filterGroup) => (
											<div>
												<div className="py-1 d-f fd-r jc-sb" key={filterGroup.title}>
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
							<div className="gap-3 bg-primary p-3 pt-2 w-100 br-3 d-f fd-c">
								<Typography variant="h5">Фото товара</Typography>
								<div className="gap-1 d-f fd-r" style={{ overflow: "auto" }}>
									{product.images.map((image, index) => (
										<div className="br-2 d-f" style={{ width: "300px", height: "300px" }}>
											<img
												className="contain"
												src={getImageUrl(image.url, "medium")}
												alt={`img-${index}`}
											/>
										</div>
									))}
								</div>
							</div>
							<div className="gap-3 bg-primary p-3 pt-2 w-100 br-3 d-f fd-c">
								<Typography variant="h5">Описание</Typography>
								<Typography variant="body1" sx={{ color: "typography.secondary" }}>
									{product.description}
								</Typography>
							</div>
						</>
					)}
				</div>
			</LoadingSpinner>
		</>
	);
}
