const LoginRouter = require("./login-router");
const MissingParamError = require("./helpers/missing-param-error");
const HttpResponse = require("./helpers/http-response");

const makeSut = () => {
  class AuthCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  const authCase = new AuthCaseSpy();
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
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = sut.route(httpRequest);
    expect(response.statusCode).toBe(401);
  });
});
