import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { OrderGetSchema } from "@schemas/Order";
import { validateData } from "@utils/validation";
import { z } from "zod";

const OrderListGetResponseSchema = z.object({
	items: OrderGetSchema.array(),
});

export const orderApi = createApi({
	reducerPath: "orderApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
	tagTypes: ["Order"],
	endpoints: (builder) => ({
		getOrder: builder.query<z.infer<typeof OrderGetSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/admin/order`,
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderGetSchema, response),
			providesTags: (_result, _error, { orderId }) => [{ type: "Order", id: orderId }],
		}),

		getOrderList: builder.query<z.infer<typeof OrderListGetResponseSchema>, void>({
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
