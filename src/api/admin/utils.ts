import { adminApi } from "./root";

export const utilsApi = adminApi.injectEndpoints({
	endpoints: (build) => ({
		uploadExcel: build.mutation<void, FormData>({
			query: (data) => ({
				url: "/admin/utils/upload-excel",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Product", "Publication"],
		}),
	}),
});

export const { useUploadExcelMutation } = utilsApi;
