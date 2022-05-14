jest.mock('jsonwebtoken', () => ({
  token: "any_token",
  secret: "",

  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
}))

const jwt = require("jsonwebtoken");
const MissingParamError = require(`../errors/`);
const TokenGenerator = require('./token-generator')

const makeSut = () => {
  const tokenGen = new TokenGenerator("secret");
  return tokenGen;
};

describe("Token Generator", () => {
  it("Should return null if JWT return null", async () => {
    const sut = makeSut();
    jwt.token = null;
    const token = await sut.generate("any_id");
    expect(token).toBeNull();
  });

  it("Should return token if JWT returns a token", async () => {
    const sut = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBe(jwt.token);
  });

  it("Should call generate with correct params", async () => {
    const sut = makeSut();
    await sut.generate("any_id");
    expect(jwt.payload).toEqual({_id: `any_id`})
    expect(jwt.secret).toBe(sut.secret);
  });

  it("Should throw if no secret is provided", async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate("any_id");
    expect(promise).rejects.toThrow();
  });

  it("Should throw if no id is provided", async () => {
    const sut = makeSut();
    const promise = sut.generate(null);
    expect(promise).rejects.toThrow();
  });
});
