import { FilterGroupCreateSchema, FilterGroupGetSchema, FilterGroupUpdateSchema } from "@schemas/FilterGroup";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

const FilterGroupListResponseSchema = z.object({
	items: FilterGroupGetSchema.array(),
});

export const filterGroupApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createFilterGroup: build.mutation<
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

		getFilterGroupList: build.query<
			z.infer<typeof FilterGroupListResponseSchema>,
			{ categoryId: string | undefined }
		>({
			query: ({ categoryId }) => ({
				url: "/admin/filter-group-list",
				method: "GET",
				params: { categoryId },
			}),
			transformResponse: (response) => validateData(FilterGroupListResponseSchema, response),
			providesTags: (result) => (result?.items || []).map((item) => ({ type: "FilterGroup", id: item.id })),
		}),

		updateFilterGroup: build.mutation<void, z.infer<typeof FilterGroupUpdateSchema>>({
			query: (filterGroup) => ({
				url: "/admin/filter-group",
				method: "PUT",
				body: filterGroup,
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "FilterGroup", id: body.id }],
		}),

		deleteFilterGroups: build.mutation<z.infer<typeof CreateResponseSchema>, string[]>({
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
