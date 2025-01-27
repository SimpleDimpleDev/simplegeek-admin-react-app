import { Chip, Tooltip } from "@mui/material";

import { InvoiceStatus } from "@appTypes/Payment";
import { OrderStatus } from "@appTypes/Order";
import { PreorderStatus } from "@appTypes/Preorder";

export const orderStatusBadges: Record<OrderStatus, JSX.Element> = {
    CANCELLED: (
        <Tooltip title="Отменен">
            <Chip color="secondary" label="Отменен" />
        </Tooltip>
    ),
    UNPAID: (
        <Tooltip title="Не оплачен">
            <Chip color="error" label="Не оплачен" />
        </Tooltip>
    ),
    ACCEPTED: (
        <Tooltip title="Оформлен">
            <Chip color="warning" label="Оформлен" />
        </Tooltip>
    ),
    DELIVERY: (
        <Tooltip title="Передан в доставку">
            <Chip color="info" label="Передан в доставку" />
        </Tooltip>
    ),
    READY_FOR_PICKUP: (
        <Tooltip title="Готов к выдаче">
            <Chip color="success" label="Готов к выдаче" />
        </Tooltip>
    ),
    FINISHED: (
        <Tooltip title="Выдан">
            <Chip color="success" label="Выдан" />
        </Tooltip>
    ),
};

export const preorderStatusBadges: Record<PreorderStatus, JSX.Element> = {
    NEW: (
        <Tooltip title="Новый">
            <Chip color="primary" label="Новый" />
        </Tooltip>
    ),
    WAITING_FOR_RELEASE: (
        <Tooltip title="Ожидание релиза">
            <Chip color="warning" label="Ожидание релиза" />
        </Tooltip>
    ),
    FOREIGN_SHIPPING: (
        <Tooltip title="Доставка на зарубежный склад">
            <Chip color="info" label="Доставка на зарубежный склад" />
        </Tooltip>
    ),
    LOCAL_SHIPPING: (
        <Tooltip title="Доставка на склад РФ">
            <Chip color="info" label="Доставка на склад РФ" />
        </Tooltip>
    ),
    DISPATCH: (
        <Tooltip title="На складе">
            <Chip color="success" label="На складе" />
        </Tooltip>
    ),
    FINISHED: (
        <Tooltip title="Завершен">
            <Chip color="success" label="Завершен" />
        </Tooltip>
    ),
};

export const invoiceStatusBadges: Record<InvoiceStatus, JSX.Element> = {
    PAID: (
        <Tooltip title="Оплачен">
            <Chip color="success" label="Оплачен" />
        </Tooltip>
    ),
    UNPAID: (
        <Tooltip title="Не оплачен">
            <Chip color="error" label="Не оплачен" />
        </Tooltip>
    ),
    REFUNDED: (
        <Tooltip title="Произведён возврат">
            <Chip color="secondary" label="Произведён возврат" />
        </Tooltip>
    ),
    WAITING: (
        <Tooltip title="Ожидание ответа банка">
            <Chip color="warning" label="Ожидание ответа банка" />
        </Tooltip>
    ),
};
