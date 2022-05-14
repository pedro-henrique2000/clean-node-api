const request = require("supertest");
const app = require(`../config/app`);
const bcrypt = require('bcrypt')
const MongoHelper = require("../../infra/helpers/mongo-helper");

let userModel;

describe("Login Routes", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL, null);
    userModel = await MongoHelper.getCollection("users");
  });

  beforeEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("should return 200 when valid credentials are provided", async () => {
    const user = await userModel.insertOne({
      email: "email@mail.com",
      name: "any_name",
      age: 50,
      state: "any",
      password: bcrypt.hashSync("hashedPassword", 10),
    });

    await request(app)
      .post(`/api/login`)
      .send({
        email: "email@mail.com",
        password: "hashedPassword",
      })
      .expect(200);
  });
});
