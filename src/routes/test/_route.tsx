import { useEffect, useState } from "react";

import { OrderStatus } from "@appTypes/Order";
import { SelectConfirm } from "@components/SelectConfirm";
import { Typography } from "@mui/material";
import { orderStatusBadges } from "@components/Badges";

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

	return (
		<div className="gap-2 ai-c d-f fd-r">
			<Typography variant="subtitle0">Статус</Typography>

			<SelectConfirm
				options={orderStatusBadges}
				defaultOption={order?.status}
				onConfirm={(status) => updateStatus({ id: order?.id ?? "", status })}
			/>
		</div>
	);
}
