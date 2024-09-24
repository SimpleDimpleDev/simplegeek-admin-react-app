import {
	CategoryChangeImageSchema,
	CategoryCreateSchema,
	CategoryGetSchema,
	CategoryUpdateSchema,
} from "@schemas/Category";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CreateResponseSchema } from "@schemas/Api";
import { validateData } from "@utils/validation";
import { z } from "zod";

const CategoryListResponseSchema = z.object({
	items: CategoryGetSchema.array(),
});

const categoryCreateFormDataMapper = (data: z.infer<typeof CategoryCreateSchema>) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("link", data.link);
	formData.append("icon", data.icon.file);
	formData.append("banner", data.banner.file);
	formData.append("iconProperties", JSON.stringify(data.icon.properties));
	formData.append("bannerProperties", JSON.stringify(data.banner.properties));
	return formData;
};

const categoryChangeImageFormDataMapper = (data: z.infer<typeof CategoryChangeImageSchema>) => {
	const formData = new FormData();
	formData.append("id", data.categoryId);
	formData.append("imageType", data.imageType);
	formData.append("image", data.image.file);
	formData.append("imageProperties", JSON.stringify(data.image.properties));
	return formData;
};

export const categoryApi = createApi({
	reducerPath: "categoryApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
	tagTypes: ["Category"],
	endpoints: (builder) => ({
		createCategory: builder.mutation<z.infer<typeof CreateResponseSchema>, z.infer<typeof CategoryCreateSchema>>({
			query: (body) => {
				const formData = categoryCreateFormDataMapper(body);
				return {
					url: "/admin/category",
					method: "POST",
					body: formData,
				};
			},
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Category"],
		}),

		getCategoryList: builder.query<z.infer<typeof CategoryListResponseSchema>, void>({
			query: () => ({
				url: "/admin/category-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CategoryListResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "Category", id: item.id })),
		}),

		updateCategory: builder.mutation<void, z.infer<typeof CategoryUpdateSchema>>({
			query: (body) => ({
				url: "/admin/category",
				method: "PUT",
				body: body,
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.id }],
		}),

		changeImageCategory: builder.mutation<void, z.infer<typeof CategoryChangeImageSchema>>({
			query: (body) => {
				const formData = categoryChangeImageFormDataMapper(body);

				return {
					url: "/admin/category",
					method: "PUT",
					body: formData,
				};
			},
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.categoryId }],
		}),
	}),
});

export const {
	useCreateCategoryMutation,
	useGetCategoryListQuery,
	useUpdateCategoryMutation,
	useChangeImageCategoryMutation,
} = categoryApi;
