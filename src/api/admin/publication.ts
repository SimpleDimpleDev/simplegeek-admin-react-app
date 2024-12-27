import { CatalogItemPublishSchema, CatalogItemUpdateSchema, MaxRatingGetSchema } from "@schemas/CatalogItem";
import {
	PublicationCreateSchema,
	PublicationGetSchema,
	PublicationListGetSchema,
	PublicationUpdateSchema,
} from "@schemas/Publication";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const publicationApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createPublication: build.mutation({
			query: (data: z.infer<typeof PublicationCreateSchema>) => ({
				url: "/admin/publication",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Product", "Publication"],
		}),

		getPublication: build.query<z.infer<typeof PublicationGetSchema>, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: `/admin/publication`,
				params: { id: publicationId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationGetSchema, response),
		}),

		getPublicationList: build.query<z.infer<typeof PublicationListGetSchema>, void>({
			query: () => ({
				url: "/admin/publication-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationListGetSchema, response),
			providesTags: ["Publication"],
		}),

		updatePublication: build.mutation<void, z.infer<typeof PublicationUpdateSchema>>({
			query: (data) => ({
				method: "PUT",
				url: "/admin/publication",
				body: data,
			}),
			invalidatesTags: ["Publication"],
		}),

		deletePublication: build.mutation<void, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: "/admin/publication",
				method: "DELETE",
				params: { id: publicationId },
			}),
			invalidatesTags: ["Publication"],
		}),

		getMaxRating: build.query<z.infer<typeof MaxRatingGetSchema>, void>({
			query: () => ({
				url: "/admin/catalog-item/max-rating",
				method: "GET",
			}),
			transformResponse: (response) => validateData(MaxRatingGetSchema, response),
		}),

		addVariation: build.mutation<
			void,
			{ data: z.infer<typeof CatalogItemPublishSchema>; publicationId: string; isActive: boolean }
		>({
			query: ({ data, publicationId, isActive }) => ({
				url: "/admin/catalog-item",
				method: "POST",
				body: data,
				params: { publicationId, isActive },
			}),
			invalidatesTags: ["Product", "Publication"],
		}),

		updateCatalogItem: build.mutation<
			void,
			{ publicationId: string; data: z.infer<typeof CatalogItemUpdateSchema> }
		>({
			query: ({ data }) => ({
				url: "/admin/catalog-item",
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Publication"],
		}),

		deleteCatalogItem: build.mutation<void, { publicationId: string; variationId: string }>({
			query: ({ variationId }) => ({
				url: "/admin/catalog-item",
				method: "DELETE",
				params: { id: variationId },
			}),
			invalidatesTags: ["Publication"]
		}),

		activateCatalogItem: build.mutation<void, { publicationId: string; variationId: string }>({
			query: ({ variationId }) => ({
				url: "/admin/catalog-item/activate",
				method: "PATCH",
				params: { id: variationId },
			}),
			invalidatesTags: ["Publication"]
		}),

		deactivateCatalogItem: build.mutation<void, { publicationId: string; variationId: string }>({
			query: ({ variationId }) => ({
				url: "/admin/catalog-item/deactivate",
				method: "PATCH",
				params: { id: variationId },
			}),
			invalidatesTags: ["Publication"]
		}),
	}),
});

export const {
	useCreatePublicationMutation,
	useGetPublicationQuery,
	useGetPublicationListQuery,
	useUpdatePublicationMutation,
	useDeletePublicationMutation,
	useGetMaxRatingQuery,
	useAddVariationMutation,
	useUpdateCatalogItemMutation,
	useDeleteCatalogItemMutation,
	useActivateCatalogItemMutation,
	useDeactivateCatalogItemMutation,
} = publicationApi;
