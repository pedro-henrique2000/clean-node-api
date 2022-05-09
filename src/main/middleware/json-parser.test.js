const request = require("supertest");
const app = require("../config/app");

describe("Json Parser Middleware", () => {
  it("Should parse body as JSON", async () => {
    app.post("/test_parse_body_JSON", (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post("/test_parse_body_JSON")
      .send({ name: "Pedro" })
      .expect({ name: "Pedro" });
  });
});
