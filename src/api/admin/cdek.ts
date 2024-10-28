import { CDEKTokenGetSchema, CDEKWaybillCreateSchema, CDEKWaybillGetSchema } from "@schemas/CDEK";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const deliveryCDEKApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createCDEKWaybill: build.mutation<void, z.infer<typeof CDEKWaybillCreateSchema>>({
			query: (body) => ({
				url: "/admin/delivery/cdek/waybill",
				method: "POST",
				body,
			}),
		}),
		createCDEKWaybillPrint: build.mutation<void, { deliveryId: string, orderId: string }>({
			query: (params) => ({
				url: "/admin/delivery/cdek/waybill/print",
				method: "POST",
				params: params,
			}),
		}),
		getCDEKWaybill: build.query<z.infer<typeof CDEKWaybillGetSchema>, { deliveryId: string }>({
			query: ({ deliveryId }) => ({
				url: "/admin/delivery/cdek/waybill",
				params: { deliveryId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(CDEKWaybillGetSchema, response),
		}),
		getCDEKToken: build.query<z.infer<typeof CDEKTokenGetSchema>, void>({
			query: () => ({
				url: "/admin/delivery/cdek/token",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CDEKTokenGetSchema, response),
		}),
	}),
});

export const {
	useCreateCDEKWaybillMutation,
	useCreateCDEKWaybillPrintMutation,
	useLazyGetCDEKWaybillQuery,
	useLazyGetCDEKTokenQuery,
} = deliveryCDEKApi;
