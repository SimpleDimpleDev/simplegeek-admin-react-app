import { Chip } from "@mui/material";
import { InvoiceStatus } from "@appTypes/Payment";
import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
	CANCELLED: <Chip color="secondary" label="Отменен" />,
	UNPAID: <Chip color="error" label="Не оплачен" />,
	ACCEPTED: <Chip color="warning" label="Оформлен" />,
	DELIVERY: <Chip color="info" label="Передан в доставку" />,
	READY_FOR_PICKUP: <Chip color="success" label="Готов к выдаче" />,
	FINISHED: <Chip color="success" label="Выдан" />,
};

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
	NEW: <Chip color="primary" label="Новый" />,
	WAITING_FOR_RELEASE: <Chip color="warning" label="Ожидание релиза" />,
	FOREIGN_SHIPPING: <Chip color="info" label="Доставка на зарубежный склад" />,
	LOCAL_SHIPPING: <Chip color="info" label="Доставка на склад РФ" />,
	DISPATCH: <Chip color="success" label="На складе" />,
	FINISHED: <Chip color="success" label="Завершен" />,
};

export const InvoiceStatusBadges: Record<InvoiceStatus, JSX.Element> = {
	PAID: <Chip color="success" label="Оплачен" />,
	UNPAID: <Chip color="error" label="Не оплачен" />,
	REFUNDED: <Chip color="secondary" label="Произведён возврат" />,
	WAITING: <Chip color="warning" label="Ожидание ответа банка" />,
};
