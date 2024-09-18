import {
	CategoryCreateAdminRequestSchema,
	CategoryListAdminResponseSchema,
	CreateResponseSchema,
	FAQItemTableAdminResponseSchema,
	FilterGroupCreateAdminRequestSchema,
	FilterGroupListAdminResponseSchema,
	OrderGetAdminResponseSchema,
	OrderListGetAdminResponseSchema,
	ProductCreateAdminRequestSchema,
	ProductGetAdminResponseSchema,
	ProductListGetAdminResponseSchema,
	PublicationCreateAdminRequestSchema,
	PublicationGetAdminResponseSchema,
	PublicationListGetAdminResponseSchema,
	UserListGetAdminResponseSchema,
} from "./schemas";
import { ZodError, ZodSchema, z } from "zod";
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
			z.infer<typeof CategoryCreateAdminRequestSchema>
		>({
			query: (category: z.infer<typeof CategoryCreateAdminRequestSchema>) => {
				const formData = new FormData();
				formData.append("title", category.title);
				formData.append("link", category.link);
				formData.append("smallImage", category.smallImage.file);
				formData.append("largeImage", category.bigImage.file);
				formData.append("smallImageProperties", JSON.stringify(category.smallImage.properties));
				formData.append("largeImageProperties", JSON.stringify(category.bigImage.properties));
				return {
					url: "/admin/category",
					method: "POST",
					data: formData,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				};
			},
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Category"],
		}),
		getCategoryList: builder.query<z.infer<typeof CategoryListAdminResponseSchema>, void>({
			query: () => ({
				url: "/admin/category-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(CategoryListAdminResponseSchema, response),
			providesTags: ["Category"],
		}),

		// FAQItem
		createFAQItem: builder.mutation({
			query: (item) => ({
				url: "/admin/faq",
				method: "POST",
				data: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),
		getFAQItemsTable: builder.query<z.infer<typeof FAQItemTableAdminResponseSchema>, void>({
			query: () => ({
				url: "/admin/faq-item/table",
				method: "GET",
			}),
			transformResponse: (response) => validateData(FAQItemTableAdminResponseSchema, response),
			providesTags: ["FAQItem"],
		}),
		updateFAQItem: builder.mutation({
			query: (item) => ({
				url: "/admin/faq",
				method: "PUT",
				data: item,
			}),
			invalidatesTags: ["FAQItem"],
		}),
		deleteFAQItems: builder.mutation({
			query: (ids: string[]) => ({
				url: "/admin/faq",
				method: "DELETE",
				data: { ids },
			}),
			invalidatesTags: ["FAQItem"],
		}),

		// FilterGroup
		createFilterGroup: builder.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof FilterGroupCreateAdminRequestSchema>
		>({
			query: (filterGroup: z.infer<typeof FilterGroupCreateAdminRequestSchema>) => ({
				url: "/admin/filter-group",
				method: "POST",
				data: filterGroup,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["FilterGroup"],
		}),
		getFilterGroupList: builder.query<
			z.infer<typeof FilterGroupListAdminResponseSchema>,
			{ categoryId: string | undefined }
		>({
			query: ({ categoryId }) => ({
				url: "/admin/filter-group-list",
				method: "GET",
				params: { categoryId },
			}),
			transformResponse: (response) => validateData(FilterGroupListAdminResponseSchema, response),
			providesTags: (_result, _error, { categoryId }) => [{ type: "FilterGroup", id: categoryId || "LIST" }],
		}),
		updateFilterGroup: builder.mutation({
			query: (filterGroup) => ({
				url: "/admin/filter-group",
				method: "PUT",
				data: filterGroup,
			}),
			invalidatesTags: ["FilterGroup"],
		}),
		deleteFilterGroups: builder.mutation<z.infer<typeof CreateResponseSchema>, string[]>({
			query: (ids: string[]) => ({
				url: "/admin/filter-group",
				method: "DELETE",
				data: { ids },
			}),
			invalidatesTags: ["FilterGroup"],
		}),

		// Product
		createProduct: builder.mutation({
			query: (data: z.infer<typeof ProductCreateAdminRequestSchema>) => {
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
				return {
					url: "/admin/product",
					method: "POST",
					data: formData,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				};
			},
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Product"],
		}),
		getProduct: builder.query<z.infer<typeof ProductGetAdminResponseSchema>, { productId: string }>({
			query: ({ productId }) => ({
				url: `/admin/product`,
				params: { id: productId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductGetAdminResponseSchema, response),
			providesTags: (_result, _error, { productId }) => [{ type: "Product", id: productId }],
		}),
		getProductList: builder.query<z.infer<typeof ProductListGetAdminResponseSchema>, void>({
			query: () => ({
				url: "/admin/product-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(ProductListGetAdminResponseSchema, response),
			providesTags: ["Product"],
		}),

		// Publication
		createPublication: builder.mutation({
			query: (data: z.infer<typeof PublicationCreateAdminRequestSchema>) => ({
				url: "/admin/publication",
				method: "POST",
				data: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Publication"],
		}),
		getPublication: builder.query<z.infer<typeof PublicationGetAdminResponseSchema>, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: `/admin/publication`,
				params: { id: publicationId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationGetAdminResponseSchema, response),
			providesTags: (_result, _error, { publicationId }) => [{ type: "Publication", id: publicationId }],
		}),
		getPublicationList: builder.query<z.infer<typeof PublicationListGetAdminResponseSchema>, void>({
			query: () => ({
				url: "/admin/publication-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationListGetAdminResponseSchema, response),
			providesTags: ["Publication"],
		}),
		getOrder: builder.query({
			query: (id: string) => ({
				url: `/admin/order`,
				params: { id },
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderGetAdminResponseSchema, response),
			providesTags: (_result, _error, id) => [{ type: "Order", id }],
		}),
		getOrderList: builder.query<z.infer<typeof OrderListGetAdminResponseSchema>, void>({
			query: () => ({
				url: "/admin/order-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(OrderListGetAdminResponseSchema, response),
			providesTags: ["Order"],
		}),
		getUserList: builder.query({
			query: () => ({
				url: "/admin/user-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserListGetAdminResponseSchema, response),
			providesTags: ["User"],
		}),
	}),
});

export const {
	useGetFAQItemsTableQuery,
	useGetFilterGroupListQuery,
	useLazyGetFilterGroupListQuery,
	useGetCategoryListQuery,
	useGetProductQuery,
	useGetProductListQuery,
	useGetPublicationQuery,
	useGetPublicationListQuery,
	useGetOrderQuery,
	useGetOrderListQuery,
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
