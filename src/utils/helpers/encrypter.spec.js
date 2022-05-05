const Encrypter = require("./encrypter");
const bcrypt = require("bcrypt");

const makeSut = () => {
  return new Encrypter();
};

describe("Encrypter", () => {
  it("Should return true if bcrypt returns true", async () => {
    const sut = makeSut();
    const isValid = await sut.compare("anyPassword", "anyHashed");
    expect(isValid).toBe(true);
  });

  it("Should return false if bcrypt returns false", async () => {
    const sut = makeSut();
    bcrypt.isValid = false;
    const isValid = await sut.compare("invalidPassword", "invalidHash");
    expect(isValid).toBe(false);
  });

  it("Should call bcrypt with correct values", async () => {
    const sut = makeSut();
    await sut.compare("anyPassword", "anyHashed");
    expect(bcrypt.password).toBe("anyPassword");
    expect(bcrypt.hashpassword).toBe("anyHashed");
  });
});
