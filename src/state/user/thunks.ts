import { AuthApiClient } from "@api/auth/client";
import { UserIdentity } from "@appTypes/User";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface StringMessageError {
	message: string;
}

export const fetchUser = createAsyncThunk<UserIdentity | null, void, { rejectValue: StringMessageError }>(
	"user/fetch",
	async (_, { rejectWithValue }) => {
		try {
			return await AuthApiClient.getUser();
		} catch (error) {
			return rejectWithValue({
				message: `${(error as Error).message}`,
			});
		}
	}
);
