class AuthUseCase {
  async auth(email, password) {
    if (!email) {
      throw new Error();
    }
  }
}

describe("AuthUseCase", () => {
  it("Should Throw Error If null Email Is Provided", async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    expect(promise).reject.toThrow();
  });
});
