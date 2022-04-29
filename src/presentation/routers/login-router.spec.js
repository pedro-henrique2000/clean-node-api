class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.internalError();
    }

    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return HttpResponse.badRequest();
    }
  }
}

class HttpResponse {
  static badRequest() {
    return {
      statusCode: 400,
    };
  }

  static internalError() {
    return {
      statusCode: 500,
    };
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

  it("Should return 500 if no http request is provided", () => {
    const sut = new LoginRouter();
    const response = sut.route();
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if http request has no body", () => {
    const sut = new LoginRouter();
    const response = sut.route({});
    expect(response.statusCode).toBe(500);
  });
});
