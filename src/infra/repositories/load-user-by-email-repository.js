module.exports = class LoadUserByEmailRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }
  async load(email) {
    const user = await this.userModel.findOne(
      { email },
      {
        password: 1,
      }
    );
    return user;
  }
};
