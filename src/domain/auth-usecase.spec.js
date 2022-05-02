const { MissingParamError, InvalidParamError } = require("../utils/errors");

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError("email");
    }

    if (!password) {
      throw new MissingParamError("password");
    }

    if (!this.loadUserByEmailRepository) {
      throw new MissingParamError("loadByUserEmailRepository");
    }

    if (!this.loadUserByEmailRepository.load) {
      throw new InvalidParamError("loadByUserEmailRepository");
    }

    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;
  }
}

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy);
  return { sut, loadUserByEmailRepositorySpy };
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

  it("Should Throw if No LoadUserByEmailRepository is provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth("anyMail", "anyPassword");
    expect(promise).rejects.toThrow(
      new MissingParamError("loadByUserEmailRepository")
    );
  });

  it("Should Throw if No LoadUserByEmailRepository Load Method is provided", async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth("anyMail", "anyPassword");
    expect(promise).rejects.toThrow(
      new InvalidParamError("loadByUserEmailRepository")
    );
  });

  it("Should Return Null If LoadByUserEmailRepository returns null", async () => {
    const {sut} = makeSut();
    const promise = await sut.auth("invalidEmail@email.com", "anyPassword");
    expect(promise).toBeNull();
  });
});
