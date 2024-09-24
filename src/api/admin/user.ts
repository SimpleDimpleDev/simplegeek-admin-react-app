import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { UserGetSchema } from "@schemas/User";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const UserListGetResponseSchema = z.object({
	items: UserGetSchema.array(),
});

export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
	tagTypes: ["User"],
	endpoints: (builder) => ({
		getUser: builder.query<z.infer<typeof UserGetSchema>, { userId: string }>({
			query: ({ userId }) => ({
				url: `/admin/user`,
				params: { id: userId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserGetSchema, response),
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

export const { useGetUserQuery, useGetUserListQuery } = userApi;
