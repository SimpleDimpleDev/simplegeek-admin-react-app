import {
	OrderAdminSchema,
	OrderCreateSchema,
	OrderItemAdminSchema,
	OrderItemShopSchema,
	OrderShopSchema,
	OrderStatusSchema,
} from "@schemas/Order";

import { z } from "zod";

export type OrderCreate = z.infer<typeof OrderCreateSchema>;
export type OrderItemShop = z.infer<typeof OrderItemShopSchema>;
export type OrderShop = z.infer<typeof OrderShopSchema>;
export type OrderItemAdmin = z.infer<typeof OrderItemAdminSchema>;
export type OrderAdmin = z.infer<typeof OrderAdminSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
