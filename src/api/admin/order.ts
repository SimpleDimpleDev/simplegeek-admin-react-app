import { OrderGetSchema, OrderStatusSchema, OrderUpdateDeliverySchema, OrderUpdateStatusSchema } from "@schemas/Order";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const OrderListGetResponseSchema = z.object({
	items: OrderGetSchema.array(),
});

const OrderEditablePropsResponseSchema = z.object({
	delivery: z.boolean(),
	statuses: OrderStatusSchema.array(),
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

		getOrderEditableProps: build.query<z.infer<typeof OrderEditablePropsResponseSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/admin/order/editable-props`,
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderEditablePropsResponseSchema, response),
		}),

		updateOrderStatus: build.mutation<void, z.infer<typeof OrderUpdateStatusSchema>>({
			query: (body) => ({
				url: `/admin/order/status`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }],
		}),

		updateOrderDelivery: build.mutation<void, z.infer<typeof OrderUpdateDeliverySchema>>({
			query: (body) => ({
				url: `/admin/order/delivery`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }],
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

export const {
	useGetOrderQuery,
	useGetOrderEditablePropsQuery,
	useUpdateOrderDeliveryMutation,
	useUpdateOrderStatusMutation,
	useGetOrderListQuery,
} = orderApi;
