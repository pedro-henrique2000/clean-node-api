const {MissingParamError} = require('../utils/errors')

class AuthUseCase {
  constructor(loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }

    if (!password) {
      throw new MissingParamError('password');
    }

    await this.loadUserByEmailRepository.load(email)

  }
}

describe("AuthUseCase", () => {
  it("Should Throw Error If null Email Is Provided", () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it("Should Throw Error If null Password Is Provided", () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('anyMail');
    expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it("Should Call LoadUserByEmailRepository with correct email", async () => {
    class LoadUserByEmailRepositorySpy {
      async load(email) {
        this.email = email;
      }
    }
    const loadUserByEmail = new LoadUserByEmailRepositorySpy();
    const sut = new AuthUseCase(loadUserByEmail);
    await sut.auth('anyMail', 'anyPassword');
    expect(loadUserByEmail.email).toBe('anyMail')
  });
});
