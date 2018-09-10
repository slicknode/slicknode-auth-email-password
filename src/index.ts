import Client, {Authenticator, AuthTokenSet} from "slicknode-client";

export default function(email: string, password: string): Authenticator {
  return async (client: Client) => {
    const query = `mutation LoginMutation(
      $email: String!,
      $password: String!
    ) {
      tokenSet: loginEmailPassword(input: {email: $email, password: $password}) {
        accessToken
        refreshToken
        accessTokenLifetime
        refreshTokenLifetime
      }
    }`;
    const result = await client.fetch<{tokenSet: AuthTokenSet | null}>(query, {email, password});
    if (result.data && result.data.tokenSet) {
      return result.data.tokenSet;
    }

    if (result.errors && result.errors.length) {
      throw new Error(result.errors[0].message);
    }

    throw new Error("Login failed");
  };
}
