import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";

export default function OrderInspect() {
	const navigate = useNavigate();
	const params = useParams();
	const orderId = params.id;
	if (!orderId) throw new Response("No order id provided", { status: 404 });
	return (
		<div className="pt-4">
			<Button onClick={() => navigate("/order/table")} sx={{ width: "fit-content", color: "warning.main" }}>
				<ChevronLeft />К списку всех заказов
			</Button>
			<div className="py-2 px-2">
				<Typography variant="h5">Заказ {orderId}</Typography>
			</div>
		</div>
	);
}
