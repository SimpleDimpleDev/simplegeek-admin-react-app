import { PublicationCreateSchema, PublicationGetSchema, PublicationUpdateSchema } from "@schemas/Publication";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CreateResponseSchema } from "@schemas/Api";
import { validateData } from "@utils/validation";
import { z } from "zod";

const PublicationListGetResponseSchema = z.object({
	items: PublicationGetSchema.array(),
});

export const publicationApi = createApi({
	reducerPath: "PublicationApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/admin",
	}),
	tagTypes: ["Publication"],
	endpoints: (builder) => ({
		createPublication: builder.mutation({
			query: (data: z.infer<typeof PublicationCreateSchema>) => ({
				url: "/admin/publication",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Publication"],
		}),

		getPublication: builder.query<z.infer<typeof PublicationGetSchema>, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: `/admin/publication`,
				params: { id: publicationId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationGetSchema, response),
			providesTags: (_result, _error, { publicationId }) => [{ type: "Publication", id: publicationId }],
		}),

		getPublicationList: builder.query<z.infer<typeof PublicationListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/publication-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationListGetResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "Publication", id: item.id })),
		}),

		updatePublication: builder.mutation<void, z.infer<typeof PublicationUpdateSchema>>({
			query: (data) => ({
				url: "/admin/publication",
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, data) => [{ type: "Publication", id: data.id }],
		}),
	}),
});

export const {
	useCreatePublicationMutation,
	useGetPublicationQuery,
	useGetPublicationListQuery,
	useUpdatePublicationMutation,
} = publicationApi;
