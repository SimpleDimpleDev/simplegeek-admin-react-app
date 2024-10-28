import { Divider, Stack, Typography } from "@mui/material";

import { DeliveryService } from "@appTypes/Delivery";
import { OrderDeliveryGetSchema } from "@schemas/Order";
import { z } from "zod";

const deliveryServiceMapping: Record<DeliveryService, string> = {
	CDEK: "СДЕК",
	SELF_PICKUP: "Самовывоз",
};

interface DeliveryInfoProps {
	delivery: z.infer<typeof OrderDeliveryGetSchema>;
}

export const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ delivery }) => {
	return (
		<Stack gap={1} direction={"column"} divider={<Divider orientation="horizontal" flexItem />}>
			<div className="gap-2 d-f fd-c">
				<Typography variant={"h6"}>Доставка</Typography>
				<div className={`d-f fd-r jc-sb`}>
					<div className="gap-05 w-100 d-f fd-c">
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Способ получения
						</Typography>
						<Typography variant="body1">{deliveryServiceMapping[delivery.service]}</Typography>
					</div>
					<div className="gap-05 w-100 d-f fd-c">
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Пункт выдачи
						</Typography>
						<Typography variant="body1">{delivery.point?.code}</Typography>
					</div>
				</div>
				<div className="gap-05 d-f fd-c">
					<Typography variant="body1" sx={{ color: "typography.secondary" }}>
						Адрес
					</Typography>
					<Typography variant="body1">{delivery.point?.address}</Typography>
				</div>
			</div>
			<div className="gap-2 d-f fd-c">
				<Typography variant="subtitle0">Получатель</Typography>
				<div className={`d-f fd-r jc-sb`}>
					<div className="gap-05 w-100 d-f fd-c">
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							ФИО
						</Typography>
						<Typography variant="subtitle0">{delivery.recipient.fullName}</Typography>
					</div>
					<div className="gap-05 w-100 d-f fd-c">
						<Typography variant="body1" sx={{ color: "typography.secondary" }}>
							Номер телефона
						</Typography>
						<Typography variant="body1">{delivery.recipient.phone}</Typography>
					</div>
				</div>
			</div>
		</Stack>
	);
};
