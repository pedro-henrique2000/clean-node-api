const LoginRouter = require("../../presentation/routers/login-router");
const AuthUseCase = require("../../domain/auth-usecase");
const EmailValidator = require("../../utils/helpers/email-validator");
const LoadUserByEmailRepository = require("../../infra/repositories/load-user-by-email-repository");
const UpdateAccessTokenRepository = require("../../infra/repositories/update-user-token-repository");
const Encrypter = require("../../utils/helpers/encrypter");
const TokenGenerator = require("../../utils/helpers/token-generator");
const env = require("../config/env");

const emailValidator = new EmailValidator();
const updateAccessTokenRepository = new UpdateAccessTokenRepository();
const loadUserByEmailRepository = new LoadUserByEmailRepository();
const encrypter = new Encrypter();
const tokenGen = new TokenGenerator(env.tokenSecret);
const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  encrypter,
  tokenGen,
});
const loginRouter = new LoginRouter({ authUseCase, emailValidator });

module.exports = loginRouter
