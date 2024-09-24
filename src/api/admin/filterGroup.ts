import { FilterGroupCreateSchema, FilterGroupGetSchema } from "@schemas/FilterGroup";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CreateResponseSchema } from "@schemas/Api";
import { validateData } from "@utils/validation";
import { z } from "zod";

const FilterGroupListResponseSchema = z.object({
	items: FilterGroupGetSchema.array(),
});

export const filterGroupApi = createApi({
	reducerPath: "filterGroupApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/admin",
	}),
	tagTypes: ["FilterGroup"],
	endpoints: (builder) => ({
		createFilterGroup: builder.mutation<
			z.infer<typeof CreateResponseSchema>,
			z.infer<typeof FilterGroupCreateSchema>
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
	}),
});

export const {
	useCreateFilterGroupMutation,
	useGetFilterGroupListQuery,
	useLazyGetFilterGroupListQuery,
	useUpdateFilterGroupMutation,
	useDeleteFilterGroupsMutation,
} = filterGroupApi;
