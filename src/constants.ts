import { UserRole, UserState } from "@appTypes/User";

import { DeliveryService } from "@appTypes/Delivery";
import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";

export const userRoleTitles: Map<UserRole, string> = new Map([
	["Admin", "Администратор"],
	["Customer", "Покупатель"],
]);

export const userStateTitles: Map<UserState, string> = new Map([
	["active", "Активен"],
	["inactive", "Неактивен"],
]);

export const orderStatusTitles: Map<OrderStatus, string> = new Map([
	["CANCELLED", "Отменен"],
	["UNPAID", "Не оплачен"],
	["ACCEPTED", "Оформлен"],
	["DELIVERY", "Передан в доставку"],
	["READY_FOR_PICKUP", "Готов к выдаче"],
	["FINISHED", "Доставлен"],
]);

export const preorderStatusTitles: Map<PreorderStatus, string> = new Map([
	["NEW", "Новый"],
	["FUNDING", "Сбор"],
	["WAITING_FOR_RELEASE", "Ожидание релиза"],
	["FOREIGN_SHIPPING", "Доставка на зарубежный склад"],
	["LOCAL_SHIPPING", "Доставка на склад РФ"],
	["DISPATCH", "На складе"],
	["FINISHED", "Завершен"],
]);

export const deliveryServiceTitles: Map<DeliveryService | "UNASSIGNED", string> = new Map([
	["UNASSIGNED", "Не оформлена"],
	["SELF_PICKUP", "Самовывоз"],
	["CDEK", "СДЭК"],
]);
