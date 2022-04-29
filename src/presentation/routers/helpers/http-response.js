const MissingParamError = require('./missing-param-error')

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
};
