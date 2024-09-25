import { ProductAddImageSchema, ProductCreateSchema, ProductGetSchema, ProductUpdateSchema } from "@schemas/Product";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const ProductListGetResponseSchema = z.object({
	items: ProductGetSchema.array(),
});

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
			invalidatesTags: ["Product"],
		}),

		getProduct: build.query<z.infer<typeof ProductGetSchema>, { productId: string }>({
			query: ({ productId }) => ({
				url: `/admin/product`,
				params: { id: productId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductGetSchema, response),
			providesTags: (_result, _error, { productId }) => [{ type: "Product", id: productId }],
		}),

		getProductList: build.query<z.infer<typeof ProductListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/product-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductListGetResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "Product", id: item.id })),
		}),

		updateProduct: build.mutation<void, z.infer<typeof ProductUpdateSchema>>({
			query: (data) => {
				return {
					url: "/admin/product",
					method: "PUT",
					body: data,
				};
			},
			invalidatesTags: (_result, _error, data) => [{ type: "Product", id: data.id }, { type: "Publication" }],
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
			invalidatesTags: (_result, _error, data) => [{ type: "Product", id: data.productId }],
		}),

		deleteProduct: build.mutation<void, { productId: string }>({
			query: ({ productId }) => ({
				url: `/admin/product`,
				method: "DELETE",
				params: { id: productId },
			}),
			invalidatesTags: (_result, _error, { productId }) => [{ type: "Product", id: productId }],
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
