import { FAQItemApi, categoryApi, filterGroupApi, orderApi, productApi, publicationApi, userApi } from "@api/admin";
import { crashReporterMiddleware, loggingMiddleware } from "./middleware";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
	reducer: {
		[categoryApi.reducerPath]: categoryApi.reducer,
		[FAQItemApi.reducerPath]: FAQItemApi.reducer,
		[filterGroupApi.reducerPath]: filterGroupApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[publicationApi.reducerPath]: publicationApi.reducer,
		[userApi.reducerPath]: userApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(categoryApi.middleware)
			.concat(FAQItemApi.middleware)
			.concat(filterGroupApi.middleware)
			.concat(orderApi.middleware)
			.concat(productApi.middleware)
			.concat(publicationApi.middleware)
			.concat(userApi.middleware)
			.concat(loggingMiddleware)
			.concat(crashReporterMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
