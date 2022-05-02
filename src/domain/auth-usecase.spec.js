const { MissingParamError } = require("../utils/errors");
const AuthUseCase = require("./auth-usecase");

const makeSut = () => {
  class EncrypterSpy {
    async compare(password, hashedPassword) {
      this.password = password;
      this.hashedPassword = hashedPassword;
    }
  }

  const encrypterSpy = new EncrypterSpy();

  class LoadUserByEmailRepositorySpy {
    async load(email) {
      this.email = email;
      return this.user;
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
  loadUserByEmailRepositorySpy.user = {
    password: 'hashed_password'
  }
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy);
  return { sut, loadUserByEmailRepositorySpy, encrypterSpy };
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
    expect(promise).rejects.toThrow();
  });

  it("Should Throw if No LoadUserByEmailRepository Load Method is provided", async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth("anyMail", "anyPassword");
    expect(promise).rejects.toThrow();
  });

  it("Should Return Null If an invalid email is provided", async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut();
    loadUserByEmailRepositorySpy.user = null;
    const promise = await sut.auth("invalidEmail@email.com", "anyPassword");
    expect(promise).toBeNull();
  });

  it("Should Return Null If an invalid password is provided", async () => {
    const { sut } = makeSut();
    const promise = await sut.auth("anyEmail@email.com", "invalidPassword");
    expect(promise).toBeNull();
  });

  it("Should call Encrypter with correct values", async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = makeSut();
    await sut.auth("anyEmail@email.com", "anyPassword");
    expect(encrypterSpy.password).toBe("anyPassword");
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password);
  });
});
