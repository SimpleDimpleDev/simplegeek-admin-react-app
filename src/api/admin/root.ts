import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const adminApi = createApi({
	reducerPath: "adminApi",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.SHOP_API_URL,
		credentials: "include",
	}),
	tagTypes: ["Category", "Product", "User", "Order", "FAQItem", "Publication", "FilterGroup"],
	endpoints: () => ({}),
});
