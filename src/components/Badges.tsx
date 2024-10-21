import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";
import { StatusBadge } from "./StatusBadge";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
	CANCELLED: <StatusBadge color="icon.secondary">Отменен</StatusBadge>,
	UNPAID: <StatusBadge color="icon.attention">Не оплачен</StatusBadge>,
	ACCEPTED: <StatusBadge color="warning.main">Оформлен</StatusBadge>,
	DELIVERY: <StatusBadge color="primary.main">Передан в доставку</StatusBadge>,
	READY_FOR_PICKUP: <StatusBadge color="primary.main">Готов к выдаче</StatusBadge>,
	FINISHED: <StatusBadge color="typography.success">Завершён</StatusBadge>,
};

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
	NEW: <StatusBadge color="primary.main">Новый</StatusBadge>,
	FUNDING: <StatusBadge color="icon.brandSecondary">Сбор</StatusBadge>,
	WAITING_FOR_RELEASE: <StatusBadge color="icon.brandSecondary">Ожидание релиза</StatusBadge>,
	FOREIGN_SHIPPING: <StatusBadge color="icon.brandSecondary">Доставка на зарубежный склад</StatusBadge>,
	LOCAL_SHIPPING: <StatusBadge color="icon.brandSecondary">Доставка на склад РФ</StatusBadge>,
	DISPATCH: <StatusBadge color="icon.brandSecondary">На складе</StatusBadge>,
	FINISHED: <StatusBadge color="icon.brandSecondary">Завершен</StatusBadge>,
};
