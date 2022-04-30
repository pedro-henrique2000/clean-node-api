const validator = require("validator");

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

describe("Email Validator", () => {
  it("Should return true if validator returns true", () => {
    const sut = new EmailValidator();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });

  it("Should return false if validator returns false", () => {
    const sut = new EmailValidator();
    validator.isEmailValid = false;
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });
});
