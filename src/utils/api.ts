import { ApiErrorSchema } from "@schemas/Api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { z } from "zod";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
	return typeof error === "object" && error != null && "status" in error;
}

export function isApiError(error: unknown): error is { data: z.infer<typeof ApiErrorSchema> } & FetchBaseQueryError {
	if (!isFetchBaseQueryError(error)) return false;
	if (!error.data || typeof error.data !== "object") return false;
	try {
		ApiErrorSchema.parse(error.data);
		return true;
	} catch {
		return false;
	}
}
