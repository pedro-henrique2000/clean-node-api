const {MissingParamError} = require(`../../utils/errors`);
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class LoadUserByEmailRepository {
  constructor() {}
  async load(email) {
    if (!email) {
      throw new MissingParamError("email");
    }

    const db = await MongoHelper.getDb();
    const user = await db.collection('users').findOne(
      { email },
      {
        password: 1,
      }
    );
    return user;
  }
};
