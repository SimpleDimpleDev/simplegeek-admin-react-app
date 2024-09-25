import { crashReporterMiddleware, loggingMiddleware } from "./middleware";

import { adminApi } from "@api/admin/root"
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
	reducer: {
		[adminApi.reducerPath]: adminApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(adminApi.middleware)
			.concat(loggingMiddleware)
			.concat(crashReporterMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
