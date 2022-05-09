const cors = require("../middleware/cors");
const expressJson = require("../middleware/json-parser");
module.exports = (app) => {
  app.disable("x-powered-by");
  app.use(cors);
  app.use(expressJson);
};
