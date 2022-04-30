const validator = require("validator");

class EmailValidator {
  isValid(email) {
    return validator.isEmail(email);
  }
}

const makeSut = () => {
  return new EmailValidator();
};

describe("Email Validator", () => {
  it("Should return true if validator returns true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });

  it("Should return false if validator returns false", () => {
    const sut = makeSut();
    validator.isEmailValid = false;
    const isValid = sut.isValid("invalid_email@mail.com");
    expect(isValid).toBe(false);
  });

  it("Should call validator with correct email", () => {
    const sut = makeSut();
    const email = "any@mail.com";
    sut.isValid(email);
    expect(validator.email).toBe(email);
  });
});
