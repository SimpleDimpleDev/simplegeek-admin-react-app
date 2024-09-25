import { OrderGetSchema } from "@schemas/Order";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const OrderListGetResponseSchema = z.object({
	items: OrderGetSchema.array(),
});

export const orderApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		getOrder: build.query<z.infer<typeof OrderGetSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/admin/order`,
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderGetSchema, response),
			providesTags: (_result, _error, { orderId }) => [{ type: "Order", id: orderId }],
		}),

		getOrderList: build.query<z.infer<typeof OrderListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListGetResponseSchema, response),
			providesTags: ["Order"],
		}),
	}),
});

export const { useGetOrderQuery, useGetOrderListQuery } = orderApi;
