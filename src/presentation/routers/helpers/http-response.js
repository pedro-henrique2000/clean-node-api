const MissingParamError = require("./missing-param-error");
const UnauthorizedError = require("./unauthorized-error");

module.exports = class HttpResponse {
  static badRequest(missingParam) {
    return {
      statusCode: 400,
      body: new MissingParamError(missingParam),
    };
  }

  static internalError() {
    return {
      statusCode: 500,
    };
  }

  static unauthorized() {
    return {
      statusCode: 401,
      body: new UnauthorizedError(),
    };
  }

  static ok(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }
};
