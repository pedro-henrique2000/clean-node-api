module.exports = class ServerError extends Error {
  constructor() {
    super("Internal Error Occurred");
    this.name = "ServerError";
  }
};
