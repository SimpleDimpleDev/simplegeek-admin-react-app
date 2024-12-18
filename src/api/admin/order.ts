import {
	OrderEditablePropsGetSchema,
	OrderGetSchema,
	OrderListGetSchema,
	OrderUpdateDeliverySchema,
	OrderUpdateStatusSchema,
} from "@schemas/Order";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const orderApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		getOrder: build.query<z.infer<typeof OrderGetSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: "/admin/order",
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderGetSchema, response),
			providesTags: (_result, _error, { orderId }) => [{ type: "Order", id: orderId }],
		}),

		getOrderList: build.query<z.infer<typeof OrderListGetSchema>, void>({
			query: () => ({
				url: "/admin/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListGetSchema, response),
			providesTags: ["Order"],
		}),

		getOrderEditableProps: build.query<z.infer<typeof OrderEditablePropsGetSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: "/admin/order/editable-props",
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderEditablePropsGetSchema, response),
		}),

		updateOrderStatus: build.mutation<void, z.infer<typeof OrderUpdateStatusSchema>>({
			query: (body) => ({
				url: "/admin/order/status",
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }],
		}),

		updateOrderDelivery: build.mutation<void, z.infer<typeof OrderUpdateDeliverySchema>>({
			query: (body) => ({
				url: "/admin/order/delivery",
				method: "PATCH",
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }],
		}),

		issueSelfPickupOrders: build.mutation<void, { orderIds: string[] }>({
			query: ({ orderIds }) => ({
				url: "/admin/order/issue",
				method: "POST",
				body: { orderIds },
			}),
			invalidatesTags: (_result, _error, { orderIds }) => orderIds.map((id) => ({ type: "Order", id })),
		}),

		refundOrder: build.mutation<void, { orderId: string }>({
			query: ({ orderId }) => ({
				url: "/admin/order/refund",
				method: "POST",
				body: { orderId },
			}),
			invalidatesTags: (_result, _error, { orderId }) => [{ type: "Order", id: orderId }],
		}),
	}),
});

export const {
	useGetOrderQuery,
	useGetOrderListQuery,
	useGetOrderEditablePropsQuery,
	
	useUpdateOrderDeliveryMutation,
	useUpdateOrderStatusMutation,

	useIssueSelfPickupOrdersMutation,
	useRefundOrderMutation,
} = orderApi;
