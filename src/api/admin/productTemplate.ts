import {
	ProductTemplateCreateSchema,
	ProductTemplateListGetSchema,
	ProductTemplateUpdateSchema,
} from "@schemas/ProductTemplate";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const productTemplateApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createProductTemplate: build.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof ProductTemplateCreateSchema>
		>({
			query: (data) => ({
				url: "/admin/product-template",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["ProductTemplate"],
		}),
		getProductTemplateList: build.query<z.infer<typeof ProductTemplateListGetSchema>, void>({
			query: () => ({
				url: "/admin/product-template-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductTemplateListGetSchema, response),
			providesTags: ["ProductTemplate"],
		}),
		updateProductTemplate: build.mutation<void, z.infer<typeof ProductTemplateUpdateSchema>>({
			query: (data) => ({
				url: "/admin/product-template",
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["ProductTemplate"],
		}),
		deleteProductTemplates: build.mutation<void, { ids: string[] }>({
			query: ({ ids }) => ({
				url: "/admin/product-template",
				method: "DELETE",
				body: { ids },
			}),
			invalidatesTags: ["ProductTemplate"],
		}),
	}),
});

export const {
	useCreateProductTemplateMutation,
	useGetProductTemplateListQuery,
	useUpdateProductTemplateMutation,
	useDeleteProductTemplatesMutation,
} = productTemplateApi;
