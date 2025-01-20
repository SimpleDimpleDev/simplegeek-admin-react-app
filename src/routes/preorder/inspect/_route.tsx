import { Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "@mui/icons-material";

const mockedPreorders = [
	{
		id: "1",
		title: "test",
		status: "NEW",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "DISPATCH", "FINISHED"],
	},
	{
		id: "2",
		title: "test2",
		status: "WAITING_FOR_RELEASE",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "DISPATCH", "FINISHED"],
	},
	{
		id: "3",
		title: "test3",
		status: "FOREIGN_SHIPPING",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "FOREIGN_SHIPPING", "DISPATCH", "FINISHED"],
	},
	{
		id: "4",
		title: "test4",
		status: "LOCAL_SHIPPING",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "LOCAL_SHIPPING", "DISPATCH", "FINISHED"],
	},
	{
		id: "5",
		title: "test5",
		status: "DISPATCH",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "DISPATCH", "FINISHED"],
	},
	{
		id: "6",
		title: "test6",
		status: "FINISHED",
		expectedArrival: "2023-01-01",
		createdAt: new Date(),
		updatedAt: new Date(),
		stages: ["NEW", "WAITING_FOR_RELEASE", "DISPATCH", "FINISHED"],
	},
]

export default function PreorderInspectRoute() {
	const navigate = useNavigate();
    const params = useParams();
    const preorderId = params.id;
	if (!preorderId) throw new Response("No preorder id provided", { status: 404 });

	const preorder = mockedPreorders.find((preorder) => preorder.id === preorderId);
	if (!preorder) throw new Response("Preorder not found", { status: 404 });

	return (
		<div className="gap-2 px-3 pt-1 pb-4 h-100 d-f fd-c" style={{ minHeight: "100vh" }}>
			<Button onClick={() => navigate(-1)} sx={{ color: "warning.main", width: "fit-content" }}>
				<ChevronLeft />
				Назад
			</Button>
			<Typography variant="h4">Предзаказ {preorder.title}</Typography>
			
		</div>
	);
}
