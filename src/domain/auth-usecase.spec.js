const { MissingParamError } = require("../utils/errors");
const AuthUseCase = require("./auth-usecase");

const makeTokenGenerator = () => {
  class TokenGenerator {
    async generate(userId) {
      this.userId = userId;
      return this.accessToken;
    }
  }

  const tokenGeneratorSpy = new TokenGenerator();
  tokenGeneratorSpy.accessToken = "any_token";
  return tokenGeneratorSpy;
};

const makeTokenGeneratorWithError = () => {
  class TokenGenerator {
    async generate(userId) {
      throw new Error();
    }
  }

  return new TokenGenerator();
};

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
      return this.isValid;
    }
  }

  const encrypterSpy = new EncrypterSpy();
  encrypterSpy.isValid = true;

  return encrypterSpy;
};

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      throw new Error();
    }
  }

  return new EncrypterSpy();
};

const makeLoadUserByEmailRepositorySpy = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    id: "any_id",
    password: "hashed_password",
  };

  return loadUserByEmailRepositorySpy;
};

const makeLoadUserByEmailRepositorySpyWithError = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      throw new Error();
    }
  }
  return new LoadUserByEmailRepositorySpy();
}

const makeUpdateAccessTokenRepository = () => {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      this.userId = userId;
      this.accessToken = accessToken;
    }
  }
  return new UpdateAccessTokenRepositorySpy();
}

const makeUpdateAccessTokenRepositoryWithError = () => {
  class UpdateAccessTokenRepositorySpy {
    async update(userId, accessToken) {
      throw new Error()
    }
  }
  return new UpdateAccessTokenRepositorySpy();
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter();
  const loadUserByEmailRepositorySpy = makeLoadUserByEmailRepositorySpy();
  const updateAccessTokenRepositorySpy = makeUpdateAccessTokenRepository();
  const tokenGeneratorSpy = makeTokenGenerator();
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    updateAccessTokenRepository: updateAccessTokenRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy,
  });
  return { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, encrypterSpy, tokenGeneratorSpy };
};

describe("AuthUseCase", () => {
  it("Should Throw Error If null Email Is Provided", () => {
    const { sut } = makeSut();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError("email"));
  });

  it("Should Throw Error If null Password Is Provided", () => {
    const { sut } = makeSut();
    const promise = sut.auth("anyMail");
    expect(promise).rejects.toThrow(new MissingParamError("password"));
  });

  it("Should Call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    await sut.auth("anyMail", "anyPassword");
    expect(loadUserByEmailRepositorySpy.email).toBe("anyMail");
  });



  it("Should Return Null If an invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const promise = await sut.auth("invalidEmail@email.com", "anyPassword");
    expect(promise).toBeNull();
  });

  it("Should Return Null If an invalid password is provided", async () => {
    const { sut, encrypterSpy } = makeSut();
    encrypterSpy.isValid = false;
    const promise = await sut.auth("anyEmail@email.com", "invalidPassword");
    expect(promise).toBeNull();
  });

  it("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("anyEmail@email.com", "anyPassword");
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  it("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, tokenGeneratorSpy } = makeSut();
    const accessToken = await sut.auth("anyEmail@email.com", "anyPassword");
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken);
    expect(accessToken).toBeTruthy();
  });

  it("Should return an accessToken if correct credentials are provided", async () => {
    const { sut, loadUserByEmailRepositorySpy, updateAccessTokenRepositorySpy, tokenGeneratorSpy } = makeSut();
    await sut.auth("anyEmail@email.com", "anyPassword");
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken);
  });

  it("Should Throw if invalid dependecies are provided", async () => {
    const invalid = {}
    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase({}),
      new AuthUseCase({ loadUserByEmailRepository: null }),
      new AuthUseCase({ loadUserByEmailRepository: {} }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: null }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: invalid }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: null }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: invalid }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGeneratorWithError() }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator()
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator(), updateAccessTokenRepository: null
      }),
      new AuthUseCase({
        loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator(), updateAccessTokenRepository: invalid
      })
    )
    for (const sut of suts) {
      const promise = sut.auth("anyMail", "anyPassword");
      expect(promise).rejects.toThrow();

    }
  });

  it("Should Throw if a dependecie throws an error", async () => {
    const suts = [].concat(
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpyWithError(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypterWithError(), tokenGenerator: makeTokenGenerator() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGeneratorWithError() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator() }),
      new AuthUseCase({ loadUserByEmailRepository: makeLoadUserByEmailRepositorySpy(), encrypter: makeEncrypter(), tokenGenerator: makeTokenGenerator(), updateAccessTokenRepository: makeUpdateAccessTokenRepositoryWithError() })

    )
    for (const sut of suts) {
      const promise = sut.auth("anyMail@mail.com", "anyPassword");
      expect(promise).rejects.toThrow();
    }
  });
});
