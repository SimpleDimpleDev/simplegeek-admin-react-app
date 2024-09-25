import {
	CategoryChangeImageSchema,
	CategoryCreateSchema,
	CategoryGetSchema,
	CategoryUpdateSchema,
} from "@schemas/Category";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
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

const categoryApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createCategory: build.mutation<z.infer<typeof CreateResponseSchema>, z.infer<typeof CategoryCreateSchema>>({
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

		getCategoryList: build.query<z.infer<typeof CategoryListResponseSchema>, void>({
			query: () => ({
				url: "/admin/category-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CategoryListResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "Category", id: item.id })),
		}),

		updateCategory: build.mutation<void, z.infer<typeof CategoryUpdateSchema>>({
			query: (body) => ({
				url: "/admin/category",
				method: "PUT",
				body: body,
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.id }, { type: "Product"}, {type: "Publication"}],
		}),

		changeImageCategory: build.mutation<void, z.infer<typeof CategoryChangeImageSchema>>({
			query: (body) => {
				const formData = categoryChangeImageFormDataMapper(body);

				return {
					url: "/admin/category/image",
					method: "PATCH",
					body: formData,
				};
			},
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.categoryId }],
		}),
	}),
	overrideExisting: false,
});

export const {
	useCreateCategoryMutation,
	useGetCategoryListQuery,
	useLazyGetCategoryListQuery,
	useUpdateCategoryMutation,
	useChangeImageCategoryMutation,
} = categoryApi;
