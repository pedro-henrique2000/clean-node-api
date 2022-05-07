const {MissingParamError} = require(`../../utils/errors`);

module.exports = class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async load(email) {
    if (!email) {
      throw new MissingParamError("email");
    }
    const user = await this.userModel.findOne(
      { email },
      {
        password: 1,
      }
    );
    return user;
  }
};
