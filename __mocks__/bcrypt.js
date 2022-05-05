module.exports = {
  isValid: true,
  password: "",
  hashPassword: "",

  async compare(password, hashpassword) {
    this.password = password;
    this.hashpassword = hashpassword;
    return this.isValid;
  },
};
