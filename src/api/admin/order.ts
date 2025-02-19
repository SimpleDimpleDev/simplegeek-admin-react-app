import {
	OrderEditablePropsGetSchema,
	OrderGetSchema,
	OrderListFilterSchema,
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
		}),
		getOrderList: build.query<z.infer<typeof OrderListGetSchema>, { filter?: z.infer<typeof OrderListFilterSchema>, userId?: string }>({
			query: ({ filter, userId }) => ({
				url: "/admin/order-list",
				method: "GET",
				params: {
					filter,
					userId,
				},
			}),
			transformResponse: (response) => validateData(OrderListGetSchema, response),
			providesTags: (_result, _error, { filter, userId }) => {
				if (userId) {
					return []
				} else {
					return [{ type: "Order", id: filter || "ALL" }]
				}
			},
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
			invalidatesTags: ["Order"],
		}),
		makeSelfPickupReady: build.mutation<void, { ids: string[] }>({
			query: ({ ids }) => ({
				url: "/admin/order/self-pickup-ready",
				method: "PATCH",
				body: { ids },
			}),
			invalidatesTags: ["Order"],
		}),
		updateOrderDelivery: build.mutation<void, z.infer<typeof OrderUpdateDeliverySchema>>({
			query: (body) => ({
				url: "/admin/order/delivery",
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Order"],
		}),

		issueSelfPickupOrders: build.mutation<void, { orderIds: string[] }>({
			query: ({ orderIds }) => ({
				url: "/admin/order/issue",
				method: "POST",
				body: { orderIds },
			}),
			invalidatesTags: ["Order"],
		}),

		refundOrder: build.mutation<void, { orderId: string }>({
			query: ({ orderId }) => ({
				url: "/admin/order/refund",
				method: "POST",
				body: { orderId },
			}),
			invalidatesTags: ["Order"],
		}),
	}),
});

export const {
	useGetOrderQuery,
	useGetOrderListQuery,
	useGetOrderEditablePropsQuery,

	useUpdateOrderDeliveryMutation,
	useMakeSelfPickupReadyMutation,
	useUpdateOrderStatusMutation,

	useIssueSelfPickupOrdersMutation,
	useRefundOrderMutation,
} = orderApi;
