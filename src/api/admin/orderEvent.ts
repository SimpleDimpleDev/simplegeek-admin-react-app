import { OrderEventCreateSchema, OrderEventListGetSchema } from "@schemas/OrderEvent";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const orderEventApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createOrderEvent: build.mutation<void, z.infer<typeof OrderEventCreateSchema>>({
			query: (data) => ({
				url: `admin/order/events`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: (_result, _error, { orderId }) => [{ type: "OrderEvents", id: orderId }],
		}),
		getOrderEventList: build.query<z.infer<typeof OrderEventListGetSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `admin/order/events`,
				method: "GET",
				params: { orderId },
			}),
			transformResponse: (response) => validateData(OrderEventListGetSchema, response),
			transformErrorResponse: (response) => {
				if (response.status === 404) {
					return null;
				}
				return undefined;
			},
			providesTags: (_result, _error, { orderId }) => [{ type: "OrderEvents", id: orderId }],
		}),
	}),
});

export const { useCreateOrderEventMutation, useGetOrderEventListQuery } = orderEventApi;
