import { UserGetSchema, UserListGetSchema, UserRoleSchema, UserStateSchema } from "@schemas/User";

import { adminApi } from "./root";
import { validateData } from "@utils/validation";
import { z } from "zod";

export const userApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		getUser: build.query<z.infer<typeof UserGetSchema>, { userId: string }>({
			query: ({ userId }) => ({
				url: "/admin/user",
				params: { id: userId },
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserGetSchema, response),
			providesTags: (_result, _error, { userId }) => [{ type: "User", id: userId }],
		}),

		getUserList: build.query<z.infer<typeof UserListGetSchema>, void>({
			query: () => ({
				url: "/admin/user-list",
				method: "GET",
			}),
			transformResponse: (response) => validateData(UserListGetSchema, response),
			providesTags: ["User"],
		}),

		updateUserRole: build.mutation<void, { id: string; role: z.infer<typeof UserRoleSchema> }>({
			query: ({ id, role }) => ({
				url: "/admin/user/role",
				method: "PATCH",
				body: { id, role },
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
		}),
		
		updateUserState: build.mutation<void, { id: string; state: z.infer<typeof UserStateSchema> }>({
			query: ({ id, state }) => ({
				url: "/admin/user/state",
				method: "PATCH",
				body: { id, state },
			}),
			invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }],
		})
	}),
});

export const { useGetUserQuery, useGetUserListQuery, useUpdateUserRoleMutation, useUpdateUserStateMutation } = userApi;
