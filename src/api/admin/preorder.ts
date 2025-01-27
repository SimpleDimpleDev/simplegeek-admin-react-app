import {
	PreorderCreateSchema,
	PreorderGetSchema,
	PreorderListGetSchema,
	PreorderUpdateSchema,
} from "@schemas/Preorder";

import { adminApi } from "./root";
import { z } from "zod";

const preorderApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		createPreorder: build.mutation<void, z.infer<typeof PreorderCreateSchema>>({
			query: (data) => ({
				url: "/admin/preorder",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Preorder"],
		}),
		getPreorder: build.query<z.infer<typeof PreorderGetSchema>, { preorderId: string }>({
			query: ({ preorderId }) => ({
				url: "/admin/preorder",
				method: "GET",
				params: { id: preorderId },
			}),
			providesTags: (_result, _error, { preorderId }) => [{ type: "Preorder", id: preorderId }],
			transformResponse: (response) => PreorderGetSchema.parse(response),
		}),
		getPreorderList: build.query<z.infer<typeof PreorderListGetSchema>, void | { allowPublish: boolean }>({
			query: (args) => ({
				url: "/admin/preorder-list",
				method: "GET",
				params: args || {},
			}),
			providesTags: ["Preorder"],
			transformResponse: (response) => PreorderListGetSchema.parse(response),
		}),
		updatePreorder: build.mutation<void, z.infer<typeof PreorderUpdateSchema>>({
			query: (data) => ({
				url: "/admin/preorder",
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "Preorder", id: body.id }],
		}),
		advancePreorder: build.mutation<void, { preorderId: string }>({
			query: (data) => ({
				url: "/admin/preorder/advance",
				method: "PATCH",
				body: { id: data.preorderId },
			}),
			invalidatesTags: (_result, _error, body) => [{ type: "Preorder", id: body.preorderId }, "Publication"],
		}),
	}),
});

export const {
	useCreatePreorderMutation,
	useGetPreorderQuery,
	useGetPreorderListQuery,
	useLazyGetPreorderListQuery,
	useUpdatePreorderMutation,
	useAdvancePreorderMutation,
} = preorderApi;
