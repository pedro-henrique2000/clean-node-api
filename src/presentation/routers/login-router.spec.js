const LoginRouter = require("./login-router");
const MissingParamError = require("./helpers/missing-param-error");
const UnauthorizedError = require("./helpers/unauthorized-error");

const makeSut = () => {
  class AuthCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }
  const authCase = new AuthCaseSpy();
  authCase.accessToken = "random_token";
  const sut = new LoginRouter(authCase);
  return {
    sut,
    authCase,
  };
};

describe("Login Router", () => {
  it("Should return 400 if no email is provided", () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const response = sut.route();
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if http request has no body", () => {
    const { sut } = makeSut();
    const response = sut.route({});
    expect(response.statusCode).toBe(500);
  });

  it("Should call AuthUseCase with correct params", () => {
    const { sut, authCase } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "123",
      },
    };
    sut.route(httpRequest);
    expect(authCase.email).toBe(httpRequest.body.email);
    expect(authCase.password).toBe(httpRequest.body.password);
  });

  it("Should return 401 if invalid email or password", () => {
    const { sut, authCase } = makeSut();
    authCase.accessToken = null;
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(new UnauthorizedError());
  });

  it("Should return 500 if no authcase is provided", () => {
    const sutWithNoAuthUseCase = new LoginRouter(null);
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = sutWithNoAuthUseCase.route(httpRequest);
    expect(response.statusCode).toBe(500);
  });

  it("Should return 500 if no authcase has no auth method", () => {
    const sutWithNoAuthUseCase = new LoginRouter({});
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = sutWithNoAuthUseCase.route(httpRequest);
    expect(response.statusCode).toBe(500);
  });

  it("Should return 200 when valid credentials is provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(200);
  });
});
