import { Configuration, FrontendApi } from "@ory/client";

import { UserAuthority } from "@appTypes/User";
import { isAxiosError } from "axios";

const oryClient = new FrontendApi(
	new Configuration({
		basePath: import.meta.env.AUTH_API_URL,
		baseOptions: {
			withCredentials: true,
		},
	})
);

export class AuthApiClient {
	private static client: FrontendApi = oryClient;

	public static async getUserAuthority(): Promise<UserAuthority | null> {
		try {
			const oryResponse = await this.client.toSession();
			const session = oryResponse.data || null;
			const userAuthority: UserAuthority | null = session?.identity
				? {
						email: session.identity.traits.email!,
						isAdmin: session.identity.schema_id === "Admin",
				  }
				: null;
			return userAuthority;
		} catch (e) {
			if (isAxiosError(e)) {
				if (e.code === "ECONNREFUSED") {
					console.warn("Cannot connect to Ory");
				}
				if (e.response?.status === 401) {
					console.warn("Unauthorized");
					return null;
				}
			} else {
				console.error(e);
			}
			throw e;
		}
	}
}
