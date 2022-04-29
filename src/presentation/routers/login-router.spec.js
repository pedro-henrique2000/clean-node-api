class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email || !httpRequest.body.password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: "123",
      },
    };
    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(400);
  });

  it("Should return 400 if no password is provided", () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: "anyEmail",
      },
    };
    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(400);
  });
});
