import { FAQItemCreateSchema, FAQItemListGetSchema } from "@schemas/FAQ";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const FAQItemApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createFAQItem: build.mutation<void, z.infer<typeof FAQItemCreateSchema>>({
			query: (item) => ({
				url: "/admin/faq-item",
				method: "POST",
				body: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),

		getFAQItemList: build.query<z.infer<typeof FAQItemListGetSchema>, void>({
			query: () => ({
				url: "/admin/faq-item-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(FAQItemListGetSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "FAQItem", id: item.id })),
		}),

		updateFAQItem: build.mutation<void, z.infer<typeof FAQItemCreateSchema>>({
			query: (item) => ({
				url: "/admin/faq-item",
				method: "PUT",
				body: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),

		deleteFAQItems: build.mutation<void, { ids: string[] }>({
			query: ({ ids }) => ({
				url: "/admin/faq-item",
				method: "DELETE",
				body: { ids },
			}),
			invalidatesTags: ["FAQItem"],
		}),
	}),
});

export const { useCreateFAQItemMutation, useGetFAQItemListQuery, useUpdateFAQItemMutation, useDeleteFAQItemsMutation } =
	FAQItemApi;
