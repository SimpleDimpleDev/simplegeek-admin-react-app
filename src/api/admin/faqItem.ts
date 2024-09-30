import { FAQItemListGetSchema } from "@schemas/FAQ";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const FAQItemApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createFAQItem: build.mutation({
			query: (item) => ({
				url: "/admin/faq",
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

		updateFAQItem: build.mutation({
			query: (item) => ({
				url: "/admin/faq",
				method: "PUT",
				body: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),

		deleteFAQItems: build.mutation({
			query: (ids: string[]) => ({
				url: "/admin/faq",
				method: "DELETE",
				body: { ids },
			}),
			invalidatesTags: ["FAQItem"],
		}),
	}),
});

export const { useCreateFAQItemMutation, useGetFAQItemListQuery, useUpdateFAQItemMutation, useDeleteFAQItemsMutation } =
	FAQItemApi;
