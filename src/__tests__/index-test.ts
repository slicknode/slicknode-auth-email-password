import {expect} from "chai";
import sinon from "sinon";
import Client, {AuthTokenSet} from "slicknode-client";
import login from "../";

describe("email / password authenticator", () => {
  it("authenticates with email / password credentials", async () => {
    const client = new Client({
      endpoint: "http://localhost",
    });

    const tokenSet: AuthTokenSet = {
      accessToken: "accessToken",
      accessTokenLifetime: 100,
      refreshToken: "refreshToken",
      refreshTokenLifetime: 1000,
    };

    sinon.stub(client, "fetch").resolves({
      data: {
        tokenSet,
      },
    });

    const loadedTokenSet = await client.authenticate(
      login("email@example.com", "mypassword"),
    );

    expect(loadedTokenSet).to.deep.equal(tokenSet);
    expect(client.hasAccessToken()).to.equal(true);
    expect(client.hasRefreshToken()).to.equal(true);
  });

  it("reports error from API", async () => {
    const client = new Client({
      endpoint: "http://localhost",
    });

    const tokenSet: AuthTokenSet = {
      accessToken: "accessToken",
      accessTokenLifetime: 100,
      refreshToken: "refreshToken",
      refreshTokenLifetime: 1000,
    };

    const ERROR_MESSAGE = "API error";
    sinon.stub(client, "fetch").resolves({
      data: null,
      errors: [
        {message: ERROR_MESSAGE},
      ],
    });

    try {
      await client.authenticate(
        login("email@example.com", "mypassword"),
      );
      throw new Error("Authentication does not fail");
    } catch (e) {
      expect(e.message).to.equal(ERROR_MESSAGE);
    }

    expect(client.hasAccessToken()).to.equal(false);
    expect(client.hasRefreshToken()).to.equal(false);
  });

  it("throws error for invalid API response", async () => {
    const client = new Client({
      endpoint: "http://localhost",
    });

    const tokenSet: AuthTokenSet = {
      accessToken: "accessToken",
      accessTokenLifetime: 100,
      refreshToken: "refreshToken",
      refreshTokenLifetime: 1000,
    };

    sinon.stub(client, "fetch").resolves({
      data: null,
      errors: [],
    });

    try {
      await client.authenticate(
        login("email@example.com", "mypassword"),
      );
      throw new Error("Authentication does not fail");
    } catch (e) {
      expect(e.message).to.equal("Login failed");
    }

    expect(client.hasAccessToken()).to.equal(false);
    expect(client.hasRefreshToken()).to.equal(false);
  });
});
