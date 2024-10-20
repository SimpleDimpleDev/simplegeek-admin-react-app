import { Configuration, FrontendApi } from "@ory/client";

import { UserIdentity } from "@appTypes/User";
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

	public static async getUser(): Promise<UserIdentity | null> {
		try {
			const oryResponse = await this.client.toSession();
			const session = oryResponse.data || null;
			const userIdentity: UserIdentity | null = session?.identity
				? {
						email: session.identity.traits.email!,
						isAdmin: session.identity.schema_id === "Admin",
						id: session.identity.id,
				  }
				: null;
			return userIdentity;
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
