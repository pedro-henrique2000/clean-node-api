const MongoHelper = require("../helpers/mongo-helper");
const LoadUserByEmailRepository = require("./load-user-by-email-repository");

let db;

const makeSut = () => {
  const userModel = db.collection("users");
  const sut = new LoadUserByEmailRepository(userModel);
  return { sut, userModel };
};

describe(`LoadUserByEmailRepository`, () => {
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

  test(`should return null if no user is found`, async () => {
    const { sut } = makeSut();
    const user = await sut.load("invalid_mail@mail.com");
    expect(user).toBeNull();
  });

  test(`should return an user if user exists`, async () => {
    const { sut, userModel } = makeSut();
    const hashedPassword = "hashed_password";
    const email = "valid_mail@mail.com";
    const fakeUser = await userModel.insertOne({
      email,
      name: "any_name",
      age: 50,
      state: "any",
      password: hashedPassword,
    });
    const user = await sut.load("valid_mail@mail.com");
    expect(user._id).toEqual(fakeUser.insertedId);
    expect(user.email).toEqual(email);
    expect(user.password).toEqual(hashedPassword);
  });
});
