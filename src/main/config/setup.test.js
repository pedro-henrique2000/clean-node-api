const request = require("supertest");
const app = require("./app");

describe("App Setup", () => {
  it("should disable x-powered-by", async () => {
    app.get("/test_x_powered_by", (req, res) => {
      res.send(``);
    });
    const res = await request(app).get("/test_x_powered_by");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("should enable CORS", async () => {
    app.get("/test_cors", (req, res) => {
      res.send(`123`);
    });
    const res = await request(app).get("/test_cors");
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-methods"]).toBe("*");
    expect(res.headers["access-control-allow-headers"]).toBe("*");
  });
});
