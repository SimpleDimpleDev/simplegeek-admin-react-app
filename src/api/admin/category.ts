import {
	CategoryChangeImageSchema,
	CategoryCreateSchema,
	CategoryListGetSchema,
	CategoryUpdateSchema,
} from "@schemas/Category";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

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

		getCategoryList: build.query<z.infer<typeof CategoryListGetSchema>, void>({
			query: () => ({
				url: "/admin/category-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CategoryListGetSchema, response),
			providesTags: ["Category"],
		}),

		updateCategory: build.mutation<void, z.infer<typeof CategoryUpdateSchema>>({
			query: (body) => ({
				url: "/admin/category",
				method: "PUT",
				body: body,
			}),
			invalidatesTags: ["Category", "Product", "Preorder"]
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
			invalidatesTags: ["Category"],
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
