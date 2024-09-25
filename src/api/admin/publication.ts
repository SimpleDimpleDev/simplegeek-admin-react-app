import { PublicationCreateSchema, PublicationGetSchema, PublicationUpdateSchema } from "@schemas/Publication";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const PublicationListGetResponseSchema = z.object({
	items: PublicationGetSchema.array(),
});

export const publicationApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createPublication: build.mutation({
			query: (data: z.infer<typeof PublicationCreateSchema>) => ({
				url: "/admin/publication",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => validateData(CreateResponseSchema, response),
			invalidatesTags: ["Publication"],
		}),

		getPublication: build.query<z.infer<typeof PublicationGetSchema>, { publicationId: string }>({
			query: ({ publicationId }) => ({
				url: `/admin/publication`,
				params: { id: publicationId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationGetSchema, response),
			providesTags: (_result, _error, { publicationId }) => [{ type: "Publication", id: publicationId }],
		}),

		getPublicationList: build.query<z.infer<typeof PublicationListGetResponseSchema>, void>({
			query: () => ({
				url: "/admin/publication-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(PublicationListGetResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "Publication", id: item.id })),
		}),

		updatePublication: build.mutation<void, z.infer<typeof PublicationUpdateSchema>>({
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
