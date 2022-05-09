const cors = require("../middleware/cors");
const expressJson = require("../middleware/json-parser");
const contentType = require("../middleware/content-type");

module.exports = (app) => {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(expressJson);
  app.use(contentType);
};
