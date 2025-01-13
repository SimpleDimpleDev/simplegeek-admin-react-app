import { Check, Close } from "@mui/icons-material";
import { IconButton, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { OrderStatus } from "@appTypes/Order";
import { orderStatusBadges } from "@components/Badges";
import { orderStatusTitles } from "src/constants";

export default function TestRoute() {
	const [order, setOrder] = useState<{ id: string; status: OrderStatus } | undefined>(undefined);
	const updateStatus = (status: { id: string; status: OrderStatus }) => {
		console.log("update", status);
		setTimeout(() => setOrder(status), 1000);
	};

	useEffect(() => {
		setTimeout(() => {
			setOrder({
				id: "1",
				status: "ACCEPTED",
			});
		}, 3000);
	}, []);

	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "UNDEFINED">("UNDEFINED");

	const statusChanged = useMemo(() => order?.status !== selectedStatus, [order?.status, selectedStatus]);

	useEffect(() => {
		if (order) {
			setSelectedStatus(order.status);
		}
	}, [order]);

	const handleSelectStatus = (event: SelectChangeEvent) => {
		setSelectedStatus(event.target.value as OrderStatus);
	};

	const handleSaveStatus = () => {
		if (!order) return;
		if (selectedStatus === "UNDEFINED") return;
		updateStatus({
			id: order.id,
			status: selectedStatus,
		});
	};

	const handleCancelEditStatus = useCallback(() => {
		setSelectedStatus(order?.status ?? "UNDEFINED");
	}, [order?.status]);

	return (
		<div className="gap-2 ai-c d-f fd-r">
			<Typography variant="subtitle0">Статус</Typography>

			<Select disabled={selectedStatus === "UNDEFINED"} value={selectedStatus} onChange={handleSelectStatus}>
				{selectedStatus === "UNDEFINED" && <MenuItem value="UNDEFINED">Загрузка</MenuItem>}
				{Array.from(orderStatusTitles.entries()).map(([status]) => (
					<MenuItem key={status} value={status}>
						{orderStatusBadges[status]}
					</MenuItem>
				))}
			</Select>
			{selectedStatus !== "UNDEFINED" && statusChanged && (
				<>
					<IconButton sx={{ color: "success.main" }} onClick={handleSaveStatus}>
						<Check />
					</IconButton>
					<IconButton sx={{ color: "error.main" }} onClick={handleCancelEditStatus}>
						<Close />
					</IconButton>
				</>
			)}
		</div>
	);
}
