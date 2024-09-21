import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useGetProductQuery } from "@api/admin/service";

export default function ProductUpdateRoute() {
	const params = useParams();
    const navigate = useNavigate();
	const productId = params.id;
	if (!productId) throw new Response("No product id provided", { status: 404 });
	const { data: product, isLoading: productIsLoading } = useGetProductQuery({ productId });
	return (
		<>
			<LoadingSpinner isLoading={productIsLoading}>
				<div className="h-100 d-f fd-c gap-2 px-3 pt-1 pb-4" style={{ minHeight: "100vh" }}>
					<Button
						onClick={() => navigate(-1)}
						sx={{ color: "warning.main", width: "fit-content" }}
					>
						<ChevronLeft />Назад
					</Button>
					{!product ? (
						<div className="w-100 h-100v d-f ai-c jc-c">
							<Typography variant="h5">Что-то пошло не так</Typography>
						</div>
					) : (
						<>Form here</>
					)}
				</div>
			</LoadingSpinner>
		</>
	);
}
