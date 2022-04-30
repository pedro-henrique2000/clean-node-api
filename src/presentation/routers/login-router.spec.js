const LoginRouter = require("./login-router");
const MissingParamError = require("./helpers/missing-param-error");
const UnauthorizedError = require("./helpers/unauthorized-error");
const ServerError = require("./helpers/server-error");
const InvalidParamError = require("./helpers/invalid-param-error");

const makeSut = () => {
  const authCase = makeAuthUseCase();
  const emailValidatorSpy = makeEmailValidator();
  authCase.accessToken = "random_token";
  const sut = new LoginRouter(authCase, emailValidatorSpy);
  return {
    sut,
    authCase,
    emailValidatorSpy,
  };
};

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid(email) {
      this.email = email;
      return this.emailIsValid;
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy();
  emailValidatorSpy.emailIsValid = true;
  return emailValidatorSpy;
};

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid(email) {
      throw new Error();
    }
  }

  return new EmailValidatorSpy();
};

const makeAuthUseCase = () => {
  class AuthCaseSpy {
    async auth(email, password) {
      this.email = email;
      this.password = password;
      return this.accessToken;
    }
  }

  return new AuthCaseSpy();
};

const makeAuthUseCaseWithError = () => {
  class AuthCaseSpy {
    async auth() {
      throw new Error();
    }
  }

  return new AuthCaseSpy();
};

describe("Login Router", () => {
  it("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: "123",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("email"));
  });

  it("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError("password"));
  });

  it("Should return 500 if no http request is provided", async () => {
    const { sut } = makeSut();
    const response = await sut.route();
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 500 if http request has no body", async () => {
    const { sut } = makeSut();
    const response = await sut.route({});
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should call AuthUseCase with correct params", async () => {
    const { sut, authCase } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "123",
      },
    };
    await sut.route(httpRequest);
    expect(authCase.email).toBe(httpRequest.body.email);
    expect(authCase.password).toBe(httpRequest.body.password);
  });

  it("Should return 401 if invalid credentials", async () => {
    const { sut, authCase } = makeSut();
    authCase.accessToken = null;
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(new UnauthorizedError());
  });

  it("Should return 500 if no authcase is provided", async () => {
    const sutWithNoAuthUseCase = new LoginRouter(null);
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = await sutWithNoAuthUseCase.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 500 if no authcase has no auth method", async () => {
    const sutWithNoAuthUseCase = new LoginRouter({});
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = await sutWithNoAuthUseCase.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 500 if no email validator is provided", async () => {
    const sutWithNoEmailValidator = new LoginRouter(makeAuthUseCase(), null);
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = await sutWithNoEmailValidator.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 500 if emailValitor has no isValid method", async () => {
    const sutWithNoAuthUseCase = new LoginRouter(makeAuthUseCase(), {});
    const httpRequest = {
      body: {
        email: "invalid@email.com",
        password: "invalid_password",
      },
    };
    const response = await sutWithNoAuthUseCase.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 200 when valid credentials is provided", async () => {
    const { sut, authCase } = makeSut();
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toEqual(authCase.accessToken);
  });

  it("Should return 500 when an exception is throwed by AuthUseCase", async () => {
    const authCase = makeAuthUseCaseWithError();
    const sut = new LoginRouter(authCase);
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should return 400 if invalid email is provided", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    emailValidatorSpy.emailIsValid = false;
    const httpRequest = {
      body: {
        email: "invalid_email@mail.com",
        password: "anyPassword",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError("email"));
  });

  it("Should return 500 when an exception is throwed by EmailValidator", async () => {
    const authCase = makeAuthUseCase();
    const emailValidatorWithError = makeEmailValidatorWithError();
    const sut = new LoginRouter(authCase, emailValidatorWithError);
    const httpRequest = {
      body: {
        email: "valid@email.com",
        password: "valid_password",
      },
    };
    const response = await sut.route(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
  });

  it("Should call EmailValidator with correct email", async () => {
    const { sut, emailValidatorSpy } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "123",
      },
    };
    await sut.route(httpRequest);
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email);
  });
});
