const {MissingParamError} = require('../utils/errors')

class AuthUseCase {
  async auth(email, password) {
    if (!email) {
      throw new MissingParamError('email');
    }

    if (!password) {
      throw new MissingParamError('password');
    }
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
});
