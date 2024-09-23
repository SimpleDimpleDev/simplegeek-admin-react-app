import {
	CategoryChangeImageRequestSchema,
	CategoryCreateRequestSchema,
	CategoryListResponseSchema,
	CategoryUpdateRequestSchema,
	CreateResponseSchema,
	FAQItemListResponseSchema,
	FilterGroupCreateRequestSchema,
	FilterGroupListResponseSchema,
	OrderGetResponseSchema,
	OrderListGetResponseSchema,
	ProductAddImageRequestSchema,
	ProductCreateRequestSchema,
	ProductGetResponseSchema,
	ProductListGetResponseSchema,
	ProductUpdateRequestSchema,
	PublicationCreateRequestSchema,
	PublicationGetResponseSchema,
	PublicationListGetResponseSchema,
	UserGetResponseSchema,
	UserListGetResponseSchema,
} from "./schemas";
import { ZodError, ZodSchema, z } from "zod";
import {
	categoryChangeImageFormDataMapper,
	categoryCreateFormDataMapper,
	productAddImageFormDataMapper,
	productCreateFormDataMapper,
} from "./utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const validateData = <T extends ZodSchema>(schema: T, data: unknown): z.infer<T> => {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			console.error(error.message);
			console.error(error.issues);
		}
		throw error;
	}
};

// Create the API
export const adminApi = createApi({
	reducerPath: "adminApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
	tagTypes: ["FAQItem", "FilterGroup", "Category", "Product", "Publication", "Order", "User"],
	endpoints: (builder) => ({
		// Category
		createCategory: builder.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof CategoryCreateRequestSchema>
		>({
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
		updateCategory: builder.mutation<void, z.infer<typeof CategoryUpdateRequestSchema>>({
			query: (body) => ({
				url: "/admin/category",
				method: "PUT",
				body: body,
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.id }],
		}),
		changeImageCategory: builder.mutation<void, z.infer<typeof CategoryChangeImageRequestSchema>>({
			query: (body) => {
				const formData = categoryChangeImageFormDataMapper(body);

				return {
					url: "/admin/category",
					method: "PUT",
					body: formData,
				};
			},
			invalidatesTags: (_result, _error, body) => [{ type: "Category", id: body.id }],
		}),
		
		// FAQItem
		createFAQItem: builder.mutation({
			query: (item) => ({
				url: "/admin/faq",
				method: "POST",
				body: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),
		getFAQItemList: builder.query<z.infer<typeof FAQItemListResponseSchema>, void>({
			query: () => ({
				url: "/admin/faq-item-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(FAQItemListResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "FAQItem", id: item.id })),
		}),
		updateFAQItem: builder.mutation({
			query: (item) => ({
				url: "/admin/faq",
				method: "PUT",
				body: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),
		deleteFAQItems: builder.mutation({
			query: (ids: string[]) => ({
				url: "/admin/faq",
				method: "DELETE",
				body: { ids },
			}),
			invalidatesTags: ["FAQItem"],
		}),

		// FilterGroup
		createFilterGroup: builder.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof FilterGroupCreateRequestSchema>
		>({
			query: (filterGroup) => ({
				url: "/admin/filter-group",
				method: "POST",
				body: filterGroup,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["FilterGroup"],
		}),
		getFilterGroupList: builder.query<
			z.infer<typeof FilterGroupListResponseSchema>,
			{ categoryId: string | undefined }
		>({
			query: ({ categoryId }) => ({
				url: "/admin/filter-group-list",
				method: "GET",
				params: { categoryId },
			}),
			transformResponse: (response) => validateData(FilterGroupListResponseSchema, response),
			providesTags: (_result, _error, { categoryId }) => [{ type: "FilterGroup", id: categoryId || "LIST" }],
		}),
		updateFilterGroup: builder.mutation({
			query: (filterGroup) => ({
				url: "/admin/filter-group",
				method: "PUT",
				body: filterGroup,
			}),
			invalidatesTags: ["FilterGroup"],
		}),
		deleteFilterGroups: builder.mutation<z.infer<typeof CreateResponseSchema>, string[]>({
			query: (ids: string[]) => ({
				url: "/admin/filter-group",
				method: "DELETE",
				body: { ids },
			}),
			invalidatesTags: ["FilterGroup"],
		}),

		// Product
		createProduct: builder.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof ProductCreateRequestSchema>
		>({
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
		getProduct: builder.query<z.infer<typeof ProductGetResponseSchema>, { productId: string }>({
			query: ({ productId }) => ({
				url: `/admin/product`,
				params: { id: productId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductGetResponseSchema, response),
			providesTags: (_result, _error, { productId }) => [{ type: "Product", id: productId }],
		}),
		getProductList: builder.query<z.infer<typeof ProductListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/product-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductListGetResponseSchema, response),
			providesTags: ["Product"],
		}),
		updateProduct: builder.mutation<void, z.infer<typeof ProductUpdateRequestSchema>>({
			query: (data) => {
				return {
					url: "/admin/product",
					method: "PUT",
					body: data,
				};
			},
			invalidatesTags: (_result, _error, data) => [{ type: "Product", id: data.id }],
		}),
		addImageProduct: builder.mutation<void, z.infer<typeof ProductAddImageRequestSchema>>({
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

		// Publication
		createPublication: builder.mutation({
			query: (data: z.infer<typeof PublicationCreateRequestSchema>) => ({
				url: "/admin/publication",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Publication"],
		}),
		getPublication: builder.query<z.infer<typeof PublicationGetResponseSchema>, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: `/admin/publication`,
				params: { id: publicationId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationGetResponseSchema, response),
			providesTags: (_result, _error, { publicationId }) => [{ type: "Publication", id: publicationId }],
		}),
		getPublicationList: builder.query<z.infer<typeof PublicationListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/publication-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationListGetResponseSchema, response),
			providesTags: ["Publication"],
		}),
		getOrder: builder.query<z.infer<typeof OrderGetResponseSchema>, { orderId: string }>({
			query: ({ orderId }) => ({
				url: `/admin/order`,
				params: { id: orderId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderGetResponseSchema, response),
			providesTags: (_result, _error, { orderId }) => [{ type: "Order", id: orderId }],
		}),
		getOrderList: builder.query<z.infer<typeof OrderListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListGetResponseSchema, response),
			providesTags: ["Order"],
		}),
		getUser: builder.query<z.infer<typeof UserGetResponseSchema>, { userId: string }>({
			query: ({ userId }) => ({
				url: `/admin/user`,
				params: { id: userId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserGetResponseSchema, response),
			providesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }],
		}),
		getUserList: builder.query<z.infer<typeof UserListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/user-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserListGetResponseSchema, response),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useGetFAQItemListQuery,
	useGetFilterGroupListQuery,
	useLazyGetFilterGroupListQuery,
	// Category
	useGetCategoryListQuery,
	useUpdateCategoryMutation,
	useChangeImageCategoryMutation,
	// Product
	useGetProductQuery,
	useGetProductListQuery,
	useUpdateProductMutation,
	useAddImageProductMutation,

	useGetPublicationQuery,
	useGetPublicationListQuery,
	useGetOrderQuery,
	useGetOrderListQuery,
	useGetUserQuery,
	useGetUserListQuery,
	useCreateFAQItemMutation,
	useUpdateFAQItemMutation,
	useDeleteFAQItemsMutation,
	useCreateCategoryMutation,
	useCreateFilterGroupMutation,
	useUpdateFilterGroupMutation,
	useDeleteFilterGroupsMutation,
	useCreateProductMutation,
	useCreatePublicationMutation,
} = adminApi;
