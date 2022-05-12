const {MissingParamError} = require(`../../utils/errors`);
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {
  constructor() {}
  async load(email) {
    if (!email) {
      throw new MissingParamError("email");
    }

    const userModel = await MongoHelper.getCollection('users');
    const user = await userModel.findOne(
      { email },
      {
        password: 1,
      }
    );
    return user;
  }
};
