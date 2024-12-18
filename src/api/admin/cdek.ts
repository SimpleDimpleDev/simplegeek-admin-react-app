import { CDEKWaybillCreateSchema, CDEKWaybillGetSchema } from "@schemas/CDEK";

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
		createCDEKWaybillPrint: build.mutation<void, { deliveryId: string; orderId: string }>({
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
		getCDEKWaybillPrint: build.query<Blob, { deliveryId: string; orderId: string }>({
			query: (params) => ({
				url: "/admin/delivery/cdek/waybill/print",
				params: params,
				method: "GET",
				headers: { "Content-Type": "application/pdf" },
			}),
			transformResponse: (response: Response) => {
				return response.blob(); // Convert the response to a Blob
			},
		}),
	}),
});

export const {
	useCreateCDEKWaybillMutation,
	useCreateCDEKWaybillPrintMutation,
	useGetCDEKWaybillQuery,
	useLazyGetCDEKWaybillQuery,
} = deliveryCDEKApi;

export const downloadCDEKWaybillPrint = async ({
	orderId,
	deliveryId,
}: {
	orderId: string;
	deliveryId: string;
}): Promise<Blob> => {
	const params = new URLSearchParams({ orderId, deliveryId });
	const url = `https://api.simplegeek.ru/admin/delivery/cdek/waybill/print?${params.toString()}`;
	const response = await fetch(url, {
		method: "GET",
		credentials: "include",
		headers: { "Content-Type": "application/pdf" },
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}

	return await response.blob();
};
