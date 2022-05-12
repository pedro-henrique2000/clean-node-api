const MongoHelper = require("./mongo-helper");

describe("MongoHelper", () => {
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test("Should reconnect if no connect if client is null", async () => {
    await MongoHelper.connect(process.env.MONGO_URL, null);
    expect(MongoHelper.db).toBeDefined();
    await MongoHelper.disconnect();
    expect(MongoHelper.db).toBeNull();
    expect(MongoHelper.client).toBeNull();
    await MongoHelper.getCollection('users');
    expect(MongoHelper.db).toBeTruthy();
    expect(MongoHelper.client).toBeTruthy();
  });
});
