class EmailValidator {
    isValid(email) {
        return true;
    }
}

describe("Email Validator", () => {
  it("Should return true if validator returns true", () => {
    const sut = new EmailValidator();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });
});
