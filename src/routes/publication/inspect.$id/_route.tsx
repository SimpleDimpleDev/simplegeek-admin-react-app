import { Button, Divider, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { DateFormatter } from "@utils/format";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { getImageUrl } from "@utils/image";
import { useGetPublicationQuery } from "@api/admin/publication";

export default function PublicationInspect() {
	const navigate = useNavigate();
	const params = useParams();
	const publicationId = params.id;
	if (!publicationId) {
		throw new Response("No publication id provided", { status: 404 });
	}

	const { data: publication, isLoading: publicationIsLoading } = useGetPublicationQuery({ publicationId });

	return (
		<>
			<div className="h-100 d-f fd-c gap-2 px-3 py-4 pb-4" style={{ minHeight: "100vh" }}>
				<Button
					onClick={() => navigate(-1)}
					sx={{ color: "warning.main", width: "fit-content" }}
				>
					<ChevronLeft />Назад
				</Button>
				<div className="p-2">
					<Typography variant="h5">Публикация</Typography>
				</div>
				<Button onClick={() => navigate(`/publication/edit/${publicationId}`)} variant="contained">
					Редактировать
				</Button>

				<LoadingSpinner isLoading={publicationIsLoading}>
					{!publication ? (
						<div className="w-100 h-100v d-f ai-c jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>
							<div className="w-100 d-f fd-r jc-sb p-3 br-3 bg-primary">
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
							{publication.items.map((variation) => (
								<div className="w-100 d-f fd-с gap-2 p-3 br-3 bg-primary">
									<Stack
										direction="row"
										alignItems="center"
										justifyContent="space-between"
										divider={<Divider />}
									>
										<div className="d-f fd-c gap-1">
											<Typography variant="subtitle0">{variation.product.title}</Typography>
											<img
												src={getImageUrl(variation.product.images.at(0)?.url || "", "small")}
												style={{ width: 40, height: 40, objectFit: "cover" }}
											/>
										</div>
										<div className="d-f fd-c gap-1 py-1">
											<Typography variant="body2" sx={{ color: "typography.secondary" }}>
												Цена
											</Typography>
											<Typography variant="subtitle0">{variation.price}₽</Typography>
										</div>
										<div className="d-f fd-c gap-1 py-1">
											<Typography variant="body2" sx={{ color: "typography.secondary" }}>
												Количество
											</Typography>
											<Typography variant="subtitle0">{variation.quantity}</Typography>
										</div>
									</Stack>
								</div>
							))}
						</>
					)}
				</LoadingSpinner>
			</div>
		</>
	);
}
