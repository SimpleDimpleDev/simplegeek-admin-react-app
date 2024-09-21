import { OrderCreateSchema, OrderGetSchema, OrderItemGetSchema, OrderStatusSchema } from "@schemas/Order";

import { z } from "zod";

export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderItemGet = z.infer<typeof OrderItemGetSchema>;
export type OrderGet = z.infer<typeof OrderGetSchema>;
