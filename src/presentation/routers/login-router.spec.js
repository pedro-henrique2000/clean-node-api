const LoginRouter = require('./login-router')
const MissingParamError = require('./helpers/missing-param-error')

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
    expect(response.body).toEqual(new MissingParamError("email"));
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
    expect(response.body).toEqual(new MissingParamError("password"));
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
