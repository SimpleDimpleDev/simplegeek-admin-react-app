import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useGetPreorderQuery } from "@api/admin/preorder";

export default function PreorderInspectRoute() {
	const navigate = useNavigate();
	const params = useParams();
	const preorderId = params.id;
	if (!preorderId) throw new Response("No preorder id provided", { status: 404 });

	const { data: preorder, isLoading: preorderIsLoading } = useGetPreorderQuery({ preorderId });

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
						<Typography variant="h4">Предзаказ {preorder.title}</Typography>
						{JSON.stringify(preorder)}
					</>
				)}
			</LoadingSpinner>
		</div>
	);
}
