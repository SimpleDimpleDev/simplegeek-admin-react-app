import { crashReporterMiddleware, loggingMiddleware } from "./middleware";

import { adminApi } from "@api/admin/root";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";

const store = configureStore({
	reducer: {
		user: userReducer,
		[adminApi.reducerPath]: adminApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(adminApi.middleware).concat(loggingMiddleware).concat(crashReporterMiddleware),
});

export { store };

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
