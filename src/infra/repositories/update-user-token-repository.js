const { MissingParamError } = require("../../utils/errors");
const MongoHelper = require("../helpers/mongo-helper");

module.exports = class UpdateUserTokenRepository {
  constructor() {}
  async update(userId, accessToken) {
    if (!userId) {
      throw new MissingParamError("userId");
    }

    if (!accessToken) {
      throw new MissingParamError("accessToken");
    }

    const userModel = await MongoHelper.getCollection("users");
    await userModel.updateOne({ _id: userId }, { $set: { accessToken } });
  }
};
