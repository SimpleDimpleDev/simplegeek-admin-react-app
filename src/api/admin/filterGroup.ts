import { FilterGroupCreateSchema, FilterGroupListGetSchema, FilterGroupUpdateSchema } from "@schemas/FilterGroup";

import { CreateResponseSchema } from "@schemas/Api";
import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

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
			z.infer<typeof FilterGroupListGetSchema>,
			{ categoryId: string | undefined }
		>({
			query: ({ categoryId }) => ({
				url: "/admin/filter-group-list",
				method: "GET",
				params: { categoryId },
			}),
			transformResponse: (response) => validateData(FilterGroupListGetSchema, response),
			providesTags: ["FilterGroup"],
		}),

		updateFilterGroup: build.mutation<void, z.infer<typeof FilterGroupUpdateSchema>>({
			query: (filterGroup) => ({
				url: "/admin/filter-group",
				method: "PUT",
				body: filterGroup,
			}),
			invalidatesTags: ["FilterGroup"],
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
