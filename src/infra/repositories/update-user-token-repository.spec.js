const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helpers/mongo-helper");

class UpdateUserTokenRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async update(userId, accessToken) {
    if (!userId) {
      throw new MissingParamError("userId");
    }

    if (!accessToken) {
      throw new MissingParamError("accessToken");
    }
    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } });
  }
}

let db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new UpdateUserTokenRepository(userModel);
  return { sut, userModel };
};

describe("Update User Token Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, null);
    db = await MongoHelper.getDb();
  });

  beforeEach(async () => {
    await db.collection(`users`).deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("Should user token with correct accessToken", async () => {
    const { sut, userModel } = makeSut();
    const hashedPassword = "hashed_password";
    const email = "valid_mail@mail.com";
    const createdUser = await userModel.insertOne({
      email,
      name: "any_name",
      age: 50,
      state: "any",
      password: hashedPassword,
    });
    await sut.update(createdUser.insertedId, "valid_token");
    const updatedUser = await userModel.findOne({
      _id: createdUser.insertedId,
    });
    expect(updatedUser.accessToken).toBe("valid_token");
  });

  test(`should throw if no userId is provided`, async () => {
    const { sut } = makeSut();
    const promise = sut.update(null, "valid_token");
    expect(promise).rejects.toThrow(new MissingParamError("userId"));
  });

  test(`should throw if no accessToken is provided`, async () => {
    const { sut } = makeSut();
    const promise = sut.update("valid_id", null);
    expect(promise).rejects.toThrow(new MissingParamError("accessToken"));
  });

  it(`should throw if no userModel is provided`, async () => {
    const userModel = db.collection("users");
    const sut = new UpdateUserTokenRepository();
    const hashedPassword = "hashed_password";
    const email = "valid_mail@mail.com";
    const createdUser = await userModel.insertOne({
      email,
      name: "any_name",
      age: 50,
      state: "any",
      password: hashedPassword,
    });
    const promise = sut.update(createdUser.insertedId, "valid_token");
    expect(promise).rejects.toThrow();
  });
});
