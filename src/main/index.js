const mongoHelper = require("../infra/helpers/mongo-helper");
const env = require("./config/env");

mongoHelper
  .connect(env.mongoUrl)
  .then(() => {
    const app = require("./config/app");
    app.listen(port, () => {
      console.log(`Server Running on Port ${port}`);
    });
  })
  .catch(console.error);
