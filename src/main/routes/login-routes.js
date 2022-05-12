const loginRouter = require("../composers/login-router.composer");
const ExpressRouterAdapter = require("../adapters/express-router.adapter");

module.exports = (router) => {
  router.post("/api/login", ExpressRouterAdapter.adapt(router));
};
