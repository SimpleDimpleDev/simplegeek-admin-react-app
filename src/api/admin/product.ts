import {
	ProductAddImageSchema,
	ProductCreateSchema,
	ProductGetSchema,
	ProductListFilterSchema,
	ProductListGetSchema,
	ProductUpdateSchema,
} from "@schemas/Product";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const productCreateFormDataMapper = (data: z.infer<typeof ProductCreateSchema>) => {
	const formData = new FormData();
	formData.append("title", data.title);
	formData.append("description", data.description || "");
	formData.append("categoryId", data.categoryId);
	formData.append("physicalProperties", JSON.stringify(data.physicalProperties));
	formData.append("filterGroups", JSON.stringify(data.filterGroups || JSON.stringify([])));
	formData.append("imageProperties", JSON.stringify(data.images.map((image) => image.properties)));
	data.images.forEach((image) => {
		formData.append("images", image.file, image.file.name);
	});
	return formData;
};

const productAddImageFormDataMapper = (data: z.infer<typeof ProductAddImageSchema>) => {
	const formData = new FormData();
	formData.append("productId", data.productId);
	formData.append("imageProperties", JSON.stringify(data.image.properties));
	formData.append("image", data.image.file);
	return formData;
};

export const productApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createProduct: build.mutation<z.infer<typeof CreateResponseSchema>, z.infer<typeof ProductCreateSchema>>({
			query: (data) => {
				const formData = productCreateFormDataMapper(data);
				return {
					url: "/admin/product",
					method: "POST",
					body: formData,
				};
			},
			transformResponse: (response) => validateData(CreateResponseSchema, response),
		}),
		getProduct: build.query<z.infer<typeof ProductGetSchema>, { productId: string }>({
			query: ({ productId }) => ({
				url: "/admin/product",
				params: { id: productId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductGetSchema, response),
		}),
		getProductList: build.query<
			z.infer<typeof ProductListGetSchema>,
			{ filter: z.infer<typeof ProductListFilterSchema> }
		>({
			query: ({ filter }) => ({
				url: "/admin/product-list",
				method: "GET",
				params: { filter },
			}),
			transformResponse: (response) => validateData(ProductListGetSchema, response),
		}),
		updateProduct: build.mutation<void, z.infer<typeof ProductUpdateSchema>>({
			query: (data) => {
				return {
					url: "/admin/product",
					method: "PUT",
					body: data,
				};
			},
		}),
		addImageProduct: build.mutation<void, z.infer<typeof ProductAddImageSchema>>({
			query: (data) => {
				const formData = productAddImageFormDataMapper(data);
				return {
					url: "/admin/product/image",
					method: "POST",
					body: formData,
				};
			},
		}),

		deleteProduct: build.mutation<void, { productId: string }>({
			query: ({ productId }) => ({
				url: "/admin/product",
				method: "DELETE",
				params: { id: productId },
			}),
		}),
	}),
});

export const {
	useCreateProductMutation,
	useGetProductQuery,
	useGetProductListQuery,
	useUpdateProductMutation,
	useAddImageProductMutation,
	useDeleteProductMutation,
} = productApi;
